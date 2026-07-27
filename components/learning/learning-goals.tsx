"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Clock3,
  Compass,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  Target,
  Timer,
  Wallet,
  X,
} from "lucide-react";
import { programs } from "@/lib/data/programs";
import { getSubjectsByIds, subjects } from "@/lib/data/subjects";
import {
  GOAL_CATEGORIES,
  useSessionData,
  type GoalCategory,
  type LearnerGoal,
  type LearnerRegistration,
} from "@/lib/session/session-data";
import { formatTHB } from "@/lib/finance/payment-state";
import type { AcademicRecord } from "@/lib/learning/registration-status";

type WizardStep = 0 | 1 | 2 | 3;
type GoalIntent = "career" | "credit" | "upskill" | "transfer";
type InterestArea = "technology" | "business" | "design" | "communication";
type StudyPace = "fast" | "balanced" | "light";

type Recommendation = {
  itemType: "program" | "subject";
  slug: string;
  name: string;
  nameEn?: string;
  summary: string;
  image?: string;
  credits: number;
  category: GoalCategory;
  price?: number;
  duration?: string;
  match: string;
};

const intents: Array<{
  id: GoalIntent;
  title: string;
  description: string;
  icon: typeof BriefcaseBusiness;
}> = [
  {
    id: "career",
    title: "เปลี่ยนสายงาน",
    description: "ต้องการเส้นทางที่เป็นระบบและนำไปต่อยอดอาชีพได้",
    icon: BriefcaseBusiness,
  },
  {
    id: "credit",
    title: "สะสมหน่วยกิต",
    description: "ต้องการวางแผนรายวิชาเพื่อสะสมเครดิตอย่างต่อเนื่อง",
    icon: GraduationCap,
  },
  {
    id: "upskill",
    title: "อัปสกิลระยะสั้น",
    description: "ต้องการเรียนจบไวและนำทักษะไปใช้กับงานปัจจุบัน",
    icon: Sparkles,
  },
  {
    id: "transfer",
    title: "เตรียมเทียบโอน",
    description: "ต้องการเลือกวิชาที่จัดหมวดและตรวจสอบหลักฐานได้ง่าย",
    icon: Compass,
  },
];

const interestAreas: Array<{
  id: InterestArea;
  title: string;
  description: string;
}> = [
  {
    id: "technology",
    title: "เทคโนโลยีและข้อมูล",
    description: "Software, Data, AI และเครื่องมือดิจิทัล",
  },
  {
    id: "business",
    title: "ธุรกิจและการจัดการ",
    description: "การตลาด การเงิน โครงการ และภาวะผู้นำ",
  },
  {
    id: "design",
    title: "ออกแบบผลิตภัณฑ์",
    description: "UX/UI, Research, Design Thinking และ Prototype",
  },
  {
    id: "communication",
    title: "การสื่อสารและทักษะทั่วไป",
    description: "การพูด ภาษาอังกฤษ การคิดวิเคราะห์ และทักษะพื้นฐาน",
  },
];

const paces: Array<{
  id: StudyPace;
  title: string;
  description: string;
  icon: typeof Clock3;
}> = [
  {
    id: "fast",
    title: "เร็วที่สุด",
    description: "เน้นอบรมสั้นหรือรายวิชาเดี่ยว",
    icon: Timer,
  },
  {
    id: "balanced",
    title: "สมดุล",
    description: "เรียนเป็นหลักสูตรขนาดกลาง ใช้เวลาไม่หนักเกินไป",
    icon: Clock3,
  },
  {
    id: "light",
    title: "ค่อย ๆ สะสม",
    description: "เลือกทีละวิชาและต่อยอดเป็นหลักสูตรภายหลัง",
    icon: BookOpen,
  },
];

const recommendationMap: Record<
  InterestArea,
  { programs: string[]; subjects: string[]; category: GoalCategory }
