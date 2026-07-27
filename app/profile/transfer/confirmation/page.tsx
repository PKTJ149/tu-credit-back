import { SubmissionConfirmation } from "@/components/credit-transfer/submission-confirmation";

export default function ProfileTransferConfirmationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">ส่งคำขอเทียบโอนเรียบร้อยแล้ว</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ตรวจสอบสรุปข้อมูลคำขอและขั้นตอนถัดไปก่อนการตรวจสอบจะเริ่มขึ้น
        </p>
      </div>
      <SubmissionConfirmation basePath="/profile/transfer" />
    </div>
  );
}
