import { Rejected } from "@/components/credit-transfer/rejected";

export default function ProfileTransferRejectedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">คำขอเทียบโอนไม่ได้รับการอนุมัติ</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ผลการตรวจสอบคำขอเทียบโอนหน่วยกิตของคุณ
        </p>
      </div>
      <Rejected basePath="/profile/transfer" />
    </div>
  );
}
