import { TransferHub } from "@/components/credit-transfer/transfer-hub";

export default function TransferPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">เทียบโอนหน่วยกิต</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          เลือกประเภทคำขอเทียบโอนและตรวจสอบสถานะคำขอที่ผ่านมา
        </p>
      </div>
      <TransferHub />
    </div>
  );
}
