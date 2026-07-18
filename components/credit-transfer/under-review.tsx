import Link from "next/link";
import { Lock, Paperclip } from "lucide-react";
import { TransferStatusPanel } from "@/components/credit-transfer/transfer-status-panel";

export function UnderReview() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <TransferStatusPanel
        state="under-review"
        title="อยู่ระหว่างการตรวจสอบของเจ้าหน้าที่"
        body="เจ้าหน้าที่กำลังตรวจสอบความถูกต้องและความเหมาะสมของคำขอเทียบโอนนี้"
      >
        <div className="flex items-start gap-3 rounded-lg border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--muted)_25%,white)] px-4 py-3">
          <Lock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
          <p className="text-sm font-semibold leading-6 text-[var(--foreground)]">
            คำขอนี้ถูกล็อกไว้ระหว่างการตรวจสอบ
            คุณไม่จำเป็นต้องดำเนินการเพิ่มเติมในขณะนี้
          </p>
        </div>
      </TransferStatusPanel>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          หลักฐานที่ส่งไว้
        </h2>
        <dl className="mt-4 divide-y divide-[color:var(--border)]">
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="text-sm text-[var(--ink-muted)]">ไฟล์แนบ</dt>
            <dd className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Paperclip aria-hidden="true" className="h-4 w-4 text-[var(--ink-muted)]" />
              transcript.pdf
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="text-sm text-[var(--ink-muted)]">สถาบันต้นทาง</dt>
            <dd className="text-sm font-semibold text-[var(--foreground)]">
              มหาวิทยาลัยเกษตรศาสตร์
            </dd>
          </div>
        </dl>
      </section>

      <p className="text-sm leading-7 text-[var(--ink-muted)]">
        การตรวจสอบมักใช้เวลา 3-5 วันทำการ หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อฝ่ายสนับสนุนได้
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/transfer/history" className="ui-button-primary w-full sm:w-auto">
          กลับไปหน้าประวัติคำขอ
        </Link>
        <a href="#help" className="ui-button-secondary w-full sm:w-auto">
          ติดต่อฝ่ายสนับสนุน
        </a>
      </div>
    </div>
  );
}
