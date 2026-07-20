import { MemberPageShell } from "@/components/member-page-shell";
import { DocumentsArchive } from "@/components/finance/documents-archive";

export default function DocumentsPage() {
  return (
    <MemberPageShell
      title="ใบเสร็จและใบแจ้งหนี้"
      description="ดูและดาวน์โหลดเอกสารทางการเงินที่พร้อมใช้งานของคุณ"
      currentNav="documents"
    >
      <DocumentsArchive documents={[]} />
    </MemberPageShell>
  );
}
