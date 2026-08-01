"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge, RegistrationStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Program } from "@/lib/discovery/types";
import type { AdminRegistration } from "@/lib/admin/types";
import { subjects } from "@/lib/data/subjects";
import { teachers } from "@/lib/data/teachers";
import { getStudentById, getStudentName } from "@/lib/admin/mock-data";
import {
  catalogueStatusEffect,
  catalogueStatusLabel,
  catalogueStatusTone,
  facultyOptions,
  getProgramRegistrations,
  programLevelOptions,
  programTypeOptions,
  type CatalogueStatus,
} from "@/lib/admin/mock-academic";
import { FieldError, FormErrorSummary, MultiSelectList, StringListField } from "@/components/admin/form-fields";
import { formatThaiDate } from "@/lib/admin/format";

type FormState = {
  name: string;
  slug: string;
  level: string;
  faculty: string;
  type: string;
  credits: string;
  summary: string;
  description: string;
  duration: string;
  qualification: string;
  seats: string;
  totalPrice: string;
  originalPrice: string;
  status: CatalogueStatus;
  image: string;
  subjectIds: string[];
  teacherIds: string[];
  careerPaths: string[];
  outcomes: string[];
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function toFormState(program: Program): FormState {
  return {
    name: program.name,
    slug: program.slug,
    level: program.level,
    faculty: program.faculty,
    type: program.type ?? "",
    credits: String(program.credits),
    summary: program.summary,
    description: program.description ?? "",
    duration: program.duration ?? "",
    qualification: program.qualification ?? "",
    seats: program.seats !== undefined ? String(program.seats) : "",
    totalPrice: program.totalPrice !== undefined ? String(program.totalPrice) : "",
    originalPrice: program.originalPrice !== undefined ? String(program.originalPrice) : "",
    status: program.status ?? "open",
    image: program.image ?? "",
    subjectIds: program.subjectIds ?? [],
    teacherIds: program.teacherIds ?? [],
    careerPaths: program.careerPaths ?? [],
    outcomes: program.outcomes ?? [],
  };
}

function validate(v: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!v.name.trim()) errors.name = "กรุณาระบุชื่อหลักสูตร";
  if (!v.slug.trim()) errors.slug = "กรุณาระบุ slug ของหลักสูตร";
  else if (!/^[a-z0-9-]+$/.test(v.slug.trim())) errors.slug = "slug ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลาง";
  if (!v.level.trim()) errors.level = "กรุณาเลือกระดับหลักสูตร";
  if (!v.faculty.trim()) errors.faculty = "กรุณาเลือกคณะ";
  if (!v.summary.trim()) errors.summary = "กรุณาระบุคำโปรยสั้นของหลักสูตร";
  if (!v.description.trim()) errors.description = "กรุณาระบุรายละเอียดหลักสูตร";

  const credits = Number(v.credits);
  if (!v.credits.trim() || Number.isNaN(credits) || credits <= 0) errors.credits = "กรุณาระบุหน่วยกิตเป็นตัวเลขที่มากกว่า 0";

  const seats = Number(v.seats);
  if (!v.seats.trim() || Number.isNaN(seats) || seats <= 0) errors.seats = "กรุณาระบุจำนวนที่นั่งเป็นตัวเลขที่มากกว่า 0";

  const totalPrice = Number(v.totalPrice);
  if (!v.totalPrice.trim() || Number.isNaN(totalPrice) || totalPrice < 0) errors.totalPrice = "กรุณาระบุราคาเป็นตัวเลขที่ไม่ติดลบ";

  if (v.originalPrice.trim()) {
    const originalPrice = Number(v.originalPrice);
    if (Number.isNaN(originalPrice) || originalPrice < 0) errors.originalPrice = "ราคาก่อนหักส่วนลดต้องเป็นตัวเลขที่ไม่ติดลบ";
    else if (!Number.isNaN(totalPrice) && originalPrice < totalPrice)
      errors.originalPrice = "ราคาก่อนหักส่วนลดต้องไม่น้อยกว่าราคาปัจจุบัน";
  }

  return errors;
}

