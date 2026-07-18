import { Suspense } from "react";
import { MemberPageShell } from "@/components/member-page-shell";
import { TransferRequestForm } from "@/components/credit-transfer/transfer-request-form";

export default function TransferRequestPage() {
  return (
    <MemberPageShell
      title="รายละเอียดคำขอเทียบโอน"
      description="กรอกรายละเอียดการเทียบโอนให้ครบถ้วนก่อนดำเนินการต่อ"
      currentNav="transfer"
    >
      <Suspense>
        <TransferRequestForm />
      </Suspense>
    </MemberPageShell>
  );
}
