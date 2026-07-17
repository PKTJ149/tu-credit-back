import { FileX } from "lucide-react";

import { DocumentRow, type FinanceDocument } from "@/components/finance/document-row";

type DocumentsArchiveProps = {
  documents: FinanceDocument[];
};

export function DocumentsArchive({ documents }: DocumentsArchiveProps) {
  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        เอกสารทั้งหมด
      </h2>

      {documents.length > 0 ? (
        <div className="mt-4">
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-12 text-center">
          <FileX aria-hidden="true" className="h-8 w-8 text-[var(--ink-subtle)]" />
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            ยังไม่มีเอกสารทางการเงินให้ดาวน์โหลดในขณะนี้
          </p>
        </div>
      )}
    </section>
  );
}
