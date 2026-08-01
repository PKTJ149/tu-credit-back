"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarRange, Plus, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { useStaffSession } from "@/lib/admin/staff-session";
import { academicTerms as initialTerms, TODAY } from "@/lib/admin/mock-data";
import type { AcademicTerm } from "@/lib/admin/types";
import {
  NEXT_TERM_STATUS,
  TERM_STATUS_LABEL,
  TERM_STATUS_TONE,
  TERM_TRANSITION_CONSEQUENCE,
  TERM_TRANSITION_LABEL,
  daysBetween,
  registrationWindowState,
  type RegistrationWindowState,
} from "./term-status";
import { TermSheet, type TermFormValues } from "./term-sheet";

function formatThaiFullDate(value: string): string {
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function registrationWindowCopy(term: AcademicTerm, state: RegistrationWindowState): string {
  if (state === "open-now") {
    const days = daysBetween(TODAY, term.registrationClosesAt);
    return days <= 0
      ? "เปิดรับลงทะเบียนอยู่ในขณะนี้ ปิดรับวันนี้"
      : `เปิดรับลงทะเบียนอยู่ในขณะนี้ · ปิดรับในอีก ${days} วัน (${formatThaiFullDate(term.registrationClosesAt)})`;
  }
  if (state === "not-open-yet") {
    const days = daysBetween(TODAY, term.registrationOpensAt);
    return `ยังไม่เปิดรับลงทะเบียน · เปิดรับในอีก ${days} วัน (${formatThaiFullDate(term.registrationOpensAt)})`;
  }
  return `ปิดรับลงทะเบียนแล้วตั้งแต่ ${formatThaiFullDate(term.registrationClosesAt)}`;
}

type SheetState = { mode: "add" | "edit"; term?: AcademicTerm };

export default function TermsPage() {
  const { role } = useStaffSession();
  const [terms, setTerms] = useState<AcademicTerm[]>(initialTerms);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({ mode: "add" });

  const sorted = useMemo(() => [...terms].sort((a, b) => a.startDate.localeCompare(b.startDate)), [terms]);

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="ภาคการศึกษา" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการจัดการภาคการศึกษา กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  function openAdd() {
    setSheetState({ mode: "add" });
    setSheetOpen(true);
  }

  function openEdit(term: AcademicTerm) {
    setSheetState({ mode: "edit", term });
    setSheetOpen(true);
  }

  function handleTransition(term: AcademicTerm) {
    const next = NEXT_TERM_STATUS[term.status];
    if (!next) return;
    setTerms((prev) => prev.map((t) => (t.id === term.id ? { ...t, status: next } : t)));
    toast.success(`เปลี่ยนสถานะ "${term.name}" เป็น "${TERM_STATUS_LABEL[next]}" แล้ว`);
  }

  function handleSubmit(values: TermFormValues) {
    const name = values.name.trim();
    if (sheetState.mode === "edit" && sheetState.term) {
      const target = sheetState.term;
      setTerms((prev) => prev.map((t) => (t.id === target.id ? { ...t, ...values, name } : t)));
      toast.success(`บันทึกการแก้ไข "${name}" แล้ว`);
    } else {
      const newTerm: AcademicTerm = { id: `term-new-${terms.length + 1}`, ...values, name };
      setTerms((prev) => [...prev, newTerm]);
      toast.success(`เพิ่มภาคการศึกษา "${name}" แล้ว`);
    }
    setSheetOpen(false);
  }

  return (
    <>
      <PageHeader
        title="ภาคการศึกษา"
        description="จัดการช่วงการศึกษาและช่วงเปิดรับลงทะเบียนของแต่ละภาค เทียบกับวันที่ปัจจุบันเสมอ"
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="size-4" aria-hidden />
            เพิ่มภาคการศึกษา
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="ยังไม่มีภาคการศึกษาในระบบ"
          description="เพิ่มภาคการศึกษาแรกเพื่อเริ่มกำหนดช่วงเปิดรับลงทะเบียน"
        />
      ) : (
        <div className="space-y-4">
          {sorted.map((term) => {
            const windowState = registrationWindowState(term, TODAY);
            const next = NEXT_TERM_STATUS[term.status];
            return (
              <Panel
                key={term.id}
                title={term.name}
                description={`${formatThaiFullDate(term.startDate)} – ${formatThaiFullDate(term.endDate)}`}
                actions={
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={TERM_STATUS_LABEL[term.status]} tone={TERM_STATUS_TONE[term.status]} />
                    <Button size="sm" variant="outline" onClick={() => openEdit(term)}>
                      แก้ไข
                    </Button>
                    {next ? (
                      <ConfirmDialog
                        trigger={<Button size="sm">{TERM_TRANSITION_LABEL[term.status]}</Button>}
                        title={`${TERM_TRANSITION_LABEL[term.status]}: ${term.name}`}
                        description={TERM_TRANSITION_CONSEQUENCE[next]}
                        confirmLabel="ยืนยัน"
                        onConfirm={() => handleTransition(term)}
                      />
                    ) : null}
                  </div>
                }
              >
                <DetailList
                  rows={[
                    {
                      label: "ช่วงเปิดรับลงทะเบียน",
                      value: `${formatThaiFullDate(term.registrationOpensAt)} – ${formatThaiFullDate(term.registrationClosesAt)}`,
                    },
                    {
                      label: "สถานะการลงทะเบียนขณะนี้",
                      value: registrationWindowCopy(term, windowState),
                      full: true,
                    },
                  ]}
                />
              </Panel>
            );
          })}
        </div>
      )}

      <TermSheet
        open={sheetOpen}
        mode={sheetState.mode}
        term={sheetState.term}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
