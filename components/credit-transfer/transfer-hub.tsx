import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, ClipboardList } from "lucide-react";
import { SectionCard } from "@/components/finance/section-card";
import { TransferTypeCard } from "@/components/credit-transfer/transfer-type-card";
import { RequestRow } from "@/components/credit-transfer/request-row";
import type { TransferRequest } from "@/lib/credit-transfer/transfer-state";

type TransferHubProps = {
  recentRequests?: TransferRequest[];
};

export function TransferHub({ recentRequests = [] }: TransferHubProps) {
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
        {recentRequests.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-10 text-center">
            <ClipboardList aria-hidden="true" className="h-7 w-7 text-[var(--ink-subtle)]" />
            <p className="text-sm leading-7 text-[var(--ink-muted)]">
              ยังไม่มีคำขอเทียบโอน เลือกประเภทด้านบนเพื่อเริ่มคำขอแรกของคุณ
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
