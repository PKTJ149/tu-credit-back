"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  Paperclip,
  ReceiptText,
} from "lucide-react";
import { SectionCard } from "@/components/finance/section-card";
import { StatusBadge } from "@/components/finance/status-badge";
import { formatTHB } from "@/lib/finance/payment-state";
import type { PaymentState } from "@/lib/finance/payment-state";
import {
  CURRENT_TERM,
  type LearnerPayable,
  type LearnerRegistration,
  useSessionData,
} from "@/lib/session/session-data";
import { programs } from "@/lib/data/programs";
import { getSubjectsByIds, subjects } from "@/lib/data/subjects";

const reviewStates = new Set<PaymentState>([
  "notice-submitted",
  "pending-verification",
]);

type VerificationItem = {
  payable: LearnerPayable;
  registration?: LearnerRegistration;
  subjectCount: number;
  credits: number;
  attachmentName: string;
};

function getRegistrationSubjects(registration?: LearnerRegistration) {
  if (!registration) return [];

  if (registration.itemType === "program") {
    const program = programs.find((item) => item.slug === registration.slug);
    return getSubjectsByIds(registration.selectedSubjectIds ?? program?.subjectIds);
  }

  return subjects.filter((subject) => subject.slug === registration.slug);
}

function makeVerificationItems(
  payables: LearnerPayable[],
  registrations: LearnerRegistration[],
) {
  return payables
    .filter((payable) => reviewStates.has(payable.state) || payable.state === "payment-confirmed")
    .map((payable, index) => {
      const registration = registrations.find((item) => item.id === payable.registrationId);
      const registrationSubjects = getRegistrationSubjects(registration);

      return {
        payable,
        registration,
        subjectCount:
          registration?.itemType === "program" ? registrationSubjects.length : 1,
        credits: registrationSubjects.reduce((sum, subject) => sum + subject.credits, 0),
        attachmentName: `payment-proof-${String(index + 1).padStart(2, "0")}.jpg`,
      };
    });
}

