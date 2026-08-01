"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { TransferStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { getStaffName, getStudentById, TODAY } from "@/lib/admin/mock-data";
import type { TransferCase, TransferSubjectLine } from "@/lib/admin/types";
import type { TransferState } from "@/lib/credit-transfer/transfer-state";
import { subjects } from "@/lib/data/subjects";
import { useStaffSession } from "@/lib/admin/staff-session";
import { formatThaiDate, getDueSignal } from "@/lib/admin/mock-transfers";
import { TransferDirectionBadge } from "../_components/transfer-direction";
import { SubjectTable } from "./subject-table";
import { EvidenceList } from "./evidence-list";

type TransferCaseReviewProps = {
  initialCase: TransferCase;
};

const OPEN_STATES: TransferState[] = ["submitted", "under-review"];

export function TransferCaseReview({ initialCase }: TransferCaseReviewProps) {
  const { staff } = useStaffSession();
  const [transferCase, setTransferCase] = useState<TransferCase>(initialCase);
  const [lines, setLines] = useState<TransferSubjectLine[]>(initialCase.subjects);

  const student = getStudentById(transferCase.studentId);
  const studentName = student?.name ?? "ไม่พบข้อมูลผู้เรียน";
  const canDecide = OPEN_STATES.includes(transferCase.state);
  const dueSignal = getDueSignal(transferCase.dueAt, TODAY);

  const totals = useMemo(() => {
    const requested = lines.reduce((sum, l) => sum + l.externalCredits, 0);
    const accepted = lines.filter((l) => l.decision === "accepted");
    const rejected = lines.filter((l) => l.decision === "rejected");
    const pending = lines.filter((l) => !l.decision || l.decision === "pending");
    const granted = accepted.reduce((sum, l) => sum + (l.tuCredits ?? 0), 0);
    const unmappedAccepted = accepted.filter((l) => !l.tuSubjectId || !l.tuCredits);
    return { requested, accepted, rejected, pending, granted, unmappedAccepted };
  }, [lines]);

  const canApprove = lines.length > 0 && totals.pending.length === 0 && totals.unmappedAccepted.length === 0;

  function handleMapSubject(lineId: string, tuSubjectId: string) {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        const subject = subjects.find((s) => s.id === tuSubjectId);
        return { ...l, tuSubjectId, tuCredits: subject?.credits ?? l.tuCredits };
      }),
    );
  }

  function handleCreditsChange(lineId: string, tuCredits: number) {
    setLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, tuCredits } : l)));
  }

  function handleDecisionChange(lineId: string, decision: "accepted" | "rejected" | "pending") {
    setLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, decision } : l)));
  }

  function applyDecision(nextState: TransferState, note: string) {
    setTransferCase((prev) => ({
      ...prev,
      state: nextState,
      subjects: lines,
      reviewedByStaffId: staff?.id,
      reviewedAt: TODAY,
      reviewNote: note,
    }));
  }

  function handleApprove() {
    applyDecision("approved", approveSummary);
    toast.success("อนุมัติคำขอเทียบโอนแล้ว", {
      description: `${transferCase.reference} — ${studentName} ได้รับ ${totals.granted} หน่วยกิต`,
    });
  }

  function handleReject(reason?: string) {
    if (!reason) return;
    applyDecision("rejected", reason);
    toast.error("ปฏิเสธคำขอเทียบโอนแล้ว", {
      description: `${transferCase.reference} — ผู้เรียนจะเห็นเหตุผลที่ระบุ`,
    });
  }

  function handleRequestChanges(reason?: string) {
    if (!reason) return;
    applyDecision("changes-requested", reason);
    toast("ส่งคำขอกลับให้ผู้เรียนแก้ไขข้อมูลแล้ว", {
      description: `${transferCase.reference} — ผู้เรียนจะเห็นสิ่งที่ต้องแก้ไข`,
    });
  }

  const approveSummary =
    `จะอนุมัติคำขอ ${transferCase.reference} ของ ${studentName} รวม ${totals.accepted.length} รายวิชา ` +
    `คิดเป็น ${totals.granted} หน่วยกิต` +
    (totals.rejected.length > 0 ? ` และปฏิเสธอีก ${totals.rejected.length} รายวิชาที่ไม่ผ่านเกณฑ์เทียบโอน` : "") +
    `. ผู้เรียนจะเห็นผลการพิจารณานี้ทันทีในหน้าเทียบโอนของตนเอง ตรวจสอบยอดหน่วยกิตให้ถูกต้องก่อนยืนยัน`;

  const hasDecision = Boolean(transferCase.reviewedByStaffId) || transferCase.state === "withdrawn";

  return (
    <>
      <PageHeader
        title={`คำขอเทียบโอน ${transferCase.reference}`}
        description={`${transferCase.institution} · ${transferCase.type === "in" ? "โอนหน่วยกิตเข้า" : "โอนหน่วยกิตออก"}`}
        backHref="/admin/transfers"
        backLabel="กลับไปยังคำขอรอตรวจสอบ"
        actions={
          canDecide ? (
            <>
              <ConfirmDialog
                trigger={<Button size="sm" disabled={!canApprove}>อนุมัติ</Button>}
                title="ยืนยันการอนุมัติคำขอเทียบโอน"
                description={approveSummary}
                confirmLabel="อนุมัติคำขอ"
                onConfirm={handleApprove}
              />
              <ConfirmDialog
                trigger={
                  <Button size="sm" variant="outline">
                    ขอให้แก้ไขข้อมูล
                  </Button>
                }
                title="ขอให้ผู้เรียนแก้ไขข้อมูล"
                description="คำขอจะกลับไปสถานะต้องแก้ไขข้อมูล ผู้เรียนจะเห็นข้อความนี้และต้องแก้ไขก่อนส่งคำขอกลับเข้ามาใหม่"
                confirmLabel="ส่งกลับให้แก้ไข"
                reason={{
                  label: "สิ่งที่ต้องแก้ไข",
                  placeholder: "เช่น เอกสารทรานสคริปต์ไม่ชัดเจน กรุณาส่งฉบับที่ออกโดยสถาบันต้นทาง",
                  required: true,
                  helpText: "ผู้เรียนจะเห็นข้อความนี้ในหน้าสถานะคำขอเทียบโอนของตนเอง",
                }}
                onConfirm={handleRequestChanges}
              />
              <ConfirmDialog
                trigger={
                  <Button size="sm" variant="destructive">
                    ไม่อนุมัติ
                  </Button>
                }
                title="ไม่อนุมัติคำขอเทียบโอน"
                description="คำขอทั้งหมดจะถูกปฏิเสธ ระบุเหตุผลให้ชัดเจน ผู้เรียนจะเห็นข้อความนี้"
                confirmLabel="ไม่อนุมัติคำขอ"
                tone="destructive"
                reason={{
                  label: "เหตุผลที่ไม่อนุมัติ",
                  placeholder: "เช่น ผลการเรียนต่ำกว่าเกณฑ์ขั้นต่ำที่กำหนด",
                  required: true,
                  helpText: "ผู้เรียนจะเห็นข้อความนี้ในหน้าสถานะคำขอเทียบโอนของตนเอง",
                }}
                onConfirm={handleReject}
              />
            </>
          ) : null
        }
      />

      {canDecide && !canApprove ? (
        <p className="-mt-2 text-xs text-[var(--ink-subtle)]">
          ต้องระบุผลการพิจารณาทุกรายวิชา และเลือกวิชา TU พร้อมหน่วยกิตให้ครบสำหรับรายวิชาที่รับเทียบโอน ก่อนจึงจะกดอนุมัติได้
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <Panel title="ข้อมูลคำขอ">
            <DetailList
              rows={[
                {
                  label: "ผู้เรียน",
                  value: student ? (
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="font-medium text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {student.name} · <span className="font-mono">{student.studentCode}</span>
                    </Link>
                  ) : (
                    studentName
                  ),
                },
                { label: "ทิศทาง", value: <TransferDirectionBadge type={transferCase.type} /> },
                { label: "สถาบันคู่เทียบ", value: transferCase.institution },
                { label: "สถานะปัจจุบัน", value: <TransferStatusBadge state={transferCase.state} /> },
                { label: "วันที่ส่งคำขอ", value: formatThaiDate(transferCase.submittedAt) },
                {
                  label: "กำหนดพิจารณา",
                  value: (
                    <span
                      className={
                        dueSignal.overdue
                          ? "font-medium text-[var(--destructive)]"
                          : dueSignal.dueSoon
                            ? "font-medium text-[var(--primary)]"
                            : undefined
                      }
                    >
                      {formatThaiDate(transferCase.dueAt)} ({dueSignal.label})
                    </span>
                  ),
                },
              ]}
            />
          </Panel>

          <Panel
            title="ตารางเทียบรายวิชา"
            description="เทียบแต่ละรายวิชาต้นทางกับวิชา TU ที่ตรงกัน กำหนดหน่วยกิตที่ให้ และผลการพิจารณารายวิชา"
            flush
          >
            <div className="px-5 pt-4 pb-2">
              <SubjectTable
                lines={lines}
                readOnly={!canDecide}
                onMapSubject={handleMapSubject}
                onCreditsChange={handleCreditsChange}
                onDecisionChange={handleDecisionChange}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 border-t border-[var(--border)] px-5 py-3 text-sm">
              <span className="text-[var(--ink-muted)]">
                หน่วยกิตที่ขอเทียบโอนทั้งหมด <span className="font-semibold text-[var(--foreground)]">{totals.requested}</span>
              </span>
              <span className="text-[var(--ink-muted)]">
                หน่วยกิตที่จะได้รับอนุมัติ{" "}
                <span className="font-semibold text-[var(--success-ink)]">{totals.granted}</span>
              </span>
            </div>
          </Panel>

          {hasDecision ? (
            <Panel title="ผลการพิจารณา">
              {transferCase.state === "withdrawn" ? (
                <p className="text-sm leading-6 text-[var(--ink-muted)]">
                  {transferCase.reviewNote ?? "ผู้เรียนแจ้งถอนคำขอนี้เอง ก่อนที่เจ้าหน้าที่จะพิจารณา"}
                </p>
              ) : (
                <DetailList
                  rows={[
                    {
                      label:
                        transferCase.state === "approved"
                          ? "อนุมัติโดย"
                          : transferCase.state === "rejected"
                            ? "ไม่อนุมัติโดย"
                            : "ขอให้แก้ไขข้อมูลโดย",
                      value: getStaffName(transferCase.reviewedByStaffId),
                    },
                    { label: "วันที่พิจารณา", value: formatThaiDate(transferCase.reviewedAt ?? TODAY) },
                    ...(transferCase.reviewNote
                      ? [{ label: "หมายเหตุ", value: transferCase.reviewNote, full: true }]
                      : []),
                  ]}
                />
              )}
            </Panel>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel
            title="หลักฐานประกอบ"
            description="เอกสารที่ผู้เรียนแนบมาพร้อมคำขอนี้"
          >
            <EvidenceList evidence={transferCase.evidence} />
          </Panel>
        </div>
      </div>
    </>
  );
}
