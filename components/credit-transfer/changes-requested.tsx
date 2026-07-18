import Link from "next/link";
import { TransferStatusPanel } from "@/components/credit-transfer/transfer-status-panel";

export function ChangesRequested() {
  return (
    <div className="space-y-6">
      <TransferStatusPanel
        state="changes-requested"
        title="ต้องแก้ไขข้อมูลเพิ่มเติม"
        body="เจ้าหน้าที่ตรวจสอบคำขอของคุณแล้ว และต้องการข้อมูลเพิ่มเติมก่อนดำเนินการต่อ คุณไม่ต้องเริ่มคำขอใหม่ทั้งหมด"
      />

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          รายละเอียดที่เจ้าหน้าที่ระบุ
        </h2>
        <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
          ไฟล์ใบแสดงผลการเรียนที่แนบมาไม่ชัดเจน ไม่สามารถตรวจสอบเกรดในรายวิชาได้
        </p>
      </section>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">สิ่งที่ต้องแก้ไข</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
          กรุณาแนบไฟล์ใบแสดงผลการเรียนฉบับใหม่ที่มีความชัดเจน สามารถอ่านเกรดและชื่อรายวิชาได้ครบถ้วน
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/transfer/evidence" className="ui-button-primary w-full sm:w-auto">
          แก้ไขและส่งคำขอใหม่
        </Link>
        <Link href="/transfer/history" className="ui-button-secondary w-full sm:w-auto">
          กลับไปหน้าประวัติคำขอ
        </Link>
      </div>
    </div>
  );
}
