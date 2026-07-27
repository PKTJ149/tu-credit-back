import { Approved } from "@/components/credit-transfer/approved";

export default function ProfileTransferApprovedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">คำขอเทียบโอนได้รับการอนุมัติแล้ว</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ตรวจสอบผลการอนุมัติและขั้นตอนถัดไปของคุณได้ที่นี่
        </p>
      </div>
      <Approved basePath="/profile/transfer" />
    </div>
  );
}
