import Link from "next/link";
import { PaymentInstructionCard } from "@/components/finance/payment-instruction-card";

export function PaymentInstructions() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PaymentInstructionCard
        amount={3500}
        bankName="ธนาคารกรุงไทย"
        accountNumber="123-4-56789-0"
        accountName="มหาวิทยาลัยธรรมศาสตร์ (Credit Bank)"
        reference="TU-CB-2569-000482"
        proofChecklist={[
          "สลิปโอนเงินที่มองเห็นวันที่และเวลาชัดเจน",
          "ยอดเงินตรงกับจำนวนที่ต้องชำระ",
          "หมายเลขอ้างอิงถูกต้องครบถ้วน",
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/finance/submit-proof" className="ui-button-primary w-full sm:w-auto sm:min-w-56">
          ส่งหลักฐานการชำระเงิน
        </Link>
        <Link href="/finance" className="ui-button-secondary w-full sm:w-auto">
          กลับไปหน้าการเงิน
        </Link>
      </div>
    </div>
  );
}
