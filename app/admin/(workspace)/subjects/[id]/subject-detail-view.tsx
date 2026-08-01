"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, CalendarDays, FileText, Users } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge, RegistrationStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ScheduleItem, Subject } from "@/lib/discovery/types";
import type { AdminRegistration } from "@/lib/admin/types";
import { teachers } from "@/lib/data/teachers";
import { getStudentById, getStudentName } from "@/lib/admin/mock-data";
import {
  catalogueStatusEffect,
  catalogueStatusLabel,
  catalogueStatusTone,
  facultyOptions,
  getSubjectRegistrations,
  scheduleStatusLabel,
  scheduleStatusTone,
  studyModeLabel,
  subjectCategoryOptions,
  type CatalogueStatus,
  subjectEnrolment,
} from "@/lib/admin/mock-academic";
import { FieldError, FormErrorSummary, MultiSelectList, StringListField } from "@/components/admin/form-fields";
import { formatThaiDate } from "@/lib/admin/format";

type StudyMode = "online" | "onsite" | "hybrid";

type FormState = {
  name: string;
  nameEn: string;
  code: string;
  category: string;
  credits: string;
  faculty: string;
  summary: string;
  description: string;
  price: string;
  studyMode: StudyMode | "";
  startDate: string;
  endDate: string;
  seats: string;
  status: CatalogueStatus;
  qualification: string;
  image: string;
  teacherIds: string[];
  outcomes: string[];
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function toFormState(subject: Subject): FormState {
  return {
    name: subject.name,
    nameEn: subject.nameEn ?? "",
    code: subject.code ?? "",
    category: subject.category ?? "",
    credits: String(subject.credits),
    faculty: subject.faculty,
    summary: subject.summary,
    description: subject.description ?? "",
    price: subject.price !== undefined ? String(subject.price) : "",
    studyMode: subject.studyMode ?? "",
    startDate: subject.startDate ?? "",
    endDate: subject.endDate ?? "",
    seats: subject.seats !== undefined ? String(subject.seats) : "",
    status: subject.status ?? "open",
    qualification: subject.qualification ?? "",
    image: subject.image ?? "",
    teacherIds: subject.teacherIds ?? [],
    outcomes: subject.outcomes ?? [],
  };
}

function validate(v: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!v.name.trim()) errors.name = "กรุณาระบุชื่อรายวิชา";
  if (!v.code.trim()) errors.code = "กรุณาระบุรหัสวิชา";
  if (!v.category.trim()) errors.category = "กรุณาเลือกหมวดวิชา";
  if (!v.faculty.trim()) errors.faculty = "กรุณาเลือกคณะ";
  if (!v.summary.trim()) errors.summary = "กรุณาระบุคำโปรยสั้นของรายวิชา";
  if (!v.studyMode) errors.studyMode = "กรุณาเลือกรูปแบบการเรียน";

  const credits = Number(v.credits);
  if (!v.credits.trim() || Number.isNaN(credits) || credits <= 0) errors.credits = "กรุณาระบุหน่วยกิตเป็นตัวเลขที่มากกว่า 0";

  const seats = Number(v.seats);
  if (!v.seats.trim() || Number.isNaN(seats) || seats <= 0) errors.seats = "กรุณาระบุจำนวนที่นั่งเป็นตัวเลขที่มากกว่า 0";

  const price = Number(v.price);
  if (!v.price.trim() || Number.isNaN(price) || price < 0) errors.price = "กรุณาระบุราคาเป็นตัวเลขที่ไม่ติดลบ";

  return errors;
}

function scheduleItemKey(item: ScheduleItem): string {
  return `${item.date}-${item.topic}`;
}

