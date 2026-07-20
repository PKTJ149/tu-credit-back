import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  Clock3,
  Compass,
  FileText,
  LibraryBig,
  Route,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";

type CategoryProgress = {
  id: string;
  name: string;
  earned: number;
  total: number;
  status: "complete" | "in-progress" | "missing";
  tone: "sky" | "emerald" | "amber" | "rose";
};

type SubjectRecommendation = {
  code: string;
  name: string;
  nameEn: string;
  credits: number;
  category: string;
  reason: string;
};

type RoadmapGroup = {
  id: string;
  name: string;
  totalCredits: number;
  summary: string;
  subjects: {
    code: string;
    name: string;
    nameEn: string;
    credits: number;
    status: "completed" | "in-progress" | "not-started";
  }[];
};

const goal = {
  program: "ครุศาสตรบัณฑิต (สังคมศึกษา)",
  faculty: "คณะครุศาสตร์",
  level: "ปริญญาตรี",
  earnedCredits: 18,
  totalCredits: 136,
};

const categoryProgress: CategoryProgress[] = [
  {
    id: "general",
    name: "หมวดวิชาศึกษาทั่วไป",
    earned: 18,
    total: 24,
    status: "in-progress",
    tone: "sky",
  },
  {
    id: "specific",
    name: "หมวดวิชาเฉพาะ",
    earned: 0,
    total: 94,
    status: "missing",
    tone: "emerald",
  },
  {
    id: "free-elective",
    name: "หมวดวิชาเลือกเสรี",
    earned: 0,
    total: 6,
    status: "missing",
    tone: "amber",
  },
  {
    id: "teaching",
    name: "หมวดประสบการณ์วิชาชีพ",
    earned: 0,
    total: 12,
    status: "missing",
    tone: "rose",
  },
];

const recommendations: SubjectRecommendation[] = [
  {
    code: "000107",
    name: "ความรู้เบื้องต้นเกี่ยวกับการเมืองการปกครอง",
    nameEn: "Introduction to Politics and Government",
    credits: 3,
    category: "วิชาเลือก",
    reason: "กำลังเรียนอยู่และช่วยปิดช่องว่างหมวดศึกษาทั่วไป",
  },
  {
    code: "000108",
    name: "เศรษฐศาสตร์เบื้องต้น",
    nameEn: "Introduction to Economics",
    credits: 3,
    category: "วิชาเลือก",
    reason: "เติมหน่วยกิตเลือกและเชื่อมกับสังคมศึกษาโดยตรง",
  },
  {
    code: "000109",
    name: "จิตวิทยาเพื่อการพัฒนาตน",
    nameEn: "Psychology for Self-Development",
    credits: 3,
    category: "วิชาเลือก",
    reason: "เหมาะกับเส้นทางครูและการทำงานกับผู้เรียน",
  },
];

const roadmapGroups: RoadmapGroup[] = [
  {
    id: "required-general",
    name: "วิชาบังคับศึกษาทั่วไป",
    totalCredits: 18,
    summary: "ฐานความรู้ที่ผู้เรียนทำครบแล้วในต้นแบบนี้",
    subjects: [
      {
        code: "000101",
        name: "มนุษย์กับสังคม",
        nameEn: "Man and Society",
        credits: 3,
        status: "completed",
      },
      {
        code: "000102",
        name: "กฎหมายทั่วไป",
        nameEn: "General Law",
        credits: 3,
        status: "completed",
      },
      {
        code: "000103",
        name: "คอมพิวเตอร์และเทคโนโลยีดิจิทัล",
        nameEn: "Computer and Digital Technology",
        credits: 3,
        status: "completed",
      },
    ],
  },
  {
    id: "elective-general",
    name: "วิชาเลือกศึกษาทั่วไป",
    totalCredits: 6,
    summary: "กลุ่มแรกที่ระบบควรแนะนำให้ลงทะเบียนต่อ",
    subjects: [
      {
        code: "000107",
        name: "ความรู้เบื้องต้นเกี่ยวกับการเมืองการปกครอง",
        nameEn: "Introduction to Politics and Government",
        credits: 3,
        status: "in-progress",
      },
      {
        code: "000108",
        name: "เศรษฐศาสตร์เบื้องต้น",
        nameEn: "Introduction to Economics",
        credits: 3,
        status: "not-started",
      },
      {
        code: "000109",
        name: "จิตวิทยาเพื่อการพัฒนาตน",
        nameEn: "Psychology for Self-Development",
        credits: 3,
        status: "not-started",
      },
    ],
  },
  {
    id: "major-foundation",
    name: "วิชาเฉพาะด้านสังคมศึกษา",
    totalCredits: 94,
    summary: "พื้นที่ใหญ่ที่สุดของช่องว่างหลักสูตร ต้องใช้การวางแผนหลายเทอม",
    subjects: [
      {
        code: "SOC201",
        name: "พื้นฐานสังคมศึกษา",
        nameEn: "Foundations of Social Studies",
        credits: 3,
        status: "not-started",
      },
      {
        code: "SOC202",
        name: "ประวัติศาสตร์และภูมิศาสตร์เพื่อการสอน",
        nameEn: "History and Geography for Teaching",
        credits: 3,
        status: "not-started",
      },
      {
        code: "EDU301",
        name: "การออกแบบการจัดการเรียนรู้",
        nameEn: "Learning Design",
        credits: 3,
        status: "not-started",
      },
    ],
  },
];

