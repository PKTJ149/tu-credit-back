import { MemberPageShell } from "@/components/member-page-shell";
import { EvidenceStep } from "@/components/credit-transfer/evidence-step";

export default function TransferEvidencePage() {
  return (
    <MemberPageShell
      title="แนบหลักฐานประกอบ"
      description="แนบเอกสารหลักฐานให้ครบถ้วนก่อนดำเนินการตรวจทานคำขอ"
      currentNav="transfer"
    >
      <EvidenceStep />
    </MemberPageShell>
  );
}
