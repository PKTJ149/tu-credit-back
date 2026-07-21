import { DocumentsArchive } from "@/components/finance/documents-archive";

export default function DocumentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">เอกสาร</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ดูและดาวน์โหลดใบเสร็จและเอกสารทางการเงินของคุณ
        </p>
      </div>
      <DocumentsArchive documents={[]} />
    </div>
  );
}
