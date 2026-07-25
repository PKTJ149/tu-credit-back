import { SubmitProofForm } from "@/components/finance/submit-proof-form";

export default function ProfileSubmitProofPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          ส่งหลักฐานการชำระเงิน
        </h1>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          แนบหลักฐานการชำระเงินและกรอกรายละเอียดที่จำเป็นด้านล่าง
        </p>
      </div>
      <SubmitProofForm />
    </div>
  );
}
