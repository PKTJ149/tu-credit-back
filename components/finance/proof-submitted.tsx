import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { StatusPanel } from "@/components/finance/status-panel";
import { formatTHB } from "@/lib/finance/payment-state";

const submittedDetails = [
  { label: "จำนวนเงิน", value: formatTHB(3500) },
  { label: "วันที่ส่ง", value: "15 ก.ค. 2569" },
  { label: "ไฟล์แนบ", value: "สลิปโอนเงิน.jpg" },
];

const nextSteps = [
  "ทีมงานจะตรวจสอบหลักฐานการชำระเงินของคุณ",
  "คุณจะเห็นสถานะอัปเดตในหน้าสถานะการชำระเงิน",
  "หากต้องแก้ไขเพิ่มเติม ระบบจะแจ้งขั้นตอนถัดไปให้ชัดเจน",
];

export function ProofSubmitted() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <StatusPanel
        state="notice-submitted"
        title="ส่งหลักฐานการชำระเงินแล้ว"
        body="เราได้รับหลักฐานการชำระเงินของคุณแล้ว ทีมงานจะตรวจสอบและอัปเดตสถานะการชำระเงินให้เร็วที่สุด"
      >
        <p className="text-sm leading-7 text-[var(--ink-muted)]">
          คุณไม่จำเป็นต้องส่งซ้ำ เว้นแต่จะมีการแจ้งให้แก้ไข
        </p>
      </StatusPanel>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          สรุปข้อมูลที่ส่ง
        </h2>
        <dl className="mt-4 divide-y divide-[color:var(--border)]">
          {submittedDetails.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <dt className="text-sm text-[var(--ink-muted)]">{item.label}</dt>
              <dd className="text-sm font-semibold text-[var(--foreground)]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          ขั้นตอนถัดไป
        </h2>
        <ul className="mt-4 space-y-3">
          {nextSteps.map((step) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-[var(--ink-muted)]">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
              />
              {step}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/finance/pending" className="ui-button-primary w-full sm:w-auto">
          ดูสถานะการชำระเงิน
        </Link>
        <Link href="/finance" className="ui-button-secondary w-full sm:w-auto">
          กลับไปหน้าการเงิน
        </Link>
      </div>
    </div>
  );
}
