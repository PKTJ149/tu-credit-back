import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AuthPageShell } from "@/components/auth-page-shell";

const destinations = [
  {
    title: "แดชบอร์ดผู้เรียน",
    detail: "ดูภาพรวม สถานะล่าสุด และงานสำคัญที่ต้องทำต่อ",
  },
  {
    title: "รายการลงทะเบียนของฉัน",
    detail: "ตรวจสอบรายการเรียนที่ลงทะเบียนไว้และขั้นตอนถัดไป",
  },
  {
    title: "ข้อมูลการเงิน",
    detail: "ไปต่อที่การชำระเงิน ใบเสร็จ และสถานะทางการเงินที่เกี่ยวข้อง",
  },
];

export default function ReadyPage() {
  return (
    <AuthPageShell
      badge="บัญชีพร้อมใช้งาน"
      title="พร้อมใช้งานแล้ว"
      description="คุณทำขั้นตอนเริ่มต้นครบแล้ว ระบบจะพาคุณไปยังงานถัดไปตามสิ่งที่คุณต้องการทำ"
      panelBadge="ยืนยันตัวตนแล้ว"
      panelTitle="ไปยังงานถัดไป"
      panelDescription="หน้านี้ช่วยให้คุณเห็นปลายทางถัดไปอย่างชัดเจนก่อนเข้าสู่พื้นที่ที่ต้องยืนยันตัวตน"
      currentStep="ready"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Credit Bank มหาวิทยาลัยธรรมศาสตร์พร้อมใช้งานแล้ว
              </h3>
              <p className="text-sm leading-7 text-[var(--ink-muted)]">
                บัญชีของคุณพร้อมสำหรับการใช้งานขั้นตอนถัดไปแล้ว
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {destinations.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-4 py-4"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {item.title}
              </p>
              <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/registrations"
          className="ui-button-primary w-full"
        >
          ดำเนินการต่อ
        </Link>
      </div>
    </AuthPageShell>
  );
}