> = {
  technology: {
    programs: ["software-development", "data-analytics", "ai-fundamentals"],
    subjects: ["intro-programming", "data-visualization", "ai-for-everyone"],
    category: "หมวดวิชาเฉพาะ",
  },
  business: {
    programs: ["digital-marketing", "project-management", "financial-literacy-workshop"],
    subjects: ["digital-marketing-principles", "financial-planning", "accounting-basics"],
    category: "หมวดวิชาเฉพาะ",
  },
  design: {
    programs: ["ux-ui-design", "educational-technology"],
    subjects: ["design-thinking", "ux-research-fundamentals"],
    category: "หมวดวิชาเลือกเสรี",
  },
  communication: {
    programs: ["public-speaking-workshop", "academic-english"],
    subjects: ["public-speaking", "english-communication", "critical-thinking"],
    category: "หมวดวิชาศึกษาทั่วไป",
  },
};

function buildRecommendations(
  intent: GoalIntent,
  area: InterestArea,
  pace: StudyPace,
): Recommendation[] {
  const source = recommendationMap[area];
  const programItems = programs
    .filter((program) => source.programs.includes(program.slug))
    .map((program): Recommendation => ({
      itemType: "program",
      slug: program.slug,
      name: program.name,
      summary: program.summary,
      image: program.image,
      credits: program.credits,
      category: source.category,
      price: program.totalPrice,
      duration: program.duration,
      match: intent === "career" ? "เหมาะกับการวางเส้นทางอาชีพ" : "เหมาะกับการเรียนแบบเป็นชุด",
    }));
  const subjectItems = subjects
    .filter((subject) => source.subjects.includes(subject.slug))
    .map((subject): Recommendation => ({
      itemType: "subject",
      slug: subject.slug,
      name: subject.name,
      nameEn: subject.nameEn,
      summary: subject.summary,
      image: subject.image,
      credits: subject.credits,
      category: source.category,
      price: subject.price,
      duration: subject.duration,
      match:
        intent === "transfer"
          ? "เหมาะกับการจัดหมวดเพื่อเทียบโอน"
          : "เหมาะกับการเริ่มจากรายวิชาเดี่ยว",
    }));

  if (pace === "fast" || pace === "light") {
    return [...subjectItems, ...programItems].slice(0, 4);
  }

  return [...programItems, ...subjectItems].slice(0, 4);
}

export function LearningGoals() {
  const { data, isReady, addGoal, removeGoal } = useSessionData();
  const goals = data.goals;
  const [wizardRequested, setWizardRequested] = useState(false);
  const showWizard = wizardRequested || (isReady && goals.length === 0);
  const selectedSlugs = new Set(goals.map((goal) => goal.slug));

  function handleAddGoal(item: Recommendation) {
    addGoal({
      name: item.name,
      nameEn: item.nameEn,
      itemType: item.itemType,
      slug: item.slug,
      credits: item.credits,
      category: item.category,
    });
    setWizardRequested(false);
  }

  return (
    <div className="space-y-6">
      {showWizard ? (
        <LearningGoalWizard
          selectedSlugs={selectedSlugs}
          onAddGoal={handleAddGoal}
          onClose={goals.length > 0 ? () => setWizardRequested(false) : undefined}
        />
      ) : null}

      {!showWizard && goals.length === 0 ? (
        <EmptyGoalState onStart={() => setWizardRequested(true)} />
      ) : !showWizard && goals.length > 0 ? (
        <GoalOverview
          goals={goals}
          registrations={data.registrations}
          academicRecords={data.academicRecords}
          onRemoveGoal={removeGoal}
          onAddGoalClick={() => setWizardRequested(true)}
        />
      ) : (
        null
      )}
    </div>
  );
}

