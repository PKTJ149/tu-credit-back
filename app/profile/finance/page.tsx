import { FinanceDashboard } from "@/components/finance/finance-dashboard";

export default function FinancePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">การเงิน</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ตรวจสอบยอดค้างชำระและสถานะการชำระเงินของคุณ
        </p>
      </div>
      <FinanceDashboard payableItems={[]} historyPreview={[]} />
    </div>
  );
}
