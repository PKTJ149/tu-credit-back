"use client";

import { useMemo, useState, useRef } from "react";
import { Building2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge, type StatusTone } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { partnerInstitutions as initialInstitutions } from "@/lib/admin/mock-data";
import type { PartnerInstitution } from "@/lib/admin/types";
import { agreementTypeLabel } from "@/lib/admin/mock-transfers";

const institutionStatusLabel: Record<PartnerInstitution["status"], string> = {
  active: "เปิดใช้งาน",
  paused: "ระงับชั่วคราว",
};

const institutionStatusTone: Record<PartnerInstitution["status"], StatusTone> = {
  active: "positive",
  paused: "neutral",
};

type FormMode = { kind: "new" } | { kind: "edit"; id: string } | null;

type FormState = {
  name: string;
  nameEn: string;
  country: string;
  agreementType: PartnerInstitution["agreementType"];
};

const EMPTY_FORM: FormState = { name: "", nameEn: "", country: "", agreementType: "mou" };

export default function TransferInstitutionsPage() {
  const [institutions, setInstitutions] = useState<PartnerInstitution[]>(initialInstitutions);
  /** Local id sequence for records added in this session. A prototype has
   *  no server to hand out ids, and `Date.now()` would make the screen render
   *  differently on every machine — so this counts up instead. */
  const nextIdRef = useRef(institutions.length + 1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL_FILTER_VALUE);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return institutions.filter((inst) => {
      if (status !== ALL_FILTER_VALUE && inst.status !== status) return false;
      if (!q) return true;
      return (
        inst.name.toLowerCase().includes(q) ||
        (inst.nameEn ?? "").toLowerCase().includes(q) ||
        inst.country.toLowerCase().includes(q)
      );
    });
  }, [institutions, search, status]);

  function openNewForm() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormMode({ kind: "new" });
  }

  function openEditForm(inst: PartnerInstitution) {
    setForm({
      name: inst.name,
      nameEn: inst.nameEn ?? "",
      country: inst.country,
      agreementType: inst.agreementType,
    });
    setFormError(null);
    setFormMode({ kind: "edit", id: inst.id });
  }

  function closeForm() {
    setFormMode(null);
    setFormError(null);
  }

  function handleSaveForm() {
    if (form.name.trim() === "" || form.country.trim() === "") {
      setFormError("กรุณากรอกชื่อสถาบันและประเทศให้ครบก่อนบันทึก");
      return;
    }

    if (formMode?.kind === "new") {
      const newInstitution: PartnerInstitution = {
        id: `inst-${nextIdRef.current++}`,
        name: form.name.trim(),
        nameEn: form.nameEn.trim() || undefined,
        country: form.country.trim(),
        agreementType: form.agreementType,
        status: "active",
        caseCount: 0,
      };
      setInstitutions((prev) => [...prev, newInstitution]);
      toast.success("เพิ่มสถาบันคู่ความร่วมมือแล้ว", { description: newInstitution.name });
    } else if (formMode?.kind === "edit") {
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.id === formMode.id
            ? {
                ...inst,
                name: form.name.trim(),
                nameEn: form.nameEn.trim() || undefined,
                country: form.country.trim(),
                agreementType: form.agreementType,
              }
            : inst,
        ),
      );
      toast.success("บันทึกข้อมูลสถาบันแล้ว", { description: form.name.trim() });
    }

    closeForm();
  }

  function handleToggleStatus(inst: PartnerInstitution) {
    const nextStatus = inst.status === "active" ? "paused" : "active";
    setInstitutions((prev) => prev.map((i) => (i.id === inst.id ? { ...i, status: nextStatus } : i)));
    toast.success(nextStatus === "paused" ? "ระงับการใช้งานสถาบันแล้ว" : "เปิดใช้งานสถาบันแล้ว", {
      description: inst.name,
    });
  }

  const columns: Column<PartnerInstitution>[] = [
    {
      key: "name",
      truncate: "max-w-[30ch]",
      header: "สถาบัน",
      cell: (inst) => (
        <div className="min-w-0">
          <p className="font-medium">{inst.name}</p>
          {inst.nameEn ? <p className="text-xs text-[var(--ink-subtle)]">{inst.nameEn}</p> : null}
        </div>
      ),
    },
    { key: "country", header: "ประเทศ", cell: (inst) => inst.country, width: "w-28", hideOnMobile: true },
    {
      key: "agreementType",
      header: "รูปแบบความร่วมมือ",
      cell: (inst) => agreementTypeLabel[inst.agreementType],
      hideOnMobile: true,
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (inst) => <StatusBadge label={institutionStatusLabel[inst.status]} tone={institutionStatusTone[inst.status]} />,
      width: "w-32",
    },
    {
      key: "caseCount",
      header: "จำนวนคำขอ",
      cell: (inst) => inst.caseCount,
      align: "end",
      width: "w-24",
    },
    {
      key: "actions",
      header: "จัดการ",
      cell: (inst) => (
        <div className="flex items-center justify-end gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => openEditForm(inst)}>
            <Pencil className="size-3.5" aria-hidden />
            แก้ไข
          </Button>
          <ConfirmDialog
            trigger={
              <Button type="button" size="sm" variant={inst.status === "active" ? "destructive" : "default"}>
                {inst.status === "active" ? "ระงับ" : "เปิดใช้งาน"}
              </Button>
            }
            title={inst.status === "active" ? "ระงับสถาบันคู่ความร่วมมือ" : "เปิดใช้งานสถาบันคู่ความร่วมมือ"}
            description={
              inst.status === "active"
                ? `หลังระงับ ${inst.name} จะไม่ปรากฏเป็นตัวเลือกให้ผู้เรียนยื่นคำขอเทียบโอนใหม่อีก คำขอที่เปิดอยู่ก่อนหน้านี้ (${inst.caseCount} รายการ) ยังดำเนินการตามปกติและไม่ได้รับผลกระทบ`
                : `หลังเปิดใช้งาน ${inst.name} จะกลับมาปรากฏเป็นตัวเลือกให้ผู้เรียนยื่นคำขอเทียบโอนหน่วยกิตได้ตามปกติ`
            }
            confirmLabel={inst.status === "active" ? "ระงับสถาบันนี้" : "เปิดใช้งาน"}
            tone={inst.status === "active" ? "destructive" : "default"}
            onConfirm={() => handleToggleStatus(inst)}
          />
        </div>
      ),
      align: "end",
      width: "w-56",
    },
  ];

  return (
    <>
      <PageHeader
        title="สถาบันคู่ความร่วมมือ"
        description="สถาบันที่มีข้อตกลงเทียบโอนหน่วยกิตกับมหาวิทยาลัยธรรมศาสตร์"
        actions={
          <Button type="button" size="sm" onClick={openNewForm}>
            <Plus className="size-4" aria-hidden />
            เพิ่มสถาบัน
          </Button>
        }
      />

      {formMode ? (
        <Panel
          title={formMode.kind === "new" ? "เพิ่มสถาบันคู่ความร่วมมือ" : "แก้ไขข้อมูลสถาบัน"}
          description="ข้อมูลนี้ใช้ประกอบการตรวจสอบคำขอเทียบโอนของสถาบันนี้ทั้งหมด"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="inst-name">ชื่อสถาบัน (ไทย)</Label>
              <Input
                id="inst-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="เช่น จุฬาลงกรณ์มหาวิทยาลัย"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inst-name-en">ชื่อสถาบัน (อังกฤษ)</Label>
              <Input
                id="inst-name-en"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                placeholder="เช่น Chulalongkorn University"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inst-country">ประเทศ</Label>
              <Input
                id="inst-country"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="เช่น ไทย"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inst-agreement">รูปแบบความร่วมมือ</Label>
              <Select
                value={form.agreementType}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, agreementType: value as PartnerInstitution["agreementType"] }))
                }
              >
                <SelectTrigger id="inst-agreement" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(agreementTypeLabel) as PartnerInstitution["agreementType"][]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {agreementTypeLabel[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        searchLabel="ค้นหาสถาบัน"
        searchPlaceholder="ค้นหาด้วยชื่อสถาบันหรือประเทศ"
        filters={[
          {
            id: "status",
            label: "สถานะ",
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
              { value: "active", label: institutionStatusLabel.active },
              { value: "paused", label: institutionStatusLabel.paused },
            ],
          },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${institutions.length} รายการ`}
        onReset={() => {
          setSearch("");
          setStatus(ALL_FILTER_VALUE);
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(inst) => inst.id}
        caption="รายชื่อสถาบันคู่ความร่วมมือด้านการเทียบโอนหน่วยกิต"
        empty={
          <EmptyState
            icon={Building2}
            title="ยังไม่มีสถาบันคู่ความร่วมมือ"
            description="เพิ่มสถาบันแรกด้วยปุ่ม “เพิ่มสถาบัน” ด้านบน เพื่อให้ผู้เรียนเลือกยื่นคำขอเทียบโอนกับสถาบันนี้ได้"
          />
        }
      />
    </>
  );
}
