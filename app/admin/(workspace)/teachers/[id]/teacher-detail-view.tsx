"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, GraduationCap } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Program, Subject, Teacher } from "@/lib/discovery/types";
import { getProgramsForTeacher, getSubjectsForTeacher, getTeacherWorkload } from "@/lib/admin/mock-academic";
import { FieldError, FormErrorSummary, StringListField } from "@/components/admin/form-fields";

type FormState = {
  name: string;
  title: string;
  educationHistory: string[];
  workingHistory: string[];
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function toFormState(teacher: Teacher): FormState {
  return {
    name: teacher.name,
    title: teacher.title ?? "",
    educationHistory: teacher.educationHistory ?? [],
    workingHistory: teacher.workingHistory ?? [],
  };
}

function validate(v: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!v.name.trim()) errors.name = "กรุณาระบุชื่ออาจารย์";
  return errors;
}

export function TeacherDetailView({ teacher }: { teacher: Teacher }) {
  const [current, setCurrent] = useState(teacher);
  const [values, setValues] = useState<FormState>(() => toFormState(teacher));
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);

  const workload = getTeacherWorkload(teacher.id);
  const assignedPrograms = getProgramsForTeacher(teacher.id);
  const assignedSubjects = getSubjectsForTeacher(teacher.id);

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
      title: values.title.trim() || undefined,
      educationHistory: values.educationHistory.filter((e) => e.trim() !== ""),
      workingHistory: values.workingHistory.filter((w) => w.trim() !== ""),
    }));
    toast.success(`บันทึกข้อมูลอาจารย์ "${values.name.trim()}" แล้ว`);
  }

  const programColumns: Column<Program>[] = [
    { key: "name", header: "หลักสูตร", truncate: "max-w-[34ch]", cell: (p) => <span className="font-medium">{p.name}</span> },
    { key: "level", header: "ระดับ", cell: (p) => p.level, hideOnMobile: true },
    { key: "faculty", header: "คณะ", cell: (p) => p.faculty, hideOnMobile: true, truncate: "max-w-[20ch]" },
  ];

  const subjectColumns: Column<Subject>[] = [
    { key: "code", header: "รหัสวิชา", cell: (s) => <span className="font-mono">{s.code ?? "—"}</span>, width: "w-24" },
    { key: "name", header: "รายวิชา", truncate: "max-w-[30ch]", cell: (s) => <span className="font-medium">{s.name}</span> },
    { key: "faculty", header: "คณะ", cell: (s) => s.faculty, hideOnMobile: true, truncate: "max-w-[20ch]" },
  ];

  return (
    <>
      <PageHeader
        title={current.name}
        crumbs={[{ label: "อาจารย์", href: "/admin/teachers" }, { label: current.name }]}
        backHref="/admin/teachers"
        backLabel="กลับไปรายการอาจารย์"
        description={current.title}
        actions={
          <Button type="button" className="h-11" onClick={handleSave}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        }
      />

      <FormErrorSummary count={Object.keys(errors).length} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Panel title="ข้อมูลพื้นฐาน">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="t-name">
                  ชื่ออาจารย์<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="t-name"
                  value={values.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "t-name-error" : undefined}
                />
                <FieldError id="t-name-error" message={errors.name} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="t-title">ตำแหน่ง/ความเชี่ยวชาญ</Label>
                <Input id="t-title" value={values.title} onChange={(e) => updateField("title", e.target.value)} placeholder="เช่น ผู้เชี่ยวชาญด้านวิศวกรรมซอฟต์แวร์" />
              </div>
            </div>
          </Panel>

          <Panel title="ประวัติการศึกษา">
            <StringListField
              id="t-education"
              label="ประวัติการศึกษา"
              items={values.educationHistory}
              onChange={(items) => updateField("educationHistory", items)}
              addLabel="เพิ่มประวัติการศึกษา"
              placeholder="เช่น ปริญญาเอก วิศวกรรมซอฟต์แวร์ จุฬาลงกรณ์มหาวิทยาลัย"
              emptyHint="ยังไม่มีประวัติการศึกษาที่ระบุไว้"
            />
          </Panel>

          <Panel title="ประวัติการทำงาน">
            <StringListField
              id="t-working"
              label="ประวัติการทำงาน"
              items={values.workingHistory}
              onChange={(items) => updateField("workingHistory", items)}
              addLabel="เพิ่มประวัติการทำงาน"
              placeholder="เช่น อาจารย์ประจำคณะวิทยาการเรียนรู้และศึกษาศาสตร์ (2561-ปัจจุบัน)"
              emptyHint="ยังไม่มีประวัติการทำงานที่ระบุไว้"
            />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="ภาระงาน" description="คำนวณจากจำนวนหลักสูตรและรายวิชาที่มอบหมายให้อาจารย์ท่านนี้">
            <DetailList
              rows={[
                { label: "จำนวนหลักสูตร", value: workload.programCount },
                { label: "จำนวนรายวิชา", value: workload.subjectCount },
                {
                  label: "รวมภาระงาน",
                  value: (
                    <span className="inline-flex items-center gap-2">
                      {workload.total}
                      {workload.isHighLoad ? <StatusBadge label="ภาระงานสูงกว่าค่าเฉลี่ย" tone="action" /> : null}
                    </span>
                  ),
                },
              ]}
            />
          </Panel>
        </div>
      </div>

      <Panel title="หลักสูตรที่รับผิดชอบ" description="หลักสูตรที่มอบหมายให้อาจารย์ท่านนี้ (อ่านอย่างเดียว)" flush>
        <DataTable
          columns={programColumns}
          rows={assignedPrograms}
          rowKey={(p) => p.id}
          rowHref={(p) => `/admin/programs/${p.id}`}
          caption="หลักสูตรที่อาจารย์ท่านนี้รับผิดชอบ"
          empty={
            <EmptyState
              icon={GraduationCap}
              title="ยังไม่ได้รับมอบหมายหลักสูตร"
              description="หลักสูตรจะปรากฏที่นี่เมื่อมีการเพิ่มอาจารย์ท่านนี้ในหลักสูตร"
            />
          }
        />
      </Panel>

      <Panel title="รายวิชาที่รับผิดชอบ" description="รายวิชาที่มอบหมายให้อาจารย์ท่านนี้ (อ่านอย่างเดียว)" flush>
        <DataTable
          columns={subjectColumns}
          rows={assignedSubjects}
          rowKey={(s) => s.id}
          rowHref={(s) => `/admin/subjects/${s.id}`}
          caption="รายวิชาที่อาจารย์ท่านนี้รับผิดชอบ"
          empty={
            <EmptyState
              icon={BookOpen}
              title="ยังไม่ได้รับมอบหมายรายวิชา"
              description="รายวิชาจะปรากฏที่นี่เมื่อมีการเพิ่มอาจารย์ท่านนี้ในรายวิชา"
            />
          }
        />
      </Panel>
    </>
  );
}
