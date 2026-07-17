import Link from "next/link";
import { Download } from "lucide-react";
import { StatusPanel } from "@/components/finance/status-panel";
import { formatTHB } from "@/lib/finance/payment-state";

const confirmedDetails = [
  {
    label: "รายการ",
    value: "รายวิชา: การเขียนโปรแกรมเบื้องต้น (ภาคเรียนที่ 1/2569)",
  },
  { label: "จำนวนเงินที่ชำระ", value: formatTHB(3500) },
  { label: "วันที่ยืนยัน", value: "17 ก.ค. 2569" },
];

export function PaymentConfirmed() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <StatusPanel
        state="payment-confirmed"
        title="ยืนยันการชำระเงินแล้ว"
        body="การชำระเงินของคุณได้รับการตรวจสอบและยืนยันเรียบร้อยแล้ว"
      >
        <p className="text-sm leading-7 text-[var(--ink-muted)]">
          เอกสารทางการเงินของคุณพร้อมให้ดาวน์โหลดด้านล่างแล้ว
        </p>
      </StatusPanel>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          สรุปรายการที่ยืนยันแล้ว
        </h2>
        <dl className="mt-4 divide-y divide-[color:var(--border)]">
          {confirmedDetails.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <dt className="text-sm text-[var(--ink-muted)]">{item.label}</dt>
              <dd className="text-sm font-semibold text-[var(--foreground)] sm:text-right">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          เอกสารทางการเงิน
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a href="#" download className="ui-button-primary w-full sm:w-auto">
            <Download aria-hidden="true" className="h-4 w-4" />
            ดาวน์โหลดใบเสร็จรับเงิน
          </a>
          <a href="#" download className="ui-button-secondary w-full sm:w-auto">
            <Download aria-hidden="true" className="h-4 w-4" />
            ดาวน์โหลดใบแจ้งหนี้
          </a>
        </div>
      </section>

      <div>
        <Link
          href="/finance"
          className="inline-flex h-11 items-center text-sm font-medium text-[var(--ink-muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)] rounded-md"
        >
          กลับไปหน้ารายการลงทะเบียน
        </Link>
      </div>
    </div>
  );
}
