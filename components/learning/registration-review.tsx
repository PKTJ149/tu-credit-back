"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { formatTHB } from "@/lib/finance/payment-state";

const summaryItems = [
  {
    term: "รายวิชาที่เลือก",
    detail: "การเขียนโปรแกรมเบื้องต้น (ภาคเรียนที่ 1/2569)",
  },
  {
    term: "หน่วยกิต",
    detail: "3 หน่วยกิต",
  },
  {
    term: "ค่าลงทะเบียน",
    detail: formatTHB(3500),
  },
];

export function RegistrationReview() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    router.push("/registrations/confirmation");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
        <dl className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          {summaryItems.map((item) => (
            <div key={item.term}>
              <dt className="text-xs font-medium text-[var(--ink-subtle)]">
                {item.term}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-[color:var(--border)] p-5 sm:p-6">
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            การลงทะเบียนนี้มีค่าใช้จ่ายที่ต้องชำระ
            ระบบจะพาคุณไปยังหน้ายืนยันการลงทะเบียนหลังจากกดปุ่มด้านล่าง
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_16%,white)] p-5 sm:p-6">
        <TriangleAlert
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
        />
        <p className="text-sm leading-7 text-[var(--foreground)]">
          โปรดตรวจสอบว่าคุณไม่มีตารางเรียนที่ชนกันก่อนยืนยันการลงทะเบียน
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="ui-button-primary w-full px-5 text-sm font-semibold sm:w-auto sm:min-w-44"
        >
          {isSubmitting ? "กำลังยืนยัน..." : "ยืนยันการลงทะเบียน"}
        </button>

        <Link
          href="/learning/decision"
          className="ui-button-secondary w-full px-5 text-sm font-medium sm:w-auto"
        >
          แก้ไขตัวเลือก
        </Link>
      </div>
    </div>
  );
}
