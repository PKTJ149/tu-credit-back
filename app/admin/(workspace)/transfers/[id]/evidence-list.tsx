"use client";

import { Eye, FileText, FileWarning } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import type { TransferEvidence } from "@/lib/admin/types";
import { formatThaiDate } from "@/lib/admin/mock-transfers";

/**
 * No evidence at all is not a neutral state — it is exactly the kind of
 * thing that changes what an officer decides. Absence gets its own
 * `EmptyState`, not a quietly empty list.
 */
export function EvidenceList({ evidence }: { evidence: TransferEvidence[] }) {
  if (evidence.length === 0) {
    return (
      <EmptyState
        icon={FileWarning}
        title="ไม่มีหลักฐานประกอบแนบมากับคำขอนี้"
        description="ผู้เรียนยังไม่ได้แนบเอกสารใด ๆ เข้ามา — พิจารณาว่าควรขอให้แก้ไขข้อมูลก่อนตัดสินใจอนุมัติหรือไม่"
      />
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {evidence.map((file) => (
        <li key={file.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
          <FileText className="size-4 shrink-0 text-[var(--ink-subtle)]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-[var(--ink-subtle)]">
              {file.fileType.toUpperCase()} · {file.size} · อัปโหลดเมื่อ {formatThaiDate(file.uploadedAt)}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              toast(`เปิดตัวอย่างไฟล์ "${file.name}"`, {
                description: "ต้นแบบนี้ยังไม่เชื่อมต่อคลังไฟล์จริง จึงยังแสดงตัวอย่างเอกสารไม่ได้",
              })
            }
          >
            <Eye className="size-4" aria-hidden />
            ดูไฟล์
          </Button>
        </li>
      ))}
    </ul>
  );
}
