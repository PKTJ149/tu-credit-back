import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import type { LearningItem } from "@/lib/learning/registration-status";

type LearningItemCardProps = {
  item: LearningItem;
  href: string;
};

export function LearningItemCard({ item, href }: LearningItemCardProps) {
  const Icon = item.type === "program" ? GraduationCap : BookOpen;
  const typeLabel = item.type === "program" ? "หลักสูตร" : "รายวิชา";

  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 transition hover:border-[color:var(--ring)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium text-[var(--ink-subtle)]">{typeLabel}</span>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">{item.name}</h3>
        <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{item.description}</p>
      </div>

      <p className="font-mono text-xs font-medium text-[var(--ink-subtle)]">
        {item.credits} หน่วยกิต
      </p>
    </Link>
  );
}