const careerPaths = [
  "ครูสังคมศึกษา",
  "อาจารย์มหาวิทยาลัย",
  "นักวิชาการการศึกษา",
  "นักสังคมสงเคราะห์",
  "นักวิจัยทางสังคม",
  "ผู้สอนออนไลน์ / Content Creator",
];

const progressPct = Math.round((goal.earnedCredits / goal.totalCredits) * 100);
const missingCredits = goal.totalCredits - goal.earnedCredits;

type LearningGoalsProps = {
  hasGoal?: boolean;
};

export function LearningGoals({ hasGoal = true }: LearningGoalsProps) {
  if (!hasGoal) {
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
            เลือกหลักสูตรที่คุณต้องการ ระบบจะช่วยวางแผนรายวิชา ติดตามหน่วยกิต
            และแนะนำเส้นทางการเรียนที่เหมาะกับคุณ
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

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-lg border border-[color:var(--border)] bg-[var(--foreground)] p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Learning objective
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-8">{goal.program}</h2>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Target aria-hidden="true" className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/70">
            {goal.faculty} · {goal.level}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetricTile label="สะสมแล้ว" value={`${goal.earnedCredits}`} suffix="หน่วยกิต" />
            <MetricTile label="ยังขาด" value={`${missingCredits}`} suffix="หน่วยกิต" />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-white/70">
              <span>ภาพรวมหลักสูตร</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[var(--secondary)]" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-4">
          <SectionKicker icon={Sparkles} title="รายวิชาที่ระบบควรแนะนำ" />
          <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">
            แนะนำจาก gap ของหลักสูตร ไม่ใช่รายการวิชาทั่วไป
          </p>
          <div className="mt-4 space-y-3">
            {recommendations.map((item) => (
              <RecommendationRow key={item.code} item={item} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-4">
          <SectionKicker icon={Compass} title="สิ่งที่ควรทำต่อ" />
          <div className="mt-4 space-y-3">
            <NextAction
              icon={BookOpen}
              title="เลือกวิชาเพื่อปิด gap"
              body="เริ่มจากวิชาเลือกศึกษาทั่วไปที่ยังขาดอีก 6 หน่วยกิต"
            />
            <NextAction
              icon={FileText}
              title="ตรวจสอบทะเบียน"
              body="หลังเลือกวิชา ต้องไปต่อที่เมนูทะเบียนเพื่อยืนยันการลงทะเบียน"
            />
          </div>
          <Link href="/subjects" className="ui-button-primary mt-4 w-full">
            ไปที่รายวิชา
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </aside>

      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          {categoryProgress.map((category) => (
            <RequirementCell key={category.id} category={category} />
          ))}
        </section>

        <section className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionTitle
              icon={Route}
              title="แผนที่หลักสูตร"
              body="อ่านจากสถานะจริงของผู้เรียน: เรียนครบแล้ว กำลังเรียน และยังไม่ได้เริ่ม"
            />
            <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)]">
              3 กลุ่มแรก
            </span>
          </div>

          <div className="mt-6 space-y-6">
            {roadmapGroups.map((group, index) => (
              <RoadmapLane key={group.id} group={group} index={index + 1} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-5">
          <SectionTitle
            icon={BriefcaseBusiness}
            title="ปลายทางของหลักสูตร"
            body="ช่วยให้ผู้เรียนเข้าใจว่าทำไมต้องสะสมรายวิชากลุ่มนี้"
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {careerPaths.map((career) => (
              <span
                key={career}
                className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]"
              >
                {career}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
            <SectionTitle
              icon={Sparkles}
              title="AI insight สำหรับผู้เรียน"
              body="หน้าจอนี้ควรช่วยอธิบายโอกาสและความเสี่ยงของเส้นทาง ไม่ใช่แค่แสดงจำนวนหน่วยกิต"
            />
            <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
              สำหรับหลักสูตรสายครุศาสตร์ ผู้เรียนควรเห็นภาพว่าการสะสมหน่วยกิตเชื่อมกับการเตรียมใบประกอบวิชาชีพครู
              ทักษะดิจิทัล การสร้างสื่อการสอน และ portfolio อย่างไร ข้อมูลนี้ควรเชื่อมกับผลการเรียนและทะเบียนจริงในอนาคต
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <h3 className="text-sm font-semibold text-amber-950">ข้อควรระวังของ flow</h3>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  `เรียนรู้` ควรจบที่การแนะนำและวางแผน ส่วนการยืนยันวิชาเรียนควรไปต่อที่เมนู `ทะเบียน`
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricTile({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="text-xs text-white/60">{suffix}</p>
    </div>
  );
}

function RequirementCell({ category }: { category: CategoryProgress }) {
  const pct = Math.round((category.earned / category.total) * 100);
  const missing = category.total - category.earned;
  const statusLabel =
    category.status === "complete"
      ? "ครบแล้ว"
      : category.status === "in-progress"
        ? "กำลังเรียน"
        : `ขาด ${missing}`;
  const tone = requirementTone[category.tone];

  return (
    <article className={`rounded-lg border bg-[var(--background)] p-4 ${tone.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}>
          <LibraryBig aria-hidden="true" className="h-4 w-4" />
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone.badge}`}>{statusLabel}</span>
      </div>
      <h3 className="mt-4 min-h-12 text-sm font-semibold leading-6 text-[var(--foreground)]">{category.name}</h3>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--ink-muted)]">
          <span>{category.earned}/{category.total}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </article>
  );
}

function RoadmapLane({ group, index }: { group: RoadmapGroup; index: number }) {
  return (
    <article className="grid gap-4 border-t border-[color:var(--border)] pt-5 lg:grid-cols-[150px_minmax(0,1fr)]">
      <div>
        <p className="font-mono text-xs font-semibold text-[var(--ink-subtle)]">STEP {index}</p>
        <h3 className="mt-1 text-sm font-semibold leading-6 text-[var(--foreground)]">{group.name}</h3>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">
          {group.totalCredits} หน่วยกิต · {group.summary}
        </p>
      </div>

      <div className="space-y-2">
        {group.subjects.map((subject) => (
          <div
            key={subject.code}
            className="grid gap-3 rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="flex min-w-0 gap-3">
              <StatusIcon status={subject.status} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-medium text-[var(--ink-subtle)]">{subject.code}</span>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">{subject.name}</h4>
                </div>
                <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">{subject.nameEn}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <StatusBadge status={subject.status} />
              <span className="text-sm font-medium text-[var(--ink-muted)]">{subject.credits} นก.</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function RecommendationRow({ item }: { item: SubjectRecommendation }) {
  return (
    <Link
      href={`/subjects/${item.code.toLowerCase()}`}
      className="block rounded-lg border border-[color:var(--border)] bg-[var(--surface)] p-4 transition hover:border-[color:var(--ring)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold text-[var(--primary)]">{item.code}</p>
          <h3 className="mt-1 text-sm font-semibold leading-6 text-[var(--foreground)]">{item.name}</h3>
          <p className="text-xs leading-5 text-[var(--ink-muted)]">{item.nameEn}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-medium text-[var(--ink-muted)]">
          {item.credits} นก.
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">{item.reason}</p>
    </Link>
  );
}

function NextAction({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--primary)]">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">{body}</p>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: RoadmapGroup["subjects"][number]["status"] }) {
  if (status === "completed") {
    return <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />;
  }

  if (status === "in-progress") {
    return <Clock3 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />;
  }

  return <Circle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ink-subtle)]" />;
}

function StatusBadge({ status }: { status: RoadmapGroup["subjects"][number]["status"] }) {
  const classes =
    status === "completed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "in-progress"
        ? "bg-sky-50 text-sky-700"
        : "bg-white text-[var(--ink-muted)]";
  const label =
    status === "completed" ? "ครบตามกำหนด" : status === "in-progress" ? "กำลังเรียน" : "ยังไม่ได้เรียน";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>{label}</span>;
}

function SectionTitle({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-5 w-5 text-[var(--primary)]" />
        <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
      </div>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">{body}</p>
    </div>
  );
}

function SectionKicker({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
      <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
    </div>
  );
}

const requirementTone = {
  sky: {
    border: "border-sky-200",
    bg: "bg-sky-50",
    text: "text-sky-700",
    badge: "bg-sky-50 text-sky-700",
    bar: "bg-sky-500",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    badge: "bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
    badge: "bg-rose-50 text-rose-700",
    bar: "bg-rose-500",
  },
};
