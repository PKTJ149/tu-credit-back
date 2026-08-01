"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, ImageOff } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FieldError, FormErrorSummary, StringListField } from "@/components/admin/form-fields";
import { getStaffName, TODAY } from "@/lib/admin/mock-data";
import { useStaffSession } from "@/lib/admin/staff-session";
import {
  contentCategoryLabel,
  newsArticles,
  publishStateLabel,
  newsPublishStateEffect,
  publishStateTone,
} from "@/lib/admin/mock-content";
import type { ContentCategory, NewsArticle, PublishState } from "@/lib/admin/types";
import { formatThaiDate, formatThaiDateLong } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

type FormState = {
  title: string;
  slug: string;
  category: ContentCategory;
  excerpt: string;
  body: string;
  coverImage: string;
  tags: string[];
  state: PublishState;
  publishAt: string;
  eventDate: string;
  eventLocation: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function emptyForm(): FormState {
  return {
    title: "",
    slug: "",
    category: "news",
    excerpt: "",
    body: "",
    coverImage: "",
    tags: [],
    state: "draft",
    publishAt: "",
    eventDate: "",
    eventLocation: "",
  };
}

function toFormState(article: NewsArticle): FormState {
  return {
    title: article.title,
    slug: article.slug,
    category: article.category,
    excerpt: article.excerpt,
    body: article.body,
    coverImage: article.coverImage ?? "",
    tags: [...article.tags],
    state: article.state,
    publishAt: article.publishAt ?? "",
    eventDate: article.eventDate ?? "",
    eventLocation: article.eventLocation ?? "",
  };
}

function validate(v: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!v.title.trim()) errors.title = "กรุณาระบุชื่อเรื่อง";
  if (!v.slug.trim()) errors.slug = "กรุณาระบุ slug";
  else if (!/^[a-z0-9-]+$/.test(v.slug.trim()))
    errors.slug = "slug ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลาง";
  if (!v.excerpt.trim()) errors.excerpt = "กรุณาระบุคำโปรยสั้น";
  if (!v.body.trim()) errors.body = "กรุณาระบุเนื้อหา";
  if ((v.state === "scheduled" || v.state === "published") && !v.publishAt.trim())
    errors.publishAt = "กรุณาระบุวันที่เผยแพร่ เมื่อสถานะเป็น “ตั้งเวลาเผยแพร่” หรือ “เผยแพร่แล้ว”";
  if (v.category === "activity") {
    if (!v.eventDate.trim()) errors.eventDate = "กรุณาระบุวันที่จัดกิจกรรม";
    if (!v.eventLocation.trim()) errors.eventLocation = "กรุณาระบุสถานที่จัดกิจกรรม";
  }
  return errors;
}

type ArticleEditorViewProps = { mode: "create" } | { mode: "edit"; article: NewsArticle };

/** Shared by both `/content/news/new` and `/content/news/[id]` — one editor,
 *  not two, matching the "one entity with a category" decision this whole
 *  area is built on. */
