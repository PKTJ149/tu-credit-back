"use client";

import { Download, FileText } from "lucide-react";

export type FinanceDocument = {
  id: string;
  date: string;
  itemName: string;
  type: "receipt" | "invoice";
  available: boolean;
};

const typeLabel: Record<FinanceDocument["type"], string> = {
  receipt: "ใบเสร็จรับเงิน",
  invoice: "ใบแจ้งหนี้",
};

type DocumentRowProps = {
  document: FinanceDocument;
  onDownload?: (document: FinanceDocument) => void;
};

export function DocumentRow({ document, onDownload }: DocumentRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[color:var(--border)] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
          <FileText aria-hidden="true" className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {document.itemName}
          </p>
          <p className="mt-0.5 text-xs text-[var(--ink-subtle)]">
            {typeLabel[document.type]} · {document.date}
          </p>
        </div>
      </div>

      {document.available ? (
        <button
          type="button"
          onClick={() => onDownload?.(document)}
          className="ui-button-secondary h-9 shrink-0 px-3 text-xs"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          ดาวน์โหลด
        </button>
      ) : (
        <span className="shrink-0 text-xs font-medium text-[var(--ink-subtle)]">
          ยังไม่พร้อมให้ดาวน์โหลด
        </span>
      )}
    </div>
  );
}
