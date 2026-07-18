import Link from "next/link";
import { TransferStatusPanel } from "@/components/credit-transfer/transfer-status-panel";

export function Withdrawn() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <TransferStatusPanel
        state="withdrawn"
        title="คำขอเทียบโอนถูกถอนแล้ว"
        body="คำขอเทียบโอนนี้ถูกถอนออกก่อนการพิจารณาเสร็จสิ้น"
      />

      <p className="text-sm leading-7 text-[var(--ink-muted)]">
        คุณสามารถเริ่มคำขอเทียบโอนใหม่ได้ทุกเมื่อจากหน้าเทียบโอนหน่วยกิต
        หากยังต้องการดำเนินการนี้
      </p>

      <div>
        <Link href="/transfer/history" className="ui-button-primary w-full sm:w-auto">
          กลับไปหน้าประวัติคำขอ
        </Link>
      </div>
    </div>
  );
}
