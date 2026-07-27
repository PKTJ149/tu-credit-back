import { UnderReview } from "@/components/credit-transfer/under-review";

export default function ProfileTransferUnderReviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">เทียบโอนหน่วยกิต</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ติดตามสถานะคำขอเทียบโอนของคุณระหว่างการตรวจสอบของเจ้าหน้าที่
        </p>
      </div>
      <UnderReview basePath="/profile/transfer" />
    </div>
  );
}
