"use client";

import { UploadCloud, FileCheck2, X } from "lucide-react";
import { useRef } from "react";

type FileUploadFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  fileName?: string;
  onFileSelected: (file: File | null) => void;
};

export function FileUploadField({
  id,
  label,
  hint,
  error,
  fileName,
  onFileSelected,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>

      {fileName ? (
        <div className="flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileCheck2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--primary)]" />
            <span className="truncate text-sm text-[var(--foreground)]">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onFileSelected(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="ลบไฟล์ที่แนบ"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--ink-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition ${
            error
              ? "border-[color:var(--destructive)]"
              : "border-[color:var(--input)] hover:border-[color:var(--ring)]"
          }`}
        >
          <UploadCloud aria-hidden="true" className="h-6 w-6 text-[var(--ink-muted)]" />
          <span className="text-sm font-medium text-[var(--foreground)]">
            แตะเพื่อแนบไฟล์หลักฐานการชำระเงิน
          </span>
          {hint ? <span className="text-xs text-[var(--ink-subtle)]">{hint}</span> : null}
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*,.pdf"
        className="sr-only"
        aria-invalid={error ? "true" : "false"}
        onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
      />

      {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
    </div>
  );
}
