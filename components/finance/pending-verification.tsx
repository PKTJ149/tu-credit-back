import Link from "next/link";
import { AlertTriangle, Paperclip } from "lucide-react";
import { StatusPanel } from "@/components/finance/status-panel";
import { SectionCard } from "@/components/finance/section-card";

export function PendingVerification() {
  return (
    <div className="space-y-6">
      <StatusPanel
        state="pending-verification"
        title="กำลังรอการตรวจสอบ"
        body="หลักฐานการชำระเงินของคุณอยู่ระหว่างการตรวจสอบ เราจะแจ้งให้ทราบทันทีเมื่อตรวจสอบเสร็จสิ้น"
      >
        <div className="flex items-start gap-3 rounded-lg border border-[color:color-mix(in_oklch,var(--primary)_28%,white)] bg-[color:color-mix(in_oklch,var(--primary)_6%,white)] px-4 py-3">
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
          />
          <p className="text-sm font-semibold leading-6 text-[var(--foreground)]">
            กรุณารอผลการตรวจสอบก่อนส่งหลักฐานเพิ่มเติมอีกครั้ง
            การส่งซ้ำอาจทำให้การตรวจสอบล่าช้า
          </p>
        </div>
      </StatusPanel>

      <SectionCard
        title="หลักฐานที่ส่งแล้ว"
        description="ข้อมูลนี้เป็นข้อมูลอ่านอย่างเดียวระหว่างรอการตรวจสอบ"
      >
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-[var(--ink-muted)]">จำนวนเงิน</dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              3,500 บาท
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--ink-muted)]">วันที่ส่งหลักฐาน</dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              15 ก.ค. 2569
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--ink-muted)]">ไฟล์แนบ</dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Paperclip aria-hidden="true" className="h-4 w-4 text-[var(--ink-muted)]" />
              สลิปโอนเงิน.jpg
            </dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard>
        <p className="text-sm leading-7 text-[var(--ink-muted)]">
          การตรวจสอบมักใช้เวลา 1-2 วันทำการ หากมีข้อสงสัยเพิ่มเติม
          สามารถติดต่อฝ่ายสนับสนุนได้
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/finance" className="ui-button-primary">
            กลับไปหน้าการเงิน
          </Link>
          <a href="#help" className="ui-button-secondary">
            ติดต่อฝ่ายสนับสนุน
          </a>
        </div>
      </SectionCard>
    </div>
  );
}
