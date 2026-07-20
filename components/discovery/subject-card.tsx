import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Subject } from "@/lib/discovery/types";

type SubjectCardProps = {
  subject: Subject;
  detailBasePath?: string;
};

export function SubjectCard({ subject, detailBasePath = "/subjects" }: SubjectCardProps) {
  return (
    <Link
      href={`${detailBasePath}/${subject.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--background)] transition hover:border-[color:var(--ring)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
    >
      <div className="relative aspect-[16/9] bg-[color:color-mix(in_oklch,var(--primary)_10%,white)] flex items-center justify-center">
        <BookOpen aria-hidden="true" className="h-12 w-12 text-[var(--primary)] opacity-15" />
        <span className="absolute bottom-2 right-3 text-[10px] font-medium text-[var(--ink-subtle)] opacity-60">
          ภาพปก
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
            <BookOpen aria-hidden="true" className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-[var(--ink-subtle)]">{subject.faculty}</span>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">{subject.name}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{subject.summary}</p>
        </div>

        <p className="font-mono text-xs font-medium text-[var(--ink-subtle)]">
          {subject.credits} หน่วยกิต
        </p>
      </div>
    </Link>
  );
}
