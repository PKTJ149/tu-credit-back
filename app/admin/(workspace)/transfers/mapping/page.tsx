"use client";

import { useMemo, useState, useRef } from "react";
import { Pencil, Plus, Scale, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
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
import { useStaffSession } from "@/lib/admin/staff-session";
import { partnerInstitutions } from "@/lib/admin/mock-data";
import { creditMappings as initialMappings, type CreditMapping } from "@/lib/admin/mock-transfers";
import { subjects } from "@/lib/data/subjects";

type FormMode = { kind: "new" } | { kind: "edit"; id: string } | null;

type FormState = {
  institutionId: string;
  externalCode: string;
  externalName: string;
  tuSubjectId: string;
  tuCredits: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  institutionId: "",
  externalCode: "",
  externalName: "",
  tuSubjectId: "",
  tuCredits: "",
  notes: "",
};

function institutionName(institutionId: string): string {
  return partnerInstitutions.find((i) => i.id === institutionId)?.name ?? "—";
}

function subjectLabel(tuSubjectId: string): string {
  const subject = subjects.find((s) => s.id === tuSubjectId);
  if (!subject) return "—";
  return `${subject.code ? `${subject.code} · ` : ""}${subject.name}`;
}

export default function TransferMappingPage() {
  const { role } = useStaffSession();

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader
          title="ตารางเทียบหน่วยกิต"
          description="ตารางเทียบหน่วยกิตกลางระหว่างสถาบันคู่ความร่วมมือกับรายวิชาของ TU"
        />
        <Panel>
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--ink-subtle)]">
              <ShieldAlert className="size-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
              <p className="mx-auto max-w-[46ch] text-sm leading-6 text-[var(--ink-muted)] text-pretty">
                ตารางเทียบหน่วยกิตกลางเปิดให้เฉพาะผู้ดูแลระบบสูงสุดเท่านั้น หากต้องการแก้ไขค่าเทียบโอน
                กรุณาติดต่อผู้ดูแลระบบ
              </p>
            </div>
          </div>
        </Panel>
      </>
    );
  }

  return <MappingTable />;
}

