"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Stepper } from "@/components/credit-transfer/stepper";

const requestDetailItems = [
  {
    term: "สถาบันต้นทาง",
    detail: "มหาวิทยาลัยเกษตรศาสตร์",
  },
  {
    term: "รายวิชา",
    detail: "แคลคูลัส 1",
  },
  {
    term: "รายละเอียดเพิ่มเติม",
    detail: "ต้องการเทียบโอนหน่วยกิตวิชาแคลคูลัส 1 ที่เรียนและสอบผ่านแล้ว",
  },
];

export function ReviewRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    router.push("/transfer/confirmation");
  }

  return (
    <div>
      <Stepper currentStepIndex={3} />

      <div className="min-w-0 rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
        <section className="space-y-3 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              ประเภทคำขอ
            </h2>
            <Link
              href="/transfer/type"
              className="text-sm font-medium text-[var(--primary)]"
            >
              แก้ไข
            </Link>
          </div>
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            เทียบโอนเข้า
          </p>
        </section>

        <section className="space-y-3 border-t border-[color:var(--border)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              รายละเอียดคำขอ
            </h2>
            <Link
              href="/transfer/request"
              className="text-sm font-medium text-[var(--primary)]"
            >
              แก้ไข
            </Link>
          </div>
          <dl className="space-y-3">
            {requestDetailItems.map((item) => (
              <div key={item.term}>
                <dt className="text-xs font-medium text-[var(--ink-subtle)]">
                  {item.term}
                </dt>
                <dd className="mt-1 text-sm leading-7 text-[var(--foreground)]">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-3 border-t border-[color:var(--border)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              หลักฐานที่แนบ
            </h2>
            <Link
              href="/transfer/evidence"
              className="text-sm font-medium text-[var(--primary)]"
            >
              แก้ไข
            </Link>
          </div>
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            transcript.pdf
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="ui-button-primary w-full px-5 text-sm font-semibold sm:w-auto sm:min-w-44"
        >
          {isSubmitting ? "กำลังส่งคำขอ..." : "ส่งคำขอ"}
        </button>

        <Link
          href="/transfer/request"
          className="ui-button-secondary w-full px-5 text-sm font-medium sm:w-auto"
        >
          แก้ไขคำขอ
        </Link>
      </div>
    </div>
  );
}
