import { ProofSubmitted } from "@/components/finance/proof-submitted";

export default function ProfileProofSubmittedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          ส่งหลักฐานการชำระเงินแล้ว
        </h1>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          ตรวจสอบสรุปข้อมูลที่ส่งและขั้นตอนถัดไปก่อนการตรวจสอบจะเริ่มขึ้น
        </p>
      </div>
      <ProofSubmitted />
    </div>
  );
}
