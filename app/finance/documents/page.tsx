import { MemberPageShell } from "@/components/member-page-shell";
import { DocumentsArchive } from "@/components/finance/documents-archive";
import type { FinanceDocument } from "@/components/finance/document-row";

const documents: FinanceDocument[] = [
  {
    id: "1",
    date: "17 ก.ค. 2569",
    itemName: "รายวิชา: การเขียนโปรแกรมเบื้องต้น (ภาคเรียนที่ 1/2569)",
    type: "receipt",
    available: true,
  },
  {
    id: "2",
    date: "17 ก.ค. 2569",
    itemName: "รายวิชา: การเขียนโปรแกรมเบื้องต้น (ภาคเรียนที่ 1/2569)",
    type: "invoice",
    available: true,
  },
  {
    id: "3",
    date: "10 มี.ค. 2569",
    itemName: "รายวิชา: สถิติเบื้องต้นสำหรับนักวิจัย (ภาคเรียนที่ 2/2568)",
    type: "receipt",
    available: false,
  },
];

export default function DocumentsPage() {
  return (
    <MemberPageShell
      title="ใบเสร็จและใบแจ้งหนี้"
      description="ดูและดาวน์โหลดเอกสารทางการเงินที่พร้อมใช้งานของคุณ"
      currentNav="documents"
    >
      <DocumentsArchive documents={documents} />
    </MemberPageShell>
  );
}
