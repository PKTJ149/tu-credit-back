import Link from "next/link";
import { CircleAlert, ClipboardList } from "lucide-react";

import { RegistrationRow } from "@/components/learning/registration-row";
import type { Registration } from "@/lib/learning/registration-status";

type MyRegistrationsProps = {
  registrations: Registration[];
};

export function MyRegistrations({ registrations }: MyRegistrationsProps) {
  const hasAwaitingPayment = registrations.some(
    (registration) => registration.status === "awaiting-payment",
  );

  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          รายการลงทะเบียนที่กำลังดำเนินการ
        </h2>
        <p className="text-sm text-[var(--ink-muted)]">
          ทั้งหมด {registrations.length} รายการ
        </p>
      </div>

      {hasAwaitingPayment ? (
        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--primary)_10%,white)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
            />
            <p className="text-sm leading-7 text-[var(--foreground)]">
              ยังมีรายการที่ต้องชำระเงินสำหรับการลงทะเบียนอย่างน้อยหนึ่งรายการ
            </p>
          </div>
          <Link
            href="/finance"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            ไปที่หน้าการเงิน
          </Link>
        </div>
      ) : null}

      {registrations.length > 0 ? (
        <div className="mt-4">
          {registrations.map((registration) => (
            <RegistrationRow
              key={registration.id}
              registration={registration}
              actionLabel="ดูรายละเอียด"
              actionHref="/learning/decision"
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-12 text-center">
          <ClipboardList aria-hidden="true" className="h-8 w-8 text-[var(--ink-subtle)]" />
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            คุณยังไม่มีการลงทะเบียนที่กำลังดำเนินการ
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/member/subjects" className="ui-button-primary">
              สำรวจรายวิชา
            </Link>
            <Link href="/member/programs" className="ui-button-secondary">
              ดูหลักสูตร
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
