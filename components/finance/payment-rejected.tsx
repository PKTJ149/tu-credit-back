import Link from "next/link";
import { Paperclip } from "lucide-react";
import { StatusPanel } from "@/components/finance/status-panel";
import { SectionCard } from "@/components/finance/section-card";

const previousSubmission = [
  { label: "จำนวนเงิน", value: "3,000 บาท" },
  { label: "วันที่ส่ง", value: "15 ก.ค. 2569" },
  { label: "ไฟล์แนบ", value: "สลิปโอนเงิน.jpg" },
];

export function PaymentRejected() {
  return (
    <div className="space-y-6">
      <StatusPanel
        state="payment-rejected"
        title="ต้องดำเนินการแก้ไข"
        body="เรายังไม่สามารถตรวจสอบหลักฐานการชำระเงินนี้ได้ ตรวจสอบรายละเอียดด้านล่างแล้วส่งหลักฐานฉบับแก้ไข"
      />

      <SectionCard title="เหตุผลที่ไม่ผ่านการตรวจสอบ">
        <p className="text-sm leading-7 text-[var(--foreground)]">
          ยอดเงินในสลิปไม่ตรงกับจำนวนที่ต้องชำระ (พบยอด 3,000 บาท แต่ยอดที่ต้องชำระคือ 3,500 บาท)
        </p>
      </SectionCard>

      <SectionCard title="สิ่งที่ต้องแก้ไข">
        <p className="text-sm leading-7 text-[var(--ink-muted)]">
          ตรวจสอบยอดเงินที่โอนให้ตรงกับจำนวนที่ต้องชำระ แล้วแนบสลิปฉบับใหม่พร้อมส่งหลักฐานอีกครั้ง
        </p>
      </SectionCard>

      <SectionCard title="หลักฐานที่ส่งก่อนหน้านี้">
        <dl className="grid gap-4 sm:grid-cols-3">
          {previousSubmission.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-[var(--ink-muted)]">{item.label}</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                {item.label === "ไฟล์แนบ" ? (
                  <Paperclip aria-hidden="true" className="h-4 w-4 text-[var(--ink-muted)]" />
                ) : null}
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/finance/submit-proof" className="ui-button-primary w-full sm:w-auto">
          ส่งหลักฐานที่แก้ไขแล้ว
        </Link>
        <a href="#help" className="ui-button-secondary w-full sm:w-auto">
          ติดต่อฝ่ายสนับสนุน
        </a>
      </div>
    </div>
  );
}
