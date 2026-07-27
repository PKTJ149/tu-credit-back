import { EvidenceStep } from "@/components/credit-transfer/evidence-step";

export default function ProfileTransferEvidencePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">แนบหลักฐานประกอบ</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          แนบเอกสารหลักฐานให้ครบถ้วนก่อนดำเนินการตรวจทานคำขอ
        </p>
      </div>
      <EvidenceStep basePath="/profile/transfer" />
    </div>
  );
}