function MappingTable() {
  const [mappings, setMappings] = useState<CreditMapping[]>(initialMappings);
  /** Local id sequence for records added in this session. A prototype has
   *  no server to hand out ids, and `Date.now()` would make the screen render
   *  differently on every machine — so this counts up instead. */
  const nextIdRef = useRef(mappings.length + 1);
  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState(ALL_FILTER_VALUE);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const institutionOptions = useMemo(
    () => partnerInstitutions.map((i) => ({ value: i.id, label: i.name })),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mappings.filter((m) => {
      if (institutionFilter !== ALL_FILTER_VALUE && m.institutionId !== institutionFilter) return false;
      if (!q) return true;
      return (
        institutionName(m.institutionId).toLowerCase().includes(q) ||
        m.externalCode.toLowerCase().includes(q) ||
        m.externalName.toLowerCase().includes(q) ||
        subjectLabel(m.tuSubjectId).toLowerCase().includes(q)
      );
    });
  }, [mappings, search, institutionFilter]);

  function openNewForm() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormMode({ kind: "new" });
  }

  function openEditForm(mapping: CreditMapping) {
    setForm({
      institutionId: mapping.institutionId,
      externalCode: mapping.externalCode,
      externalName: mapping.externalName,
      tuSubjectId: mapping.tuSubjectId,
      tuCredits: String(mapping.tuCredits),
      notes: mapping.notes ?? "",
    });
    setFormError(null);
    setFormMode({ kind: "edit", id: mapping.id });
  }

  function closeForm() {
    setFormMode(null);
    setFormError(null);
  }

  function handleSaveForm() {
    const credits = Number(form.tuCredits);
    if (
      form.institutionId === "" ||
      form.externalCode.trim() === "" ||
      form.externalName.trim() === "" ||
      form.tuSubjectId === "" ||
      !Number.isFinite(credits) ||
      credits <= 0
    ) {
      setFormError("กรุณากรอกสถาบัน รหัส/ชื่อวิชาต้นทาง วิชา TU และจำนวนหน่วยกิตให้ครบและถูกต้อง");
      return;
    }

    if (formMode?.kind === "new") {
      const newMapping: CreditMapping = {
        id: `map-${nextIdRef.current++}`,
        institutionId: form.institutionId,
        externalCode: form.externalCode.trim(),
        externalName: form.externalName.trim(),
        tuSubjectId: form.tuSubjectId,
        tuCredits: credits,
        notes: form.notes.trim() || undefined,
      };
      setMappings((prev) => [...prev, newMapping]);
      toast.success("เพิ่มค่าเทียบหน่วยกิตแล้ว", {
        description: `${form.externalCode.trim()} → ${subjectLabel(form.tuSubjectId)}`,
      });
    } else if (formMode?.kind === "edit") {
      setMappings((prev) =>
        prev.map((m) =>
          m.id === formMode.id
            ? {
                ...m,
                institutionId: form.institutionId,
                externalCode: form.externalCode.trim(),
                externalName: form.externalName.trim(),
                tuSubjectId: form.tuSubjectId,
                tuCredits: credits,
                notes: form.notes.trim() || undefined,
              }
            : m,
        ),
      );
      toast.success("บันทึกค่าเทียบหน่วยกิตแล้ว", {
        description: `${form.externalCode.trim()} → ${subjectLabel(form.tuSubjectId)}`,
      });
    }

    closeForm();
  }

  const columns: Column<CreditMapping>[] = [
    { key: "institution", header: "สถาบัน", truncate: "max-w-[26ch]", cell: (m) => institutionName(m.institutionId) },
    {
      key: "external",
      header: "รายวิชาต้นทาง",
      cell: (m) => (
        <div className="min-w-0">
          <p className="font-mono text-xs text-[var(--ink-subtle)]">{m.externalCode}</p>
          <p className="text-sm font-medium">{m.externalName}</p>
        </div>
      ),
    },
    {
      key: "tuSubject",
      header: "วิชา TU ที่เทียบให้",
      cell: (m) => subjectLabel(m.tuSubjectId),
    },
    { key: "tuCredits", header: "หน่วยกิตที่ให้", cell: (m) => m.tuCredits, align: "end", width: "w-28" },
    {
      key: "notes",
      header: "หมายเหตุ",
      cell: (m) => m.notes ?? "—",
      hideOnMobile: true,
    },
    {
      key: "actions",
      header: "จัดการ",
      cell: (m) => (
        <div className="flex justify-end">
          <Button type="button" size="sm" variant="outline" onClick={() => openEditForm(m)}>
            <Pencil className="size-3.5" aria-hidden />
            แก้ไข
          </Button>
        </div>
      ),
      align: "end",
      width: "w-28",
    },
  ];

  return (
    <>
      <PageHeader
        title="ตารางเทียบหน่วยกิต"
        description="ค่าเทียบหน่วยกิตกลางที่เจ้าหน้าที่ใช้อ้างอิงเวลาตรวจสอบคำขอเทียบโอน — แก้ไขที่นี่มีผลกับการตรวจสอบคำขอครั้งถัดไป ไม่ย้อนแก้คำขอที่ตัดสินไปแล้ว"
        actions={
          <Button type="button" size="sm" onClick={openNewForm}>
            <Plus className="size-4" aria-hidden />
            เพิ่มค่าเทียบหน่วยกิต
          </Button>
        }
      />

      {formMode ? (
        <Panel
          title={formMode.kind === "new" ? "เพิ่มค่าเทียบหน่วยกิต" : "แก้ไขค่าเทียบหน่วยกิต"}
          description="ระบุรายวิชาต้นทางและวิชา TU ที่เทียบเท่ากัน พร้อมจำนวนหน่วยกิตที่จะให้"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="map-institution">สถาบันต้นทาง</Label>
              <Select value={form.institutionId} onValueChange={(value) => setForm((f) => ({ ...f, institutionId: value }))}>
                <SelectTrigger id="map-institution" className="w-full">
                  <SelectValue placeholder="เลือกสถาบัน" />
                </SelectTrigger>
                <SelectContent>
                  {institutionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="map-tu-subject">วิชา TU ที่เทียบให้</Label>
              <Select value={form.tuSubjectId} onValueChange={(value) => setForm((f) => ({ ...f, tuSubjectId: value }))}>
                <SelectTrigger id="map-tu-subject" className="w-full">
                  <SelectValue placeholder="เลือกวิชา TU" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code ? `${subject.code} · ` : ""}
                      {subject.name} ({subject.credits} นก.)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="map-external-code">รหัสวิชาต้นทาง</Label>
              <Input
                id="map-external-code"
                value={form.externalCode}
                onChange={(e) => setForm((f) => ({ ...f, externalCode: e.target.value }))}
                placeholder="เช่น 2110101"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="map-external-name">ชื่อวิชาต้นทาง</Label>
              <Input
                id="map-external-name"
                value={form.externalName}
                onChange={(e) => setForm((f) => ({ ...f, externalName: e.target.value }))}
                placeholder="เช่น Computer Programming"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="map-tu-credits">หน่วยกิตที่ให้</Label>
              <Input
                id="map-tu-credits"
                type="number"
                min={0}
                max={12}
                value={form.tuCredits}
                onChange={(e) => setForm((f) => ({ ...f, tuCredits: e.target.value }))}
                placeholder="เช่น 3"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="map-notes">หมายเหตุ (ถ้ามี)</Label>
              <Textarea
                id="map-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="เช่น เงื่อนไขเกรดขั้นต่ำ หรือข้อสังเกตอื่น ๆ"
              />
            </div>
          </div>

          {formError ? <p className="mt-3 text-sm text-[var(--destructive)]">{formError}</p> : null}

          <div className="mt-4 flex items-center gap-2">
            <Button type="button" size="sm" onClick={handleSaveForm}>
              บันทึก
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={closeForm}>
              ยกเลิก
            </Button>
          </div>
        </Panel>
      ) : null}

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาค่าเทียบหน่วยกิต"
        searchPlaceholder="ค้นหาด้วยสถาบันหรือรายวิชา"
        filters={[
          {
            id: "institution",
            label: "สถาบัน",
            value: institutionFilter,
            onChange: setInstitutionFilter,
            options: [{ value: ALL_FILTER_VALUE, label: "ทุกสถาบัน" }, ...institutionOptions],
          },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${mappings.length} รายการ`}
        onReset={() => {
          setSearch("");
          setInstitutionFilter(ALL_FILTER_VALUE);
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(m) => m.id}
        caption="ตารางเทียบหน่วยกิตกลาง"
        empty={
          <EmptyState
            icon={Scale}
            title="ยังไม่มีค่าเทียบหน่วยกิต"
            description="เพิ่มค่าเทียบแรกด้วยปุ่ม “เพิ่มค่าเทียบหน่วยกิต” ด้านบน เพื่อให้เจ้าหน้าที่ใช้อ้างอิงเวลาตรวจสอบคำขอ"
          />
        }
      />
    </>
  );
}
