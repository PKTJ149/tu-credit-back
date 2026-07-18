import type { AcademicRecord } from "@/lib/learning/registration-status";

type AcademicRecordRowProps = {
  record: AcademicRecord;
};

export function AcademicRecordRow({ record }: AcademicRecordRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 border-b border-[color:var(--border)] py-4 last:border-b-0 sm:grid-cols-4 sm:items-center">
      <div className="col-span-2 sm:col-span-1">
        <p className="text-xs font-medium text-[var(--ink-subtle)]">ภาคเรียน</p>
        <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">{record.term}</p>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <p className="text-xs font-medium text-[var(--ink-subtle)]">รายการ</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-[var(--foreground)]">
          {record.itemName}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--ink-subtle)]">หน่วยกิต</p>
        <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--foreground)]">
          {record.credits}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--ink-subtle)]">เกรด</p>
        <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--foreground)]">
          {record.grade}
        </p>
      </div>
    </div>
  );
}