function SummaryMetric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "amber" | "green" | "red";
}) {
  const toneClass = {
    amber:
      "border-amber-200 bg-amber-50 text-amber-900 [&_svg]:text-amber-700",
    green:
      "border-emerald-200 bg-emerald-50 text-emerald-900 [&_svg]:text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-900 [&_svg]:text-red-700",
  }[tone];

  const Icon = tone === "green" ? CheckCircle2 : tone === "red" ? ReceiptText : Clock3;

  return (
    <div className={`rounded-xl border p-5 ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      </div>
      <p className="mt-3 text-sm leading-6 opacity-80">{detail}</p>
    </div>
  );
}

function ItemTypeLabel({ registration }: { registration?: LearnerRegistration }) {
  if (!registration) return <span>รายการชำระเงิน</span>;

  return <span>{registration.itemType === "program" ? "หลักสูตร" : "รายวิชา"}</span>;
}

function VerificationList({
  title,
  description,
  items,
  emptyText,
  onApprove,
}: {
  title: string;
  description: string;
  items: VerificationItem[];
  emptyText: string;
  onApprove?: (payableId: string) => void;
}) {
  return (
    <SectionCard title={title} description={description}>
      {items.length > 0 ? (
        <div className="space-y-3">
          <div className="hidden grid-cols-[minmax(0,1fr)_7rem_7.5rem_9rem_6rem] gap-4 px-1 text-xs font-semibold text-[var(--ink-subtle)] lg:grid">
            <span>รายการ</span>
            <span>หน่วยกิต</span>
            <span className="text-right">ยอดเงิน</span>
            <span>สถานะ</span>
            <span className="text-right">หลักฐาน</span>
          </div>

          {items.map(({ payable, registration, subjectCount, credits, attachmentName }) => (
            <article
              key={payable.id}
              className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-4 py-4"
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_7rem_7.5rem_9rem_6rem] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-muted)]">
                      <ItemTypeLabel registration={registration} />
                    </span>
                    <span className="text-xs font-medium text-[var(--ink-subtle)]">
                      {registration?.term ?? CURRENT_TERM}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold leading-6 text-[var(--foreground)]">
                    {payable.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
                    ส่งหลักฐานแล้ว: {CURRENT_TERM}
                  </p>
                </div>

                <div className="text-sm text-[var(--foreground)]">
                  <span className="lg:hidden text-[var(--ink-muted)]">หน่วยกิต: </span>
                  <span className="font-semibold">{credits || "-"}</span>
                  {subjectCount > 1 ? (
                    <span className="ml-1 text-[var(--ink-muted)]">
                      ({subjectCount} รายวิชา)
                    </span>
                  ) : null}
                </div>

                <div className="font-mono text-sm font-semibold text-[var(--foreground)] lg:text-right">
                  {formatTHB(payable.amount)}
                </div>

                <StatusBadge state={payable.state} />

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-[var(--ink-muted)] lg:hidden">
                    <Paperclip aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span className="truncate">{attachmentName}</span>
                  </span>
                  <span
                    className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                    aria-label={attachmentName}
                    title={attachmentName}
                  >
                    <Paperclip aria-hidden="true" className="h-4 w-4" />
                    <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-max max-w-56 rounded-md bg-[var(--foreground)] px-2 py-1 text-xs font-medium text-[var(--background)] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
                      {attachmentName}
                    </span>
                  </span>
                </div>
              </div>

              {onApprove ? (
                <div className="mt-4 flex justify-end border-t border-dashed border-[color:var(--border)] pt-4">
                  <button
                    type="button"
                    onClick={() => onApprove(payable.id)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-3 text-xs font-semibold text-[var(--foreground)] transition hover:border-[color:var(--ring)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                  >
                    จำลองอนุมัติ
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[color:var(--border)] bg-[var(--surface)] px-5 py-8 text-center text-sm text-[var(--ink-muted)]">
          {emptyText}
        </div>
      )}
    </SectionCard>
  );
}

export function PendingVerification() {
  const { data, confirmPayment } = useSessionData();
  const verificationItems = makeVerificationItems(data.payables, data.registrations);
  const pendingItems = verificationItems.filter((item) =>
    reviewStates.has(item.payable.state),
  );
  const approvedItems = verificationItems.filter(
    (item) => item.payable.state === "payment-confirmed",
  );
  const totalAmount = verificationItems.reduce(
    (sum, item) => sum + item.payable.amount,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryMetric
          label="รอตรวจสอบ"
          value={`${pendingItems.length} รายการ`}
          detail="หลักฐานที่ส่งแล้วและยังรอเจ้าหน้าที่อนุมัติ"
          tone="amber"
        />
        <SummaryMetric
          label="อนุมัติแล้ว"
          value={`${approvedItems.length} รายการ`}
          detail="เก็บไว้ในหน้านี้เป็นประวัติการส่งหลักฐาน"
          tone="green"
        />
        <SummaryMetric
          label="ยอดรวมหลักฐาน"
          value={formatTHB(totalAmount)}
          detail="รวมทุกรายการที่เคยส่งหลักฐานการชำระเงิน"
          tone="red"
        />
      </div>

      <section className="rounded-xl border border-[color:color-mix(in_oklch,var(--primary)_24%,white)] bg-[color:color-mix(in_oklch,var(--primary)_5%,white)] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] text-[var(--primary)]">
            <FileCheck2 aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              สถานะหลักฐานการชำระเงิน
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-muted)]">
              หน้านี้รวมรายการที่ส่งหลักฐานการชำระเงินแล้วทั้งหมด
              ทั้งรายการที่ยังรอตรวจสอบและรายการที่อนุมัติแล้ว เพื่อให้ผู้เรียนใช้ติดตามย้อนหลังได้ในที่เดียว
            </p>
          </div>
        </div>
      </section>

      <VerificationList
        title="รายการรอตรวจสอบ"
        description="รายการที่ส่งหลักฐานเข้ามาแล้ว แต่ยังรอเจ้าหน้าที่ตรวจสอบ"
        items={pendingItems}
        emptyText="ยังไม่มีรายการที่รอตรวจสอบในขณะนี้"
        onApprove={confirmPayment}
      />

      <VerificationList
        title="ประวัติหลักฐานที่อนุมัติแล้ว"
        description="รายการที่ตรวจสอบผ่านแล้วจะยังแสดงอยู่ เพื่อใช้เป็นประวัติการชำระเงิน"
        items={approvedItems}
        emptyText="ยังไม่มีประวัติหลักฐานที่อนุมัติแล้ว"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/profile/finance" className="ui-button-primary">
          กลับไปหน้าการเงิน
        </Link>
        <a href="#help" className="ui-button-secondary">
          ติดต่อฝ่ายสนับสนุน
        </a>
      </div>
    </div>
  );
}
