import { Withdrawn } from "@/components/credit-transfer/withdrawn";

export default function ProfileTransferWithdrawnPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">คำขอเทียบโอนถูกถอนแล้ว</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          คำขอเทียบโอนนี้ถูกถอนออกก่อนการพิจารณาเสร็จสิ้น
        </p>
      </div>
      <Withdrawn basePath="/profile/transfer" />
    </div>
  );
}