function LearningGoalWizard({
  selectedSlugs,
  onAddGoal,
  onClose,
}: {
  selectedSlugs: Set<string>;
  onAddGoal: (item: Recommendation) => void;
  onClose?: () => void;
}) {
  const [step, setStep] = useState<WizardStep>(0);
  const [intent, setIntent] = useState<GoalIntent>("career");
  const [area, setArea] = useState<InterestArea>("technology");
  const [pace, setPace] = useState<StudyPace>("balanced");

  const recommendations = useMemo(
    () => buildRecommendations(intent, area, pace),
    [intent, area, pace],
  );

  const stepLabels = ["เป้าหมาย", "ความสนใจ", "เวลาเรียน", "หลักสูตร/รายวิชาที่แนะนำ"];
  const activeStepLabel = stepLabels[step];

  return (
    <section className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
      <div className="border-b border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--primary)_5%,white)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              ตัวช่วยเลือกเป้าหมายการเรียนรู้
            </div>
            <h2 className="mt-3 text-xl font-semibold text-[var(--foreground)]">
              ให้ระบบช่วยแนะนำหลักสูตรหรือรายวิชาที่เหมาะกับคุณ
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
              ตอบคำถามสั้น ๆ 3 ขั้นตอน แล้วเลือกเพิ่มรายการที่ใช่เป็นเป้าหมายการเรียนรู้ได้ทันที
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-4 py-3">
            <p className="text-xs font-medium text-[var(--ink-muted)]">ขั้นตอนปัจจุบัน</p>
            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {step + 1}/4 · {activeStepLabel}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-4">
          {stepLabels.map((label, index) => {
            const active = index === step;
            const completed = index < step;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index as WizardStep)}
                className={`flex h-10 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition ${
                  active
                    ? "border-[color:var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : completed
                      ? "border-[color:color-mix(in_oklch,var(--primary)_25%,white)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] text-[var(--primary)]"
                      : "border-[color:var(--border)] bg-[var(--background)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
                }`}
              >
                {completed ? <Check aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" /> : null}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {step === 0 ? (
          <ChoiceGrid
            title="คุณอยากเรียนเพื่อเป้าหมายแบบไหน"
            description="เลือกเป้าหมายหลักก่อน เพื่อให้คำแนะนำไม่กว้างเกินไป"
          >
            {intents.map((item) => (
              <ChoiceCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                selected={intent === item.id}
                onClick={() => setIntent(item.id)}
              />
            ))}
          </ChoiceGrid>
        ) : null}

        {step === 1 ? (
          <ChoiceGrid
            title="คุณสนใจกลุ่มทักษะไหนมากที่สุด"
            description="ระบบจะใช้กลุ่มนี้ในการจัดชุดคำแนะนำหลักสูตรและรายวิชา"
          >
            {interestAreas.map((item) => (
              <ChoiceCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={Layers}
                selected={area === item.id}
                onClick={() => setArea(item.id)}
              />
            ))}
          </ChoiceGrid>
        ) : null}

        {step === 2 ? (
          <ChoiceGrid
            title="คุณอยากเรียนด้วยจังหวะแบบไหน"
            description="เลือกตามเวลาที่คุณพร้อม เพื่อให้คำแนะนำเหมาะกับภาระการเรียนจริง"
          >
            {paces.map((item) => (
              <ChoiceCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                selected={pace === item.id}
                onClick={() => setPace(item.id)}
              />
            ))}
          </ChoiceGrid>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  หลักสูตร/รายวิชาที่แนะนำสำหรับเป้าหมายของคุณ
                </h3>
                <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
                  เลือกเพิ่มเป็นเป้าหมาย แล้วค่อยตัดสินใจลงทะเบียนภายหลังได้
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="ui-button-secondary sm:w-auto"
              >
                ปรับคำตอบใหม่
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {recommendations.map((item) => {
                const selected = selectedSlugs.has(item.slug);

                return (
                  <RecommendationCard
                    key={`${item.itemType}-${item.slug}`}
                    item={item}
                    selected={selected}
                    onAdd={() => onAddGoal(item)}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--border)] pt-5 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1) as WizardStep)}
              disabled={step === 0}
              className="ui-button-secondary disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              ย้อนกลับ
            </button>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="ui-button-secondary sm:w-auto"
              >
                กลับไปหน้าเป้าหมาย
              </button>
            ) : null}
          </div>
          {step === 3 ? (
            <Link href="/member/programs" className="ui-button-primary sm:w-auto">
              สำรวจหลักสูตรทั้งหมด
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(3, current + 1) as WizardStep)}
              className="ui-button-primary sm:w-auto"
            >
              ถัดไป
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ChoiceGrid({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">{description}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{children}</div>
    </div>
  );
}

function ChoiceCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  icon: typeof BriefcaseBusiness;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-40 rounded-xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
        selected
          ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_7%,white)] shadow-sm"
          : "border-[color:var(--border)] bg-[var(--background)] hover:border-[color:var(--ring)] hover:bg-[var(--surface)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            selected
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--surface)] text-[var(--ink-muted)]"
          }`}
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        {selected ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">{description}</p>
    </button>
  );
}

function RecommendationCard({
  item,
  selected,
  onAdd,
}: {
  item: Recommendation;
  selected: boolean;
  onAdd: () => void;
}) {
  const isProgram = item.itemType === "program";
  const Icon = isProgram ? GraduationCap : BookOpen;
  const href = isProgram
    ? `/member/programs/${item.slug}`
    : `/member/subjects/${item.slug}`;

  return (
    <article className="flex min-h-96 flex-col overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
      <div className="relative aspect-[16/7] bg-[var(--surface)]">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--ink-subtle)]">
            <Icon aria-hidden="true" className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <span className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[var(--ink-muted)] shadow-sm">
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {isProgram ? "หลักสูตร" : "รายวิชา"}
          </span>
          <span className="rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_28%,white)] px-3 py-1 text-xs font-semibold text-[var(--secondary-foreground)] shadow-sm">
            {item.match}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
        <h4 className="text-base font-semibold leading-7 text-[var(--foreground)]">
          {item.name}
        </h4>
        {item.nameEn ? (
          <p className="mt-0.5 text-xs text-[var(--ink-subtle)]">{item.nameEn}</p>
        ) : null}
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--ink-muted)]">
          {item.summary}
        </p>
      </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[color:var(--border)] pt-4">
          <MiniMetric icon={GraduationCap} label="หน่วยกิต" value={`${item.credits}`} />
          <MiniMetric icon={Wallet} label="ราคา" value={item.price ? formatTHB(item.price) : "-"} />
          <MiniMetric icon={Clock3} label="ระยะเวลา" value={item.duration ?? "-"} />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onAdd}
            disabled={selected}
            className="ui-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {selected ? (
              <>
                <Check aria-hidden="true" className="h-4 w-4" />
                อยู่ในเป้าหมายแล้ว
              </>
            ) : (
              <>
                <Plus aria-hidden="true" className="h-4 w-4" />
                เพิ่มเป็นเป้าหมาย
              </>
            )}
          </button>
          <Link href={href} className="ui-button-secondary sm:w-auto">
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </article>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-[var(--surface)] p-3">
      <div className="flex items-center gap-1.5 text-[var(--ink-subtle)]">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate text-[11px] font-medium">{label}</span>
      </div>
      <p className="mt-1 truncate text-xs font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function EmptyGoalState({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-[var(--background)] px-6 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[color:color-mix(in_oklch,var(--primary)_10%,white)] text-[var(--primary)]">
        <Target aria-hidden="true" className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-[var(--foreground)]">
        ยังไม่มีเป้าหมายการเรียนรู้
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[var(--ink-muted)]">
        ใช้ตัวช่วยด้านบนเพื่อค้นหาหลักสูตรหรือรายวิชาที่เหมาะกับคุณ
        หรือสำรวจจากหน้ารายการทั้งหมดด้วยตัวเอง
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={onStart} className="ui-button-primary sm:w-auto">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
          เพิ่มเป้าหมายการเรียนรู้
        </button>
        <Link href="/member/programs" className="ui-button-secondary sm:w-auto">
          สำรวจหลักสูตร
        </Link>
        <Link href="/member/subjects" className="ui-button-secondary sm:w-auto">
          สำรวจรายวิชา
        </Link>
      </div>
    </div>
  );
}

function GoalOverview({
  goals,
  registrations,
  academicRecords,
  onRemoveGoal,
  onAddGoalClick,
}: {
  goals: LearnerGoal[];
  registrations: LearnerRegistration[];
  academicRecords: AcademicRecord[];
  onRemoveGoal: (goalId: string) => void;
  onAddGoalClick: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<GoalCategory | "ทั้งหมด">("ทั้งหมด");
  const [activeTabId, setActiveTabId] = useState("subjects");
  const goalPlans = goals.map((goal) =>
    buildGoalPlan(goal, registrations, academicRecords),
  );
  const subjectPlans = goalPlans.filter((plan) => plan.goal.itemType === "subject");
  const programPlans = goalPlans.filter((plan) => plan.goal.itemType === "program");
  const programTabLabels = ["หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก"];
  const tabs = [
    ...(subjectPlans.length > 0
      ? [{ id: "subjects", label: "รายวิชา", count: subjectPlans.length }]
      : []),
    ...programPlans.map((plan, index) => ({
      id: plan.goal.id,
      label: `เป้าหมายที่${programTabLabels[index] ?? index + 1}`,
      count: plan.requirements.length,
    })),
  ];
  const currentTabId = tabs.some((tab) => tab.id === activeTabId)
    ? activeTabId
    : tabs[0]?.id;
  const activeProgramPlan = programPlans.find((plan) => plan.goal.id === currentTabId);
  const totalCredits = goalPlans.reduce((sum, plan) => sum + plan.totalCredits, 0);
  const completedCredits = goalPlans.reduce((sum, plan) => sum + plan.completedCredits, 0);
  const registeredRequirementCount = goalPlans.reduce(
    (sum, plan) => sum + plan.requirements.filter((item) => item.status === "registered").length,
    0,
  );
  const activeRequirementCount = goalPlans.reduce(
    (sum, plan) => sum + plan.requirements.filter((item) => item.status === "in-progress").length,
    0,
  );
  const notStartedRequirementCount = goalPlans.reduce(
    (sum, plan) => sum + plan.requirements.filter((item) => item.status === "not-started").length,
    0,
  );
  const programCount = goals.filter((goal) => goal.itemType === "program").length;
  const subjectCount = goals.filter((goal) => goal.itemType === "subject").length;
  const subjectCredits = subjectPlans.reduce((sum, plan) => sum + plan.totalCredits, 0);
  const displayedPlans =
    currentTabId === "subjects"
      ? activeCategory === "ทั้งหมด"
        ? subjectPlans
        : subjectPlans.filter((plan) => plan.goal.category === activeCategory)
      : activeProgramPlan
        ? [activeProgramPlan]
        : [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--primary)_10%,white)] text-[var(--primary)]">
              <Target aria-hidden="true" className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
              เป้าหมายการเรียนรู้ของฉัน
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
              เป้าหมายจะเกิดจากหลักสูตรหรือรายวิชาที่คุณเพิ่มไว้เท่านั้น
              จากนั้นระบบจะตรวจว่ารายวิชาในเป้าหมายนั้นยังไม่ลงทะเบียน ลงทะเบียนแล้ว
              กำลังเรียน หรือเรียนจบแล้ว
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <button
              type="button"
              onClick={onAddGoalClick}
              className="ui-button-primary w-full"
            >
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              เพิ่มเป้าหมายการเรียนรู้
            </button>
            <div className="flex flex-col gap-2">
              <Link href="/member/programs" className="ui-button-secondary w-full">
                สำรวจหลักสูตร
              </Link>
              <Link href="/member/subjects" className="ui-button-secondary w-full">
                สำรวจรายวิชา
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <PlannerMetric label="เป้าหมายทั้งหมด" value={`${goals.length}`} detail="รายการ" />
          <PlannerMetric
            label="ความคืบหน้าหน่วยกิต"
            value={`${completedCredits}/${totalCredits}`}
            detail="หน่วยกิตที่เรียนแล้วจากเป้าหมาย"
          />
          <PlannerMetric
            label="กำลังเรียน/ลงทะเบียน"
            value={`${activeRequirementCount + registeredRequirementCount}`}
            detail={`${activeRequirementCount} กำลังเรียน · ${registeredRequirementCount} ลงทะเบียนแล้ว`}
          />
          <PlannerMetric
            label="ยังไม่ได้เริ่ม"
            value={`${notStartedRequirementCount}`}
            detail={`${programCount} หลักสูตร · ${subjectCount} รายวิชาเป้าหมาย`}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
        <div className="border-b border-[color:var(--border)] bg-[var(--surface)] px-3 pt-3 sm:px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.id === currentTabId;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`min-w-[10rem] rounded-t-lg border border-b-0 px-4 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
                    isActive
                      ? "border-[color:var(--primary)] bg-[var(--background)] text-[var(--foreground)]"
                      : "border-transparent bg-transparent text-[var(--ink-muted)] hover:bg-[var(--background)]"
                  }`}
                >
                  <span className="block text-sm font-semibold">{tab.label}</span>
                  <span className="mt-0.5 block text-xs">
                    {tab.count} {tab.id === "subjects" ? "รายวิชา" : "รายวิชาในแผน"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {currentTabId === "subjects" ? (
          <div className="border-b border-[color:var(--border)] p-5 sm:p-6">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <PlannerFilterButton
                label="ทั้งหมด"
                count={subjectPlans.length}
                credits={subjectCredits}
                active={activeCategory === "ทั้งหมด"}
                onClick={() => setActiveCategory("ทั้งหมด")}
              />
              {GOAL_CATEGORIES.map((category) => {
                const categoryPlans = subjectPlans.filter((plan) => plan.goal.category === category);
                const categoryCredits = categoryPlans.reduce(
                  (sum, plan) => sum + plan.totalCredits,
                  0,
                );

                return (
                  <PlannerFilterButton
                    key={category}
                    label={category}
                    count={categoryPlans.length}
                    credits={categoryCredits}
                    active={activeCategory === category}
                    disabled={categoryPlans.length === 0}
                    onClick={() => setActiveCategory(category)}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="divide-y divide-[color:var(--border)]">
          {displayedPlans.length > 0 ? (
            displayedPlans.map((plan) => (
              <PlannerGoalCard
                key={plan.goal.id}
                plan={plan}
                onRemove={() => onRemoveGoal(plan.goal.id)}
              />
            ))
          ) : (
            <div className="p-6 text-sm text-[var(--ink-muted)]">
              ยังไม่มีเป้าหมายในแท็บนี้
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PlannerMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-[var(--ink-muted)]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--ink-subtle)]">{detail}</p>
    </div>
  );
}

function PlannerFilterButton({
  label,
  count,
  credits,
  active,
  disabled,
  onClick,
}: {
  label: string;
  count: number;
  credits: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45 ${
        active
          ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_7%,white)]"
          : "border-[color:var(--border)] bg-[var(--background)] hover:border-[color:var(--ring)] hover:bg-[var(--surface)]"
      }`}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-[var(--foreground)]">
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-[var(--ink-muted)]">
          {count} รายการ · {credits} หน่วยกิต
        </span>
      </span>
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          active ? "bg-[var(--primary)]" : "bg-[var(--border)]"
        }`}
      />
    </button>
  );
}

type RequirementStatus = "completed" | "in-progress" | "registered" | "not-started";

type GoalRequirement = {
  id: string;
  slug: string;
  name: string;
  code?: string;
  credits: number;
  price?: number;
  status: RequirementStatus;
};

type GoalPlan = {
  goal: LearnerGoal;
  summary: string;
  image?: string;
  requirements: GoalRequirement[];
  completedCredits: number;
  registeredCredits: number;
  totalCredits: number;
};

function PlannerGoalCard({ plan, onRemove }: { plan: GoalPlan; onRemove: () => void }) {
  const { goal } = plan;
  const isProgram = goal.itemType === "program";
  const Icon = isProgram ? GraduationCap : BookOpen;
  const typeLabel = isProgram ? "หลักสูตร" : "รายวิชา";
  const detailHref = isProgram
    ? `/member/programs/${goal.slug}`
    : `/member/subjects/${goal.slug}`;
  const progressPercent =
    plan.totalCredits > 0 ? Math.round((plan.completedCredits / plan.totalCredits) * 100) : 0;

  return (
    <article className="p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[8rem_minmax(0,1fr)_11rem] lg:items-start">
        <Link
          href={detailHref}
          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
        >
          {plan.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={plan.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[var(--ink-subtle)]">
              <Icon aria-hidden="true" className="h-6 w-6" />
            </span>
          )}
        </Link>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-muted)]">
              {typeLabel}
            </span>
            {!isProgram ? (
              <span className="rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_24%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--secondary-foreground)]">
                {goal.category}
              </span>
            ) : null}
          </div>
          <Link
            href={detailHref}
            className="mt-2 block focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            <h4 className="text-base font-semibold leading-7 text-[var(--foreground)]">
              {goal.name}
            </h4>
            {goal.nameEn ? (
              <p className="mt-0.5 text-xs text-[var(--ink-subtle)]">{goal.nameEn}</p>
            ) : null}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-muted)]">
            {plan.summary}
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between gap-3 text-xs font-medium text-[var(--ink-muted)]">
              <span>เรียนแล้ว {plan.completedCredits}/{plan.totalCredits} หน่วยกิต</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div
                className="h-full rounded-full bg-[var(--primary)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:items-stretch">
          <Link href={detailHref} className="ui-button-primary w-full">
            ดูรายละเอียดเป้าหมาย
          </Link>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`ลบ ${goal.name} ออกจากเป้าหมาย`}
            className="ui-button-secondary w-full text-[var(--destructive)]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            ลบออก
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[var(--surface)]">
        <div className="grid grid-cols-[minmax(0,1fr)_5rem_8rem_7rem] gap-3 border-b border-[color:var(--border)] px-4 py-3 text-xs font-semibold text-[var(--ink-subtle)] max-lg:hidden">
          <span>รายวิชาที่ต้องเรียนให้ครบ</span>
          <span>นก.</span>
          <span>สถานะ</span>
          <span className="text-right">ดำเนินการ</span>
        </div>
        <div className="divide-y divide-[color:var(--border)]">
          {plan.requirements.map((requirement) => (
            <RequirementRow key={requirement.id} requirement={requirement} />
          ))}
        </div>
      </div>
    </article>
  );
}

function RequirementRow({ requirement }: { requirement: GoalRequirement }) {
  const status = requirementStatusInfo(requirement.status);

  return (
    <div className="grid gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_5rem_8rem_7rem] lg:items-center">
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-6 text-[var(--foreground)]">
          {requirement.name}
        </p>
        {requirement.code ? (
          <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{requirement.code}</p>
        ) : null}
      </div>
      <div className="text-sm font-medium text-[var(--foreground)]">
        {requirement.credits}
      </div>
      <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
        {status.label}
      </span>
      <Link
        href={`/member/subjects/${requirement.slug}`}
        className="justify-self-start text-sm font-semibold text-[var(--primary)] lg:justify-self-end"
      >
        ดูรายวิชา
      </Link>
    </div>
  );
}

function buildGoalPlan(
  goal: LearnerGoal,
  registrations: LearnerRegistration[],
  academicRecords: AcademicRecord[],
): GoalPlan {
  const isProgram = goal.itemType === "program";
  const program = isProgram ? programs.find((item) => item.slug === goal.slug) : undefined;
  const subject = !isProgram ? subjects.find((item) => item.slug === goal.slug) : undefined;
  const requiredSubjects = program ? getSubjectsByIds(program.subjectIds) : subject ? [subject] : [];
  const requirements = requiredSubjects.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    code: item.code,
    credits: item.credits,
    price: item.price,
    status: getRequirementStatus(item.id, item.slug, item.name, registrations, academicRecords),
  }));
  const completedCredits = requirements
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + item.credits, 0);
  const registeredCredits = requirements
    .filter((item) => item.status === "registered")
    .reduce((sum, item) => sum + item.credits, 0);
  const totalCredits = requirements.reduce((sum, item) => sum + item.credits, 0) || goal.credits;

  return {
    goal,
    summary: program?.summary ?? subject?.summary ?? "เป้าหมายการเรียนรู้ที่เลือกไว้",
    image: program?.image ?? subject?.image,
    requirements,
    completedCredits,
    registeredCredits,
    totalCredits,
  };
}

function getRequirementStatus(
  subjectId: string,
  subjectSlug: string,
  subjectName: string,
  registrations: LearnerRegistration[],
  academicRecords: AcademicRecord[],
): RequirementStatus {
  if (academicRecords.some((record) => record.itemName === subjectName)) {
    return "completed";
  }

  const matchedRegistration = registrations.find((registration) => {
    if (registration.status === "cancelled") return false;
    if (registration.itemType === "subject" && registration.slug === subjectSlug) return true;
    return registration.selectedSubjectIds?.includes(subjectId) ?? false;
  });

  if (!matchedRegistration) return "not-started";
  if (matchedRegistration.status === "completed") return "completed";
  if (matchedRegistration.status === "active") return "in-progress";

  return "registered";
}

function requirementStatusInfo(status: RequirementStatus) {
  if (status === "completed") {
    return {
      label: "เรียนแล้ว",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (status === "registered") {
    return {
      label: "ลงทะเบียนแล้ว",
      className: "bg-amber-50 text-amber-700",
    };
  }

  if (status === "in-progress") {
    return {
      label: "กำลังเรียน",
      className: "bg-sky-50 text-sky-700",
    };
  }

  return {
    label: "ยังไม่ได้ลงทะเบียน",
    className: "bg-[var(--background)] text-[var(--ink-muted)] ring-1 ring-inset ring-[var(--border)]",
  };
}
