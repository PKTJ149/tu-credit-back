"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { StatusBadge } from "@/components/admin/status-badge";
import { FormErrorSummary } from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatThaiDate } from "@/lib/admin/format";
import { getStaffName, TODAY } from "@/lib/admin/mock-data";
import { publishStateLabel, publishStateTone } from "@/lib/admin/mock-pages";
import { useStaffSession } from "@/lib/admin/staff-session";
import type { PublishState, StaticPage } from "@/lib/admin/types";
import { SectionListField, type PageSectionDraft } from "./section-list-field";

/** A static page never uses "scheduled" here — there is no publish-at field
 *  on `StaticPage` to schedule against, same reasoning as help articles. */
type PageState = Extract<PublishState, "draft" | "published" | "archived">;

const STATE_OPTIONS: PageState[] = ["draft", "published", "archived"];

type SectionErrors = Record<string, { heading?: string; body?: string }>;

export function PageDetailView({ page }: { page: StaticPage }) {
  const { staff } = useStaffSession();
  const [current, setCurrent] = useState(page);
  const [title, setTitle] = useState(page.title);
  const [state, setState] = useState<PageState>(page.state === "scheduled" ? "draft" : page.state);
  const [sections, setSections] = useState<PageSectionDraft[]>(page.sections.map((s) => ({ ...s })));
  const [attempted, setAttempted] = useState(false);

  const sectionSeq = useRef(page.sections.length);
  function addSection() {
    sectionSeq.current += 1;
    setSections((prev) => [...prev, { id: `${page.id}-s-new-${sectionSeq.current}`, heading: "", body: "" }]);
  }

  const titleError = title.trim() === "" ? "กรุณาระบุชื่อหน้า" : undefined;
  const sectionErrors: SectionErrors = {};
  for (const section of sections) {
    const heading = section.heading.trim() === "" ? "กรุณาระบุหัวเรื่อง" : undefined;
    const body = section.body.trim() === "" ? "กรุณาระบุเนื้อหา" : undefined;
    if (heading || body) sectionErrors[section.id] = { heading, body };
  }
  const errorCount = (titleError ? 1 : 0) + Object.keys(sectionErrors).length;

  function handleSave() {
    setAttempted(true);
    if (errorCount > 0) return;

    setCurrent((prev) => ({
      ...prev,
      title: title.trim(),
      state,
      sections: sections.map((s) => ({ id: s.id, heading: s.heading.trim(), body: s.body.trim() })),
      updatedAt: TODAY,
      updatedByStaffId: staff?.id ?? prev.updatedByStaffId,
    }));
    toast.success(`บันทึกหน้า "${title.trim()}" แล้ว`);
  }

  return (
    <>
      <PageHeader
        title={current.title}
        crumbs={[{ label: "หน้าเนื้อหา", href: "/admin/content/pages" }, { label: current.title }]}
        backHref="/admin/content/pages"
        backLabel="กลับไปหน้าเนื้อหา"
        description={`slug: /${current.slug}`}
        actions={
          <>
            <StatusBadge label={publishStateLabel[current.state]} tone={publishStateTone[current.state]} />
            <Button type="button" className="h-11" onClick={handleSave}>
              บันทึกการเปลี่ยนแปลง
            </Button>
          </>
        }
      />

      {attempted ? <FormErrorSummary count={errorCount} /> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Panel title="ชื่อหน้า" description="ชื่อที่แสดงเป็นหัวข้อบนสุดของหน้า">
            <div className="space-y-1.5">
              <Label htmlFor="page-title">
                ชื่อหน้า<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="page-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={attempted && Boolean(titleError)}
                aria-describedby={attempted && titleError ? "page-title-error" : undefined}
              />
              {attempted && titleError ? (
                <p id="page-title-error" className="text-sm text-[var(--destructive)]">
                  {titleError}
                </p>
              ) : null}
            </div>
          </Panel>

          <Panel title="หัวข้อในหน้านี้" description="แต่ละหัวข้อคือหนึ่งส่วนของเนื้อหา เรียงตามลำดับที่แสดงจริง">
            <SectionListField
              sections={sections}
              onChange={setSections}
              onAdd={addSection}
              errors={attempted ? sectionErrors : undefined}
            />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="สถานะการเผยแพร่">
            <div className="space-y-2">
              <Label htmlFor="page-state">สถานะ</Label>
              <Select value={state} onValueChange={(v) => setState(v as PageState)}>
                <SelectTrigger id="page-state" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {publishStateLabel[opt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {current.slug === "contact" && state !== "published" ? (
                <p className="text-xs leading-5 text-[var(--ink-muted)]">
                  หน้านี้ยังไม่เคยเผยแพร่มาก่อน — ปัจจุบันเว็บไซต์ยังไม่มีหน้าติดต่อเราให้ผู้เรียนเห็นเลย
                </p>
              ) : null}
            </div>
          </Panel>

          <Panel title="ข้อมูลการแก้ไข">
            <DetailList
              rows={[
                { label: "แก้ไขล่าสุดโดย", value: getStaffName(current.updatedByStaffId) },
                { label: "แก้ไขเมื่อ", value: formatThaiDate(current.updatedAt) },
              ]}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
