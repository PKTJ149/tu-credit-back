import Link from "next/link";
import { TransferStatusPanel } from "@/components/credit-transfer/transfer-status-panel";

const submittedDetails = [
  { label: "เลขที่คำขอ", value: "CT-2569-0142" },
  { label: "วันที่ส่งคำขอ", value: "18 ก.ค. 2569 เวลา 14:32 น." },
  { label: "ประเภทคำขอ", value: "เทียบโอนเข้า" },
];

export function SubmissionConfirmation() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <TransferStatusPanel
        state="submitted"
        title="ส่งคำขอเทียบโอนเรียบร้อยแล้ว"
        body="เราได้รับคำขอเทียบโอนของคุณแล้ว ทีมงานจะเริ่มตรวจสอบคำขอนี้ในลำดับถัดไป"
      />

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          สรุปข้อมูลคำขอ
        </h2>
        <dl className="mt-4 divide-y divide-[color:var(--border)]">
          {submittedDetails.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <dt className="text-sm text-[var(--ink-muted)]">{item.label}</dt>
              <dd className="text-sm font-semibold text-[var(--foreground)]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-sm leading-7 text-[var(--ink-muted)]">
        การตรวจสอบมักใช้เวลา 3-5 วันทำการ คุณสามารถติดตามความคืบหน้าได้จากหน้าประวัติคำขอ
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/transfer/history" className="ui-button-primary w-full sm:w-auto">
          ดูสถานะและประวัติคำขอ
        </Link>
        <Link href="/transfer" className="ui-button-secondary w-full sm:w-auto">
          กลับไปหน้าเทียบโอนหน่วยกิต
        </Link>
      </div>
    </div>
  );
}