export function ArticleEditorView(props: ArticleEditorViewProps) {
  const router = useRouter();
  const { staff } = useStaffSession();
  const isCreate = props.mode === "create";

  const [current, setCurrent] = useState<NewsArticle | null>(isCreate ? null : props.article);
  const [values, setValues] = useState<FormState>(() => (isCreate ? emptyForm() : toFormState(props.article)));
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  /** Local id sequence — a prototype has no server to hand one out, and
   *  `Date.now()` would render differently on every machine. */
  const nextIdRef = useRef(newsArticles.length + 1);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (attempted) setErrors(validate(next));
      return next;
    });
  }

  function handleSave() {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setAttempted(true);
    if (Object.keys(nextErrors).length > 0) return;

    const isActivity = values.category === "activity";
    const isTimed = values.state === "scheduled" || values.state === "published";

    const saved: NewsArticle = {
      id: current?.id ?? `news-new-${nextIdRef.current}`,
      slug: values.slug.trim(),
      title: values.title.trim(),
      category: values.category,
      state: values.state,
      excerpt: values.excerpt.trim(),
      body: values.body.trim(),
      coverImage: values.coverImage.trim() || undefined,
      publishAt: isTimed ? values.publishAt : undefined,
      authorStaffId: current?.authorStaffId ?? staff?.id ?? "st1",
      updatedAt: TODAY,
      tags: values.tags.filter((t) => t.trim() !== ""),
      eventDate: isActivity ? values.eventDate.trim() || undefined : undefined,
      eventLocation: isActivity ? values.eventLocation.trim() || undefined : undefined,
    };

    setCurrent(saved);
    toast.success(`บันทึกข้อมูล "${saved.title}" แล้ว`);

    // A brand-new article has nowhere of its own to stay on — the list it
    // came from reads the static mock array, not this component's state — so
    // saving a create sends the writer back to it rather than stranding them
    // on a URL for an id the list doesn't know about.
    if (isCreate) {
      router.push("/admin/content/news");
    }
  }

  const stateOptions = Object.keys(publishStateLabel) as PublishState[];
  const showPublishAt = values.state === "scheduled" || values.state === "published";

  return (
    <>
      <PageHeader
        title={isCreate ? "เขียนข่าว/กิจกรรมใหม่" : (current?.title ?? "")}
        crumbs={[
          { label: "ข่าวและกิจกรรม", href: "/admin/content/news" },
          { label: isCreate ? "เขียนใหม่" : (current?.title ?? "") },
        ]}
        backHref="/admin/content/news"
        backLabel="กลับไปรายการข่าวและกิจกรรม"
        description={isCreate ? "กรอกข้อมูลให้ครบ แล้วเลือกสถานะที่ต้องการก่อนบันทึก" : `slug: ${current?.slug}`}
        actions={
          <>
            {!isCreate && current ? (
              <StatusBadge label={publishStateLabel[current.state]} tone={publishStateTone[current.state]} />
            ) : null}
            <Button type="button" variant="outline" className="h-11" onClick={() => setPreviewOpen(true)}>
              <Eye className="size-4" aria-hidden />
              ดูตัวอย่าง
            </Button>
            <Button type="button" className="h-11" onClick={handleSave}>
              บันทึก
            </Button>
          </>
        }
      />

      <FormErrorSummary count={Object.keys(errors).length} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Panel title="ข้อมูลบทความ" description="ชื่อเรื่อง หมวดหมู่ และคำโปรยที่แสดงในรายการข่าวสาร">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="a-title">
                  ชื่อเรื่อง<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="a-title"
                  value={values.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "a-title-error" : undefined}
                />
                <FieldError id="a-title-error" message={errors.title} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="a-slug">
                  Slug<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="a-slug"
                  value={values.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="เช่น open-house-2569"
                  aria-invalid={Boolean(errors.slug)}
                  aria-describedby={errors.slug ? "a-slug-error" : undefined}
                />
                <FieldError id="a-slug-error" message={errors.slug} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="a-category">
                  หมวดหมู่<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Select value={values.category} onValueChange={(v) => updateField("category", v as ContentCategory)}>
                  <SelectTrigger id="a-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">{contentCategoryLabel.news}</SelectItem>
                    <SelectItem value="activity">{contentCategoryLabel.activity}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="a-excerpt">
                  คำโปรยสั้น<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Textarea
                  id="a-excerpt"
                  rows={2}
                  value={values.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  aria-invalid={Boolean(errors.excerpt)}
                  aria-describedby={errors.excerpt ? "a-excerpt-error" : undefined}
                />
                <FieldError id="a-excerpt-error" message={errors.excerpt} />
              </div>
            </div>
          </Panel>

          <Panel title="เนื้อหา" description="ข้อความเต็มและภาพปกที่ผู้เรียนเห็นในหน้ารายละเอียด">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="a-body">
                  เนื้อหา<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Textarea
                  id="a-body"
                  rows={10}
                  value={values.body}
                  onChange={(e) => updateField("body", e.target.value)}
                  aria-invalid={Boolean(errors.body)}
                  aria-describedby={errors.body ? "a-body-error" : undefined}
                />
                <FieldError id="a-body-error" message={errors.body} />
                <p className="text-xs text-[var(--ink-subtle)]">ขึ้นย่อหน้าใหม่ด้วยการเว้นบรรทัดว่างหนึ่งบรรทัด</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="a-cover">ภาพปก (URL)</Label>
                <Input
                  id="a-cover"
                  value={values.coverImage}
                  onChange={(e) => updateField("coverImage", e.target.value)}
                  placeholder="/images/banners/example.png"
                />
                <CoverImageFrame
                  src={values.coverImage}
                  alt={values.title || "ภาพปกข่าว"}
                  className="mt-2 aspect-[21/9] w-full rounded-lg"
                />
              </div>

              <StringListField
                id="a-tags"
                label="แท็ก"
                items={values.tags}
                onChange={(items) => updateField("tags", items)}
                addLabel="เพิ่มแท็ก"
                placeholder="เช่น หลักสูตรใหม่"
                emptyHint="ยังไม่มีแท็กที่ระบุไว้"
              />
            </div>
          </Panel>

          {/* Progressive disclosure: only a real field for the "activity" half of this entity. */}
          {values.category === "activity" ? (
            <Panel title="รายละเอียดกิจกรรม" description="แสดงเฉพาะเมื่อหมวดหมู่เป็น “กิจกรรม”">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="a-event-date">
                    วันที่จัดกิจกรรม<span className="ms-1 text-[var(--destructive)]">*</span>
                  </Label>
                  <Input
                    id="a-event-date"
                    type="date"
                    value={values.eventDate}
                    onChange={(e) => updateField("eventDate", e.target.value)}
                    aria-invalid={Boolean(errors.eventDate)}
                    aria-describedby={errors.eventDate ? "a-event-date-error" : undefined}
                  />
                  <FieldError id="a-event-date-error" message={errors.eventDate} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="a-event-location">
                    สถานที่จัดกิจกรรม<span className="ms-1 text-[var(--destructive)]">*</span>
                  </Label>
                  <Input
                    id="a-event-location"
                    value={values.eventLocation}
                    onChange={(e) => updateField("eventLocation", e.target.value)}
                    placeholder="เช่น หอประชุมศรีบูรพา มหาวิทยาลัยธรรมศาสตร์"
                    aria-invalid={Boolean(errors.eventLocation)}
                    aria-describedby={errors.eventLocation ? "a-event-location-error" : undefined}
                  />
                  <FieldError id="a-event-location-error" message={errors.eventLocation} />
                </div>
              </div>
            </Panel>
          ) : null}
        </div>

        <div className="space-y-4">
          <Panel title="สถานะการเผยแพร่">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="a-state">สถานะ</Label>
                <Select value={values.state} onValueChange={(v) => updateField("state", v as PublishState)}>
                  <SelectTrigger id="a-state" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {publishStateLabel[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p aria-live="polite" className="text-xs leading-5 text-[var(--ink-muted)]">
                  {newsPublishStateEffect[values.state]}
                </p>
              </div>

              {showPublishAt ? (
                <div className="space-y-1.5">
                  <Label htmlFor="a-publish-at">
                    วันที่เผยแพร่<span className="ms-1 text-[var(--destructive)]">*</span>
                  </Label>
                  <Input
                    id="a-publish-at"
                    type="date"
                    value={values.publishAt}
                    onChange={(e) => updateField("publishAt", e.target.value)}
                    aria-invalid={Boolean(errors.publishAt)}
                    aria-describedby={errors.publishAt ? "a-publish-at-error" : undefined}
                  />
                  <FieldError id="a-publish-at-error" message={errors.publishAt} />
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel title="ข้อมูลเพิ่มเติม">
            <DetailList
              rows={[
                { label: "ผู้เขียน", value: getStaffName(current?.authorStaffId ?? staff?.id) },
                { label: "แก้ไขล่าสุด", value: current ? formatThaiDate(current.updatedAt) : "ยังไม่ได้บันทึก" },
              ]}
            />
          </Panel>
        </div>
      </div>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>ดูตัวอย่างบนหน้าเว็บ</SheetTitle>
            <SheetDescription>สิ่งที่ผู้เรียนจะเห็นในหน้ารายละเอียดข่าว/กิจกรรม หากบันทึกด้วยค่าปัจจุบัน</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 pb-6">
            <CoverImageFrame
              src={values.coverImage}
              alt={values.title || "ภาพปกข่าว"}
              className="aspect-video w-full rounded-xl"
            />
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--ink-subtle)]">
                {contentCategoryLabel[values.category]}
                {values.category === "activity" && values.eventDate ? ` · ${formatThaiDateLong(values.eventDate)}` : ""}
              </p>
              <h2 className="text-xl leading-tight font-semibold text-[var(--foreground)]">
                {values.title || "(ยังไม่ได้ตั้งชื่อเรื่อง)"}
              </h2>
              {values.category === "activity" && values.eventLocation ? (
                <p className="text-sm text-[var(--ink-muted)]">สถานที่: {values.eventLocation}</p>
              ) : null}
            </div>
            <p className="text-base leading-7 text-[var(--ink-muted)]">{values.excerpt || "(ยังไม่ได้ระบุคำโปรย)"}</p>
            <div className="space-y-3 text-sm leading-7 text-[var(--foreground)]">
              {(values.body || "(ยังไม่ได้ระบุเนื้อหา)").split(/\n\n+/).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Renders the real image when one exists and loads, and a clearly-labelled
 *  frame otherwise — never a broken-image icon. There is no dedicated
 *  `public/images/news` folder, so most articles legitimately have no cover
 *  yet; this makes that state visible instead of ambiguous. */
function CoverImageFrame({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const trimmed = src?.trim();

  if (!trimmed || failed) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-[var(--ink-subtle)]",
          className,
        )}
      >
        <ImageOff className="size-5" aria-hidden />
        <span className="text-xs font-medium">{trimmed ? "ไม่พบไฟล์ภาพนี้ในระบบ" : "ยังไม่ได้ตั้งค่าภาพปก"}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-[var(--surface-strong)]", className)}>
      <Image
        src={trimmed}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 640px, 100vw"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
