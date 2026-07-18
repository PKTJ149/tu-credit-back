import Link from "next/link";
import { CircleCheck, GraduationCap } from "lucide-react";

const item = {
  title: "การเขียนโปรแกรมเบื้องต้น",
  credits: "3 หน่วยกิต",
  eligibilityMessage: "คุณมีคุณสมบัติครบถ้วนสำหรับการลงทะเบียนรายวิชานี้",
  benefits: [
    "พื้นฐานตรรกะการเขียนโปรแกรมที่นำไปใช้ต่อยอดได้",
    "ฝึกแก้ปัญหาอย่างเป็นระบบ",
    "เตรียมความพร้อมสำหรับรายวิชาขั้นสูงถัดไป",
  ],
};

const relatedItems = ["สถิติเบื้องต้นสำหรับนักวิจัย", "หลักการตลาดดิจิทัล"];

export function DecisionView() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
        <div className="flex items-start gap-4 border-b border-[color:var(--border)] p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
            <GraduationCap aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {item.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--ink-subtle)]">
              {item.credits}
            </p>
          </div>
        </div>

        <dl className="grid gap-5 p-5 sm:p-6">
          <div>
            <dt className="text-xs font-medium text-[var(--ink-subtle)]">
              คุณสมบัติ
            </dt>
            <dd className="mt-1 flex items-start gap-2 text-sm leading-6 text-[var(--foreground)]">
              <CircleCheck
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
              />
              {item.eligibilityMessage}
            </dd>
          </div>
        </dl>

        <div className="border-t border-[color:var(--border)] p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            ประโยชน์ที่จะได้รับ
          </p>
          <ul className="mt-3 space-y-2">
            {item.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm leading-6 text-[var(--ink-muted)]"
              >
                <CircleCheck
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
                />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[color:var(--border)] p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            รายวิชาที่เกี่ยวข้อง
          </p>
          <ul className="mt-3 space-y-2">
            {relatedItems.map((relatedItem) => (
              <li
                key={relatedItem}
                className="text-sm leading-6 text-[var(--ink-muted)]"
              >
                {relatedItem}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/learning/review"
          className="ui-button-primary w-full sm:w-auto sm:min-w-56"
        >
          ลงทะเบียน
        </Link>
        <button
          type="button"
          className="ui-button-secondary w-full sm:w-auto"
        >
          บันทึกไว้ดูภายหลัง
        </button>
      </div>
    </div>
  );
}