export function SubjectDetailView({ subject }: { subject: Subject }) {
  const [current, setCurrent] = useState(subject);
  const [values, setValues] = useState<FormState>(() => toFormState(subject));
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);

  const registrations: AdminRegistration[] = getSubjectRegistrations(subject.id);

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
      nameEn: values.nameEn.trim() || undefined,
      code: values.code.trim(),
      category: values.category,
      credits: Number(values.credits),
      faculty: values.faculty,
      summary: values.summary.trim(),
      description: values.description.trim() || undefined,
      price: Number(values.price),
      studyMode: (values.studyMode || undefined) as Subject["studyMode"],
      startDate: values.startDate.trim() || undefined,
      endDate: values.endDate.trim() || undefined,
      seats: Number(values.seats),
      status: values.status,
      qualification: values.qualification.trim() || undefined,
      image: values.image.trim() || undefined,
      teacherIds: values.teacherIds,
      outcomes: values.outcomes.filter((o) => o.trim() !== ""),
    }));
    toast.success(`บันทึกข้อมูลรายวิชา "${values.name.trim()}" แล้ว`);
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

  const allSchedule = current.scheduleItems ?? [];
  const upcomingSchedule = allSchedule.filter((item) => item.status !== "completed");
  const scheduleToShow = (upcomingSchedule.length > 0 ? upcomingSchedule : allSchedule).slice(0, 5);

  const scheduleColumns: Column<ScheduleItem>[] = [
    { key: "date", header: "วันที่", cell: (item) => item.date, width: "w-32" },
    { key: "time", header: "เวลา", cell: (item) => item.time ?? "—", hideOnMobile: true },
    { key: "topic", header: "หัวข้อ", truncate: "max-w-[34ch]", cell: (item) => item.topic },
    { key: "teacher", header: "ผู้สอน", cell: (item) => item.teacher, hideOnMobile: true },
    {
      key: "status",
      header: "สถานะ",
      cell: (item) => <StatusBadge label={scheduleStatusLabel[item.status]} tone={scheduleStatusTone[item.status]} />,
    },
  ];

  const documents = current.documents ?? [];

  return (
    <>
      <PageHeader
        title={current.name}
        crumbs={[{ label: "รายวิชา", href: "/admin/subjects" }, { label: current.name }]}
        backHref="/admin/subjects"
        backLabel="กลับไปรายการรายวิชา"
        description={current.code ? `รหัสวิชา ${current.code}` : undefined}
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
          <Panel title="ข้อมูลพื้นฐาน" description="ชื่อ รหัสวิชา และการจัดหมวดหมู่">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">
                  ชื่อวิชา (ไทย)<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="s-name"
                  value={values.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "s-name-error" : undefined}
                />
                <FieldError id="s-name-error" message={errors.name} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-name-en">ชื่อวิชา (อังกฤษ)</Label>
                <Input id="s-name-en" value={values.nameEn} onChange={(e) => updateField("nameEn", e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-code">
                  รหัสวิชา<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="s-code"
                  value={values.code}
                  onChange={(e) => updateField("code", e.target.value)}
                  aria-invalid={Boolean(errors.code)}
                  aria-describedby={errors.code ? "s-code-error" : undefined}
                />
                <FieldError id="s-code-error" message={errors.code} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-category">
                  หมวดวิชา<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Select value={values.category || undefined} onValueChange={(v) => updateField("category", v)}>
                  <SelectTrigger id="s-category" className="w-full" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "s-category-error" : undefined}>
                    <SelectValue placeholder="เลือกหมวดวิชา" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectCategoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id="s-category-error" message={errors.category} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-faculty">
                  คณะ<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Select value={values.faculty || undefined} onValueChange={(v) => updateField("faculty", v)}>
                  <SelectTrigger id="s-faculty" className="w-full" aria-invalid={Boolean(errors.faculty)} aria-describedby={errors.faculty ? "s-faculty-error" : undefined}>
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
                <FieldError id="s-faculty-error" message={errors.faculty} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-credits">
                  หน่วยกิต<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="s-credits"
                  type="number"
                  min={0}
                  value={values.credits}
                  onChange={(e) => updateField("credits", e.target.value)}
                  aria-invalid={Boolean(errors.credits)}
                  aria-describedby={errors.credits ? "s-credits-error" : undefined}
                />
                <FieldError id="s-credits-error" message={errors.credits} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="s-image">รูปภาพรายวิชา (URL)</Label>
                <Input id="s-image" value={values.image} onChange={(e) => updateField("image", e.target.value)} placeholder="/images/subjects/example.png" />
              </div>
            </div>
          </Panel>

          <Panel title="รายละเอียด" description="ข้อความที่ผู้เรียนเห็นในหน้ารายละเอียดรายวิชา">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-summary">
                  คำโปรยสั้น<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Textarea
                  id="s-summary"
                  rows={2}
                  value={values.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  aria-invalid={Boolean(errors.summary)}
                  aria-describedby={errors.summary ? "s-summary-error" : undefined}
                />
                <FieldError id="s-summary-error" message={errors.summary} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-description">รายละเอียดรายวิชา</Label>
                <Textarea id="s-description" rows={8} value={values.description} onChange={(e) => updateField("description", e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-qualification">คุณสมบัติผู้เรียน</Label>
                <Textarea
                  id="s-qualification"
                  rows={3}
                  value={values.qualification}
                  onChange={(e) => updateField("qualification", e.target.value)}
                  placeholder="เช่น ไม่มีพื้นฐานก็เรียนได้"
                />
              </div>
            </div>
          </Panel>

          <Panel title="ผลลัพธ์การเรียนรู้" description="แสดงในหน้ารายละเอียดรายวิชาของผู้เรียน">
            <StringListField
              id="s-outcomes"
              label="ผลลัพธ์การเรียนรู้"
              items={values.outcomes}
              onChange={(items) => updateField("outcomes", items)}
              addLabel="เพิ่มผลลัพธ์การเรียนรู้"
              placeholder="เช่น วิเคราะห์ข้อมูลด้วย Python ได้"
              emptyHint="ยังไม่มีผลลัพธ์การเรียนรู้ที่ระบุไว้"
            />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="สถานะการเปิดรับสมัคร">
            <div className="space-y-2">
              <Label htmlFor="s-status">สถานะ</Label>
              <Select value={values.status} onValueChange={(v) => updateField("status", v as CatalogueStatus)}>
                <SelectTrigger id="s-status" className="w-full">
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

          <Panel title="รูปแบบการเรียนและกำหนดการ">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-study-mode">
                  รูปแบบการเรียน<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Select value={values.studyMode || undefined} onValueChange={(v) => updateField("studyMode", v as StudyMode)}>
                  <SelectTrigger id="s-study-mode" className="w-full" aria-invalid={Boolean(errors.studyMode)} aria-describedby={errors.studyMode ? "s-study-mode-error" : undefined}>
                    <SelectValue placeholder="เลือกรูปแบบการเรียน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">{studyModeLabel.online}</SelectItem>
                    <SelectItem value="onsite">{studyModeLabel.onsite}</SelectItem>
                    <SelectItem value="hybrid">{studyModeLabel.hybrid}</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError id="s-study-mode-error" message={errors.studyMode} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="s-start-date">วันที่เริ่ม</Label>
                  <Input id="s-start-date" value={values.startDate} onChange={(e) => updateField("startDate", e.target.value)} placeholder="1 ส.ค. 2569" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-end-date">วันที่สิ้นสุด</Label>
                  <Input id="s-end-date" value={values.endDate} onChange={(e) => updateField("endDate", e.target.value)} placeholder="30 ก.ย. 2569" />
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="ที่นั่งและราคา">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-seats">
                  จำนวนที่นั่ง<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="s-seats"
                  type="number"
                  min={0}
                  value={values.seats}
                  onChange={(e) => updateField("seats", e.target.value)}
                  aria-invalid={Boolean(errors.seats)}
                  aria-describedby={errors.seats ? "s-seats-error" : undefined}
                />
                <FieldError id="s-seats-error" message={errors.seats} />
                <p className="text-xs text-[var(--ink-subtle)]">ลงทะเบียนแล้ว {subjectEnrolment(current).enrolled} คน (นับจากรายการลงทะเบียน อ่านอย่างเดียว)</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-price">
                  ราคา (บาท)<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="s-price"
                  type="number"
                  min={0}
                  value={values.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "s-price-error" : undefined}
                />
                <FieldError id="s-price-error" message={errors.price} />
              </div>
            </div>
          </Panel>

          <Panel title="อาจารย์">
            <MultiSelectList
              id="s-teachers"
              label="อาจารย์ประจำวิชา"
              options={teachers.map((t) => ({ id: t.id, label: t.name, hint: t.title }))}
              selectedIds={values.teacherIds}
              onChange={(ids) => updateField("teacherIds", ids)}
              emptyOptionsHint="ยังไม่มีข้อมูลอาจารย์ในระบบ"
            />
          </Panel>
        </div>
      </div>

      <Panel
        title="ตารางเรียน (สรุป)"
        description={`แสดงเฉพาะรอบที่ใกล้ถึงหรือกำลังดำเนินการ จากทั้งหมด ${allSchedule.length} รอบ`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/schedule">
              ตารางเรียนแบบเต็ม
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        }
        flush
      >
        <DataTable
          columns={scheduleColumns}
          rows={scheduleToShow}
          rowKey={scheduleItemKey}
          caption="สรุปตารางเรียนของรายวิชานี้"
          empty={
            <EmptyState
              icon={CalendarDays}
              title="ยังไม่มีตารางเรียน"
              description="ตารางเรียนของรายวิชานี้จะปรากฏที่นี่เมื่อมีการจัดรอบเรียนที่ /admin/schedule"
            />
          }
        />
      </Panel>

      <Panel title="เอกสารประกอบวิชา" description="เอกสารที่แนบไว้กับรายวิชานี้ (อ่านอย่างเดียว)">
        {documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="ยังไม่มีเอกสารแนบ"
            description="เอกสารประกอบการเรียน เช่น สไลด์และแบบฝึกหัด จะปรากฏที่นี่เมื่อมีการอัปโหลด"
          />
        ) : (
          <ul className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
            {documents.map((doc) => (
              <li key={doc.name} className="flex items-center gap-3 px-3 py-2.5">
                <FileText className="size-4 shrink-0 text-[var(--ink-subtle)]" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm">{doc.name}</span>
                <Badge variant="outline" className="uppercase">
                  {doc.fileType}
                </Badge>
                <span className="shrink-0 text-xs text-[var(--ink-subtle)]">{doc.size}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="ผู้เรียนที่ลงทะเบียน" description="รายชื่อผู้เรียนที่ลงทะเบียนรายวิชานี้ (อ่านอย่างเดียว)" flush>
        <DataTable
          columns={registrationColumns}
          rows={registrations}
          rowKey={(r) => r.id}
          rowHref={(r) => `/admin/students/${r.studentId}`}
          caption="ผู้เรียนที่ลงทะเบียนรายวิชานี้"
          empty={
            <EmptyState
              icon={Users}
              title="ยังไม่มีผู้เรียนลงทะเบียน"
              description="รายชื่อจะปรากฏที่นี่เมื่อมีผู้เรียนลงทะเบียนรายวิชานี้"
            />
          }
        />
      </Panel>
    </>
  );
}
