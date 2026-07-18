import Link from "next/link";
import { TransferStatusPanel } from "@/components/credit-transfer/transfer-status-panel";

const approvedDetails = [
  { label: "รายวิชาที่อนุมัติ", value: "แคลคูลัส 1" },
  { label: "หน่วยกิตที่ได้รับ", value: "3 หน่วยกิต" },
  { label: "วันที่อนุมัติ", value: "22 ก.ค. 2569" },
];

export function Approved() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <TransferStatusPanel
        state="approved"
        title="คำขอเทียบโอนได้รับการอนุมัติแล้ว"
        body="เจ้าหน้าที่ตรวจสอบและอนุมัติคำขอเทียบโอนของคุณเรียบร้อยแล้ว"
      >
        <p className="text-sm leading-7 text-[var(--ink-muted)]">
          หน่วยกิตนี้จะถูกบันทึกเข้าสู่ประวัติผลการเรียนของคุณโดยอัตโนมัติ
          สามารถตรวจสอบได้ที่หน้าผลการเรียน
        </p>
      </TransferStatusPanel>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          สรุปผลการอนุมัติ
        </h2>
        <dl className="mt-4 divide-y divide-[color:var(--border)]">
          {approvedDetails.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <dt className="text-sm text-[var(--ink-muted)]">{item.label}</dt>
              <dd className="text-sm font-semibold text-[var(--foreground)] sm:text-right">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div>
        <Link href="/transfer/history" className="ui-button-primary w-full sm:w-auto">
          กลับไปหน้าประวัติคำขอ
        </Link>
      </div>
    </div>
  );
}
