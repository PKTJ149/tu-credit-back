"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Circle, CircleCheck } from "lucide-react";
import { Stepper } from "@/components/credit-transfer/stepper";
import type { TransferType } from "@/lib/credit-transfer/transfer-state";

type TransferTypeOption = {
  type: TransferType;
  title: string;
  body: string;
  requirement: string;
};

const options: TransferTypeOption[] = [
  {
    type: "in",
    title: "เทียบโอนเข้า",
    body: "นำผลการเรียนหรือหน่วยกิตจากสถาบันอื่นมาใช้ใน Credit Bank",
    requirement: "ต้องมีชื่อสถาบันต้นทาง รายวิชา และหลักฐานประกอบ",
  },
  {
    type: "out",
    title: "เทียบโอนออก",
    body: "ส่งผลการเรียนที่เสร็จสิ้นใน Credit Bank ไปยังสถาบันปลายทาง",
    requirement: "ต้องระบุรายวิชาที่เสร็จสิ้น สถาบันปลายทาง และประเภทปลายทาง",
  },
];

export function TransferTypeSelection() {
  const router = useRouter();
  const [selected, setSelected] = useState<TransferType | null>(null);

  function handleContinue() {
    if (!selected) return;
    router.push(`/transfer/request?direction=${selected}`);
  }

  return (
    <div>
      <Stepper currentStepIndex={0} />

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option.type;

          return (
            <button
              key={option.type}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(option.type)}
              className={`flex flex-col gap-3 rounded-xl border p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 sm:p-6 ${
                isSelected
                  ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_6%,white)]"
                  : "border-[color:var(--border)] bg-[var(--background)] hover:border-[color:color-mix(in_oklch,var(--primary)_40%,var(--border))]"
              }`}
            >
              <div className="flex items-center gap-3">
                {isSelected ? (
                  <CircleCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                ) : (
                  <Circle aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--ink-muted)]" />
                )}
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{option.title}</h3>
              </div>

              <p className="text-sm leading-6 text-[var(--ink-muted)]">{option.body}</p>

              <p className="text-sm leading-6 text-[var(--ink-subtle)]">{option.requirement}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <button
          type="button"
          disabled={!selected}
          onClick={handleContinue}
          className="ui-button-primary w-full sm:w-auto"
        >
          ดำเนินการต่อ
        </button>
      </div>
    </div>
  );
}
