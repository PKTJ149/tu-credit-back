import { MemberPageShell } from "@/components/member-page-shell";
import { FinanceDashboard } from "@/components/finance/finance-dashboard";

export default function FinancePage() {
  return (
    <MemberPageShell
      title="การเงิน"
      description="ตรวจสอบยอดค้างชำระและสถานะการชำระเงินของคุณได้ที่นี่"
      currentNav="finance"
    >
      <FinanceDashboard payableItems={[]} historyPreview={[]} />
    </MemberPageShell>
  );
}
