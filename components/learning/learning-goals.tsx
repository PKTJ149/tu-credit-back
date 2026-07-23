"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import {
  GOAL_CATEGORIES,
  useSessionData,
  type GoalCategory,
  type LearnerGoal,
} from "@/lib/session/session-data";

export function LearningGoals() {
  const { data, removeGoal } = useSessionData();
  const goals = data.goals;

  // ── Empty state (brand-new learner) ──────────────────────────────────
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-dashed border-[color:var(--border)] bg-[var(--background)] px-6 py-16 text-center sm:py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:color-mix(in_oklch,var(--primary)_10%,white)] text-[var(--primary)]">
          <Target aria-hidden="true" className="h-8 w-8" />
        </div>
        <div className="max-w-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            ยังไม่มีเป้าหมายการเรียนรู้
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
            เลือกหลักสูตรหรือรายวิชาที่คุณสนใจ แล้วกด “เลือกเป็นเป้าหมายการเรียนรู้”
            ระบบจะรวบรวมไว้ที่นี่เพื่อช่วยวางแผนการเรียนของคุณ
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/member/programs" className="ui-button-primary">
            เลือกหลักสูตร
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="/member/subjects" className="ui-button-secondary">
            สำรวจรายวิชา
          </Link>
        </div>
      </div>
    );
  }

  // ── Populated state (grouped by category) ────────────────────────────
  const totalCredits = goals.reduce((sum, g) => sum + g.credits, 0);
  // Only show categories that actually have goals, in the canonical order.
  const usedCategories = GOAL_CATEGORIES.filter((category) =>
    goals.some((g) => g.category === category),
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      {/* Summary sidebar */}
      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-lg border border-[color:var(--border)] bg-[var(--foreground)] p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Learning objectives
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-8">
                เป้าหมายการเรียนรู้ของฉัน
              </h2>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Target aria-hidden="true" className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetricTile label="เป้าหมาย" value={`${goals.length}`} suffix="รายการ" />
            <MetricTile label="หน่วยกิตรวม" value={`${totalCredits}`} suffix="หน่วยกิต" />
          </div>
        </section>

        <section className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-4">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              เพิ่มเป้าหมาย
            </h2>
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">
            เลือกจากหน้าหลักสูตรหรือรายวิชา แล้วกด “เลือกเป็นเป้าหมายการเรียนรู้”
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/member/programs" className="ui-button-primary w-full">
              <Plus aria-hidden="true" className="h-4 w-4" />
              เพิ่มจากหลักสูตร
            </Link>
            <Link href="/member/subjects" className="ui-button-secondary w-full">
              <Plus aria-hidden="true" className="h-4 w-4" />
              เพิ่มจากรายวิชา
            </Link>
          </div>
        </section>
      </aside>

      {/* Grouped goal list */}
      <div className="space-y-6">
        {usedCategories.map((category) => {
          const items = goals.filter((g) => g.category === category);
          const catCredits = items.reduce((sum, g) => sum + g.credits, 0);
          return (
            <CategorySection
              key={category}
              category={category}
              credits={catCredits}
              count={items.length}
            >
              {items.map((goal) => (
                <GoalRow key={goal.id} goal={goal} onRemove={() => removeGoal(goal.id)} />
              ))}
            </CategorySection>
          );
        })}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="text-xs text-white/60">{suffix}</p>
    </div>
  );
}

function CategorySection({
  category,
  credits,
  count,
  children,
}: {
  category: GoalCategory;
  credits: number;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers aria-hidden="true" className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            {category}
          </h2>
        </div>
        <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)]">
          {count} รายการ · {credits} หน่วยกิต
        </span>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function GoalRow({ goal, onRemove }: { goal: LearnerGoal; onRemove: () => void }) {
  const isProgram = goal.itemType === "program";
  const Icon = isProgram ? GraduationCap : BookOpen;
  const typeLabel = isProgram ? "หลักสูตร" : "รายวิชา";
  const detailHref = isProgram
    ? `/member/programs/${goal.slug}`
    : `/member/subjects/${goal.slug}`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3">
      <Link href={detailHref} className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-muted)]">
              {typeLabel}
            </span>
            <span className="truncate text-sm font-semibold text-[var(--foreground)]">
              {goal.name}
            </span>
          </span>
          {goal.nameEn ? (
            <span className="mt-0.5 block truncate text-xs text-[var(--ink-muted)]">
              {goal.nameEn}
            </span>
          ) : null}
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-medium text-[var(--ink-muted)]">
          {goal.credits} นก.
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`ลบ ${goal.name} ออกจากเป้าหมาย`}
          title="ลบออกจากเป้าหมาย"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ink-subtle)] transition hover:bg-[color:color-mix(in_oklch,var(--destructive)_10%,white)] hover:text-[var(--destructive)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
