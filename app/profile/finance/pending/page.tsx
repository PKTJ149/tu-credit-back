import { PendingVerification } from "@/components/finance/pending-verification";

export default function ProfilePendingVerificationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">รอการตรวจสอบ</h1>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          ตรวจสอบสถานะหลักฐานการชำระเงินที่ส่งไปแล้ว พร้อมประวัติรายการที่อนุมัติแล้ว
        </p>
      </div>
      <PendingVerification />
    </div>
  );
}
