import { ReviewRequest } from "@/components/credit-transfer/review-request";

export default function ProfileTransferReviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">ตรวจทานคำขอเทียบโอน</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ตรวจสอบรายละเอียดทั้งหมดก่อนส่งคำขอเทียบโอน
        </p>
      </div>
      <ReviewRequest basePath="/profile/transfer" />
    </div>
  );
}
