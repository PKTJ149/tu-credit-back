import { MemberPageShell } from "@/components/member-page-shell";
import { FinanceDashboard } from "@/components/finance/finance-dashboard";
import type { PayableItem } from "@/lib/finance/payment-state";

const payableItems: PayableItem[] = [
  {
    id: "payable-1",
    name: "รายวิชา: การเขียนโปรแกรมเบื้องต้น (ภาคเรียนที่ 1/2569)",
    amount: 3500,
    currency: "THB",
    state: "payment-required",
    dueDate: "31 ก.ค. 2569",
  },
];

export default function FinancePage() {
  return (
    <MemberPageShell
      title="การเงิน"
      description="ตรวจสอบยอดค้างชำระและสถานะการชำระเงินของคุณได้ที่นี่"
      currentNav="finance"
    >
      <FinanceDashboard statusState="payment-required" payableItems={payableItems} />
    </MemberPageShell>
  );
}
