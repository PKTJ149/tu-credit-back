import Link from "next/link";
import { TransferStatusPanel } from "@/components/credit-transfer/transfer-status-panel";

export function Rejected() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <TransferStatusPanel
        state="rejected"
        title="คำขอเทียบโอนไม่ได้รับการอนุมัติ"
        body="เจ้าหน้าที่ตรวจสอบคำขอของคุณแล้วและไม่สามารถอนุมัติคำขอนี้ได้ในขณะนี้"
      />

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">เหตุผล</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
          รายวิชาที่ขอเทียบโอนไม่ตรงกับเนื้อหาหลักสูตรของ Credit Bank ตามเกณฑ์การเทียบโอนที่กำหนด
        </p>
      </section>

      <p className="text-sm leading-7 text-[var(--ink-muted)]">
        หากต้องการสอบถามรายละเอียดเพิ่มเติมหรือขอคำแนะนำ สามารถติดต่อฝ่ายสนับสนุนได้
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href="#help" className="ui-button-primary w-full sm:w-auto">
          ติดต่อฝ่ายสนับสนุน
        </a>
        <Link href="/transfer/history" className="ui-button-secondary w-full sm:w-auto">
          กลับไปหน้าประวัติคำขอ
        </Link>
      </div>
    </div>
  );
}