export function ProgramDetailView({ program }: { program: Program }) {
  const [current, setCurrent] = useState(program);
  const [values, setValues] = useState<FormState>(() => toFormState(program));
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);

  const registrations: AdminRegistration[] = getProgramRegistrations(program.id);

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

    setCurrent((prev) => ({
      ...prev,
      name: values.name.trim(),
      slug: values.slug.trim(),
      level: values.level,
      faculty: values.faculty,
      type: values.type || undefined,
      credits: Number(values.credits),
      summary: values.summary.trim(),
      description: values.description.trim(),
      duration: values.duration.trim() || undefined,
      qualification: values.qualification.trim() || undefined,
      seats: Number(values.seats),
      totalPrice: Number(values.totalPrice),
      originalPrice: values.originalPrice.trim() ? Number(values.originalPrice) : undefined,
      status: values.status,
      image: values.image.trim() || undefined,
      subjectIds: values.subjectIds,
      teacherIds: values.teacherIds,
      careerPaths: values.careerPaths.filter((c) => c.trim() !== ""),
      outcomes: values.outcomes.filter((o) => o.trim() !== ""),
    }));
    toast.success(`บันทึกข้อมูลหลักสูตร "${values.name.trim()}" แล้ว`);
  }

  const registrationColumns: Column<AdminRegistration>[] = [
    { key: "student", header: "ผู้เรียน", cell: (r) => getStudentName(r.studentId) },
    {
      key: "code",
      header: "รหัสผู้เรียน",
      cell: (r) => getStudentById(r.studentId)?.studentCode ?? "—",
      hideOnMobile: true,
    },
    { key: "term", header: "ภาคการศึกษา", cell: (r) => r.term, hideOnMobile: true },
    { key: "status", header: "สถานะ", cell: (r) => <RegistrationStatusBadge status={r.status} /> },
    { key: "registeredAt", header: "วันที่ลงทะเบียน", cell: (r) => formatThaiDate(r.registeredAt), align: "end", hideOnMobile: true },
  ];

  return (
    <>
      <PageHeader
        title={current.name}
        crumbs={[{ label: "หลักสูตร", href: "/admin/programs" }, { label: current.name }]}
        backHref="/admin/programs"
        backLabel="กลับไปรายการหลักสูตร"
        description={`slug: ${current.slug}`}
        actions={
          <>
            <StatusBadge label={catalogueStatusLabel[current.status ?? "open"]} tone={catalogueStatusTone[current.status ?? "open"]} />
            <Button type="button" className="h-11" onClick={handleSave}>
              บันทึกการเปลี่ยนแปลง
            </Button>
          </>
        }
      />

      <FormErrorSummary count={Object.keys(errors).length} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Panel title="ข้อมูลพื้นฐาน" description="ชื่อ ระดับ และการจัดหมวดหมู่ของหลักสูตร">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="p-name">
                  ชื่อหลักสูตร<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="p-name"
                  value={values.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "p-name-error" : undefined}
                />
                <FieldError id="p-name-error" message={errors.name} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-slug">
                  Slug<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="p-slug"
                  value={values.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  aria-invalid={Boolean(errors.slug)}
                  aria-describedby={errors.slug ? "p-slug-error" : undefined}
                />
                <FieldError id="p-slug-error" message={errors.slug} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-duration">ระยะเวลาเรียน</Label>
                <Input id="p-duration" value={values.duration} onChange={(e) => updateField("duration", e.target.value)} placeholder="เช่น 6 เดือน" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-level">
                  ระดับ<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Select value={values.level || undefined} onValueChange={(v) => updateField("level", v)}>
                  <SelectTrigger id="p-level" className="w-full" aria-invalid={Boolean(errors.level)} aria-describedby={errors.level ? "p-level-error" : undefined}>
                    <SelectValue placeholder="เลือกระดับ" />
                  </SelectTrigger>
                  <SelectContent>
                    {programLevelOptions.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id="p-level-error" message={errors.level} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-type">ประเภทหลักสูตร</Label>
                <Select value={values.type || undefined} onValueChange={(v) => updateField("type", v)}>
                  <SelectTrigger id="p-type" className="w-full">
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    {programTypeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-faculty">
                  คณะ<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Select value={values.faculty || undefined} onValueChange={(v) => updateField("faculty", v)}>
                  <SelectTrigger id="p-faculty" className="w-full" aria-invalid={Boolean(errors.faculty)} aria-describedby={errors.faculty ? "p-faculty-error" : undefined}>
                    <SelectValue placeholder="เลือกคณะ" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyOptions.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id="p-faculty-error" message={errors.faculty} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-credits">
                  หน่วยกิต<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="p-credits"
                  type="number"
                  min={0}
                  value={values.credits}
                  onChange={(e) => updateField("credits", e.target.value)}
                  aria-invalid={Boolean(errors.credits)}
                  aria-describedby={errors.credits ? "p-credits-error" : undefined}
                />
                <FieldError id="p-credits-error" message={errors.credits} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="p-image">รูปภาพหลักสูตร (URL)</Label>
                <Input id="p-image" value={values.image} onChange={(e) => updateField("image", e.target.value)} placeholder="/images/programs/example.png" />
              </div>
            </div>
          </Panel>

          <Panel title="รายละเอียด" description="ข้อความที่ผู้เรียนเห็นในหน้าคลังหลักสูตร">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-summary">
                  คำโปรยสั้น<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Textarea
                  id="p-summary"
                  rows={2}
                  value={values.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  aria-invalid={Boolean(errors.summary)}
                  aria-describedby={errors.summary ? "p-summary-error" : undefined}
                />
                <FieldError id="p-summary-error" message={errors.summary} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-description">
                  รายละเอียดหลักสูตร<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Textarea
                  id="p-description"
                  rows={8}
                  value={values.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "p-description-error" : undefined}
                />
                <FieldError id="p-description-error" message={errors.description} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-qualification">คุณสมบัติผู้เรียน</Label>
                <Textarea
                  id="p-qualification"
                  rows={3}
                  value={values.qualification}
                  onChange={(e) => updateField("qualification", e.target.value)}
                  placeholder="เช่น เปิดรับผู้ที่มีพื้นฐานคอมพิวเตอร์เบื้องต้น"
                />
              </div>
            </div>
          </Panel>

          <Panel title="ผลลัพธ์การเรียนรู้และเส้นทางอาชีพ" description="แสดงในหน้ารายละเอียดหลักสูตรของผู้เรียน">
            <div className="space-y-5">
              <StringListField
                id="p-outcomes"
                label="ผลลัพธ์การเรียนรู้"
                items={values.outcomes}
                onChange={(items) => updateField("outcomes", items)}
                addLabel="เพิ่มผลลัพธ์การเรียนรู้"
                placeholder="เช่น เขียนโปรแกรมเบื้องต้นได้"
                emptyHint="ยังไม่มีผลลัพธ์การเรียนรู้ที่ระบุไว้"
              />
              <StringListField
                id="p-career"
                label="เส้นทางอาชีพ"
                items={values.careerPaths}
                onChange={(items) => updateField("careerPaths", items)}
                addLabel="เพิ่มเส้นทางอาชีพ"
                placeholder="เช่น นักพัฒนาซอฟต์แวร์"
                emptyHint="ยังไม่มีเส้นทางอาชีพที่ระบุไว้"
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="สถานะการเปิดรับสมัคร">
            <div className="space-y-2">
              <Label htmlFor="p-status">สถานะ</Label>
              <Select value={values.status} onValueChange={(v) => updateField("status", v as CatalogueStatus)}>
                <SelectTrigger id="p-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">{catalogueStatusLabel.open}</SelectItem>
                  <SelectItem value="closed">{catalogueStatusLabel.closed}</SelectItem>
                </SelectContent>
              </Select>
              <p aria-live="polite" className="text-xs leading-5 text-[var(--ink-muted)]">
                {catalogueStatusEffect[values.status]}
              </p>
            </div>
          </Panel>

          <Panel title="ที่นั่งและราคา">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-seats">
                  จำนวนที่นั่ง<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="p-seats"
                  type="number"
                  min={0}
                  value={values.seats}
                  onChange={(e) => updateField("seats", e.target.value)}
                  aria-invalid={Boolean(errors.seats)}
                  aria-describedby={errors.seats ? "p-seats-error" : undefined}
                />
                <FieldError id="p-seats-error" message={errors.seats} />
                <p className="text-xs text-[var(--ink-subtle)]">ลงทะเบียนแล้ว {current.enrolledCount ?? 0} คน (ข้อมูลอ่านอย่างเดียว)</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-price">
                  ราคา (บาท)<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="p-price"
                  type="number"
                  min={0}
                  value={values.totalPrice}
                  onChange={(e) => updateField("totalPrice", e.target.value)}
                  aria-invalid={Boolean(errors.totalPrice)}
                  aria-describedby={errors.totalPrice ? "p-price-error" : undefined}
                />
                <FieldError id="p-price-error" message={errors.totalPrice} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-original-price">ราคาก่อนหักส่วนลด (บาท)</Label>
                <Input
                  id="p-original-price"
                  type="number"
                  min={0}
                  value={values.originalPrice}
                  onChange={(e) => updateField("originalPrice", e.target.value)}
                  placeholder="เว้นว่างหากไม่มีส่วนลด"
                  aria-invalid={Boolean(errors.originalPrice)}
                  aria-describedby={errors.originalPrice ? "p-original-price-error" : undefined}
                />
                <FieldError id="p-original-price-error" message={errors.originalPrice} />
              </div>
            </div>
          </Panel>

          <Panel title="อาจารย์">
            <MultiSelectList
              id="p-teachers"
              label="อาจารย์ประจำหลักสูตร"
              options={teachers.map((t) => ({ id: t.id, label: t.name, hint: t.title }))}
              selectedIds={values.teacherIds}
              onChange={(ids) => updateField("teacherIds", ids)}
              emptyOptionsHint="ยังไม่มีข้อมูลอาจารย์ในระบบ"
            />
          </Panel>

          <Panel title="รายวิชาในหลักสูตร">
            <MultiSelectList
              id="p-subjects"
              label="รายวิชาที่อยู่ในหลักสูตรนี้"
              options={subjects.map((s) => ({ id: s.id, label: s.name, hint: s.code }))}
              selectedIds={values.subjectIds}
              onChange={(ids) => updateField("subjectIds", ids)}
              emptyOptionsHint="ยังไม่มีข้อมูลรายวิชาในระบบ"
            />
          </Panel>
        </div>
      </div>

      <Panel title="ผู้เรียนที่ลงทะเบียน" description="รายชื่อผู้เรียนที่ลงทะเบียนหลักสูตรนี้ (อ่านอย่างเดียว)" flush>
        <DataTable
          columns={registrationColumns}
          rows={registrations}
          rowKey={(r) => r.id}
          rowHref={(r) => `/admin/students/${r.studentId}`}
          caption="ผู้เรียนที่ลงทะเบียนหลักสูตรนี้"
          empty={
            <EmptyState
              icon={Users}
              title="ยังไม่มีผู้เรียนลงทะเบียน"
              description="รายชื่อจะปรากฏที่นี่เมื่อมีผู้เรียนลงทะเบียนหลักสูตรนี้"
            />
          }
        />
      </Panel>
    </>
  );
}
