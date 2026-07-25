import { DocumentsArchive } from "@/components/finance/documents-archive";

export default function ProfileFinanceDocumentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">ใบเสร็จและใบแจ้งหนี้</h1>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          ดูและดาวน์โหลดเอกสารทางการเงินที่พร้อมใช้งานของคุณ
        </p>
      </div>
      <DocumentsArchive documents={[]} />
    </div>
  );
}
