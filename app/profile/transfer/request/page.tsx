import { Suspense } from "react";
import { TransferRequestForm } from "@/components/credit-transfer/transfer-request-form";

export default function ProfileTransferRequestPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">รายละเอียดคำขอเทียบโอน</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          กรอกรายละเอียดการเทียบโอนให้ครบถ้วนก่อนดำเนินการต่อ
        </p>
      </div>
      <Suspense>
        <TransferRequestForm basePath="/profile/transfer" />
      </Suspense>
    </div>
  );
}
