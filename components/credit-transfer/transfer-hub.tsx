import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { SectionCard } from "@/components/finance/section-card";
import { TransferTypeCard } from "@/components/credit-transfer/transfer-type-card";
import { RequestRow } from "@/components/credit-transfer/request-row";
import type { TransferRequest } from "@/lib/credit-transfer/transfer-state";

const recentRequests: TransferRequest[] = [
  {
    id: "t1",
    type: "in",
    title: "เทียบโอนรายวิชาแคลคูลัส 1 จากมหาวิทยาลัยเกษตรศาสตร์",
    submittedDate: "10 ก.ค. 2569",
    state: "under-review",
  },
  {
    id: "t2",
    type: "out",
    title: "ส่งผลการเรียนไปยังมหาวิทยาลัยเชียงใหม่",
    submittedDate: "2 มิ.ย. 2569",
    state: "approved",
  },
];

export function TransferHub() {
  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-sm leading-7 text-[var(--ink-muted)]">
          การเทียบโอนหน่วยกิตช่วยให้คุณนำผลการเรียนจากที่อื่นมาใช้ใน Credit
          Bank หรือส่งผลการเรียนที่นี่ไปยังสถาบันอื่นได้
        </p>
      </SectionCard>

      <div className="grid gap-6 sm:grid-cols-2">
        <TransferTypeCard
          icon={ArrowDownToLine}
          title="เทียบโอนเข้า"
          description="นำผลการเรียนหรือหน่วยกิตจากสถาบันอื่นมาใช้ใน Credit Bank"
          requirements={[
            "ชื่อสถาบันต้นทาง",
            "รายวิชาหรือหน่วยกิตที่ต้องการเทียบโอน",
            "หลักฐานประกอบ เช่น ใบแสดงผลการเรียน",
          ]}
          href="/transfer/type?direction=in"
          ctaLabel="เริ่มเทียบโอนเข้า"
        />

        <TransferTypeCard
          icon={ArrowUpFromLine}
          title="เทียบโอนออก"
          description="ส่งผลการเรียนที่เสร็จสิ้นใน Credit Bank ไปยังสถาบันปลายทาง"
          requirements={[
            "รายวิชาที่เสร็จสิ้นแล้วที่ต้องการส่ง",
            "ชื่อและประเภทสถาบันปลายทาง",
            "รายละเอียดเพิ่มเติมตามที่ปลายทางกำหนด",
          ]}
          href="/transfer/type?direction=out"
          ctaLabel="เริ่มเทียบโอนออก"
        />
      </div>

      <SectionCard title="คำขอล่าสุด">
        <div>
          {recentRequests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              actionLabel="ดูรายละเอียด"
              actionHref="/transfer/history"
            />
          ))}
        </div>
        <Link
          href="/transfer/history"
          className="mt-4 inline-flex text-sm font-medium text-[var(--primary)] hover:underline focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
        >
          ดูประวัติคำขอทั้งหมด
        </Link>
      </SectionCard>
    </div>
  );
}
