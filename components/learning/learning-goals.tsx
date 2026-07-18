import { Target, TrendingUp, Compass } from "lucide-react";
import { LearningItemCard } from "@/components/learning/learning-item-card";
import type { LearningItem } from "@/lib/learning/registration-status";

type SummaryBlock = {
  id: string;
  icon: typeof Target;
  label: string;
  value: string;
};

const summaryBlocks: SummaryBlock[] = [
  {
    id: "goal",
    icon: Target,
    label: "เป้าหมายของคุณ",
    value: "สะสมหน่วยกิตด้านเทคโนโลยีดิจิทัล",
  },
  {
    id: "progress",
    icon: TrendingUp,
    label: "ความก้าวหน้า",
    value: "สะสมแล้ว 12 หน่วยกิต",
  },
  {
    id: "next-step",
    icon: Compass,
    label: "แนะนำขั้นตอนถัดไป",
    value: "ลงทะเบียนรายวิชาเพิ่มเติม",
  },
];

const recommendedPrograms: LearningItem[] = [
  {
    id: "p1",
    type: "program",
    name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    credits: 18,
    description:
      "เส้นทางการเรียนรู้สำหรับผู้ที่ต้องการทักษะการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
  },
  {
    id: "p2",
    type: "program",
    name: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    credits: 15,
    description: "เรียนรู้การวิเคราะห์และนำเสนอข้อมูลเพื่อการตัดสินใจ",
  },
];

const recommendedSubjects: LearningItem[] = [
  {
    id: "s1",
    type: "subject",
    name: "การเขียนโปรแกรมเบื้องต้น",
    credits: 3,
    description: "พื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น",
  },
  {
    id: "s2",
    type: "subject",
    name: "สถิติเบื้องต้นสำหรับนักวิจัย",
    credits: 3,
    description: "หลักการทางสถิติที่ใช้ในการวิจัยเบื้องต้น",
  },
];

export function LearningGoals() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {summaryBlocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.id}
              className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--ink-muted)]">{block.label}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {block.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            หลักสูตรที่แนะนำ
          </h2>
        </div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recommendedPrograms.map((item) => (
            <LearningItemCard key={item.id} item={item} href="/learning/decision" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            รายวิชาที่แนะนำ
          </h2>
        </div>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recommendedSubjects.map((item) => (
            <LearningItemCard key={item.id} item={item} href="/learning/decision" />
          ))}
        </div>
      </section>
    </div>
  );
}
