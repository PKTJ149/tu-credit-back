import { GraduationCap } from "lucide-react";

import { SectionCard } from "@/components/finance/section-card";
import { AcademicRecordRow } from "@/components/learning/academic-record-row";
import type { AcademicRecord } from "@/lib/learning/registration-status";

type AcademicProgressProps = {
  records: AcademicRecord[];
};

const summaryBlocks = [
  { label: "หน่วยกิตสะสม", value: "9 หน่วยกิต" },
  { label: "รายวิชาที่เสร็จสิ้น", value: "3 รายวิชา" },
  { label: "ผลการเรียนล่าสุด", value: "เกรด A" },
];

export function AcademicProgress({ records }: AcademicProgressProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {summaryBlocks.map((block) => (
          <div
            key={block.label}
            className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5"
          >
            <p className="text-sm font-medium text-[var(--ink-muted)]">{block.label}</p>
            <p className="mt-1 font-mono text-xl font-semibold text-[var(--foreground)]">
              {block.value}
            </p>
          </div>
        ))}
      </div>

      <SectionCard title="ประวัติผลการเรียน">
        {records.length > 0 ? (
          <div>
            {records.map((record) => (
              <AcademicRecordRow key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-12 text-center">
            <GraduationCap aria-hidden="true" className="h-8 w-8 text-[var(--ink-subtle)]" />
            <p className="text-sm leading-7 text-[var(--ink-muted)]">
              ประวัติผลการเรียนของคุณจะแสดงที่นี่เมื่อมีผลการเรียนออกมา
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
