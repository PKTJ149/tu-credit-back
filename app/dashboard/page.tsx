import Link from "next/link";
import { ArrowRight, ArrowLeftRight, Compass, Wallet } from "lucide-react";
import { MemberPageShell } from "@/components/member-page-shell";

const actions = [
  {
    icon: Compass,
    title: "เป้าหมายการเรียนรู้",
    description: "เลือกหลักสูตรที่ต้องการ วางแผนรายวิชา และติดตามความคืบหน้า",
    href: "/learning",
    cta: "ตั้งเป้าหมาย",
  },
  {
    icon: Compass,
    title: "สำรวจหลักสูตรและรายวิชา",
    description: "ค้นหาหลักสูตรและรายวิชาที่เปิดสอนก่อนตัดสินใจลงทะเบียน",
    href: "/member/programs",
    cta: "ดูหลักสูตร",
  },
  {
    icon: ArrowLeftRight,
    title: "เทียบโอนหน่วยกิต",
    description: "นำผลการเรียนจากสถาบันอื่นมาใช้ หรือส่งผลการเรียนออกไปยังสถาบันปลายทาง",
    href: "/transfer/type",
    cta: "เริ่มคำขอ",
  },
  {
    icon: Wallet,
    title: "ตรวจสอบการเงิน",
    description: "ดูยอดค้างชำระ ประวัติการชำระเงิน และดาวน์โหลดเอกสารทางการเงิน",
    href: "/finance",
    cta: "ดูสถานะการเงิน",
  },
];

export default function DashboardPage() {
  return (
    <MemberPageShell
      title="แดชบอร์ด"
      description="ยินดีต้อนรับสู่ระบบ Credit Bank มหาวิทยาลัยธรรมศาสตร์"
      currentNav="dashboard"
    >
      <div className="space-y-8">
        <div className="rounded-xl border border-[color:var(--border)] bg-[var(--foreground)] p-6 text-white sm:p-8">
          <p className="text-sm font-medium text-white/60">เริ่มต้นใช้งาน</p>
          <h2 className="mt-2 text-xl font-semibold leading-8 sm:text-2xl">
            ยินดีต้อนรับสู่ Credit Bank
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
            ระบบ Credit Bank ช่วยให้คุณสะสมหน่วยกิต ติดตามความคืบหน้าตามหลักสูตร
            และเทียบโอนผลการเรียนได้ในที่เดียว เลือกขั้นตอนแรกที่ต้องการด้านล่าง
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 transition hover:border-[color:var(--ring)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--primary)_12%,white)] text-[var(--primary)]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                    {action.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
                  {action.cta}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </MemberPageShell>
  );
}
