import Link from "next/link";
import { CheckCircle2, Wallet } from "lucide-react";
import { StatusPanel } from "@/components/finance/status-panel";
import { PayableItemRow } from "@/components/finance/payable-item-row";
import { StatusBadge } from "@/components/finance/status-badge";
import { SectionCard } from "@/components/finance/section-card";
import {
  formatTHB,
  type PayableItem,
  type PaymentState,
} from "@/lib/finance/payment-state";

type HistoryPreviewItem = {
  id: string;
  name: string;
  date: string;
  amount: number;
  state: PaymentState;
};

type FinanceDashboardProps = {
  statusState?: PaymentState;
  payableItems: PayableItem[];
  historyPreview?: HistoryPreviewItem[];
};

export function FinanceDashboard({
  statusState,
  payableItems,
  historyPreview = [],
}: FinanceDashboardProps) {
  const outstandingBalance = payableItems.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const hasPayables = payableItems.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <SectionCard>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm font-medium text-[var(--ink-muted)]">
              ยอดค้างชำระทั้งหมด
            </p>
            <p className="font-mono text-2xl font-semibold text-[var(--foreground)]">
              {formatTHB(outstandingBalance)}
            </p>
          </div>
        </SectionCard>

        {hasPayables && statusState ? (
          <StatusPanel
            state={statusState}
            title="มีรายการที่ต้องชำระเงิน"
            body="คุณมียอดค้างชำระที่ต้องดำเนินการ ตรวจสอบรายละเอียดด้านล่างแล้วไปที่ขั้นตอนการชำระเงิน"
          >
            <Link href="/finance/instructions" className="ui-button-primary">
              ดูวิธีการชำระเงิน
            </Link>
          </StatusPanel>
        ) : !hasPayables ? (
          <div className="flex items-start gap-4 rounded-xl border border-[color:color-mix(in_oklch,var(--secondary)_30%,white)] bg-[color:color-mix(in_oklch,var(--secondary)_10%,white)] p-5">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--secondary-foreground)]"
            />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                ไม่มียอดค้างชำระในขณะนี้
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                เมื่อคุณลงทะเบียนรายวิชา ยอดชำระจะแสดงที่นี่ พร้อมขั้นตอนการดำเนินการ
              </p>
            </div>
          </div>
        ) : null}

        <SectionCard title="รายการที่ต้องชำระ">
          {hasPayables ? (
            <div>
              {payableItems.map((item) => (
                <PayableItemRow
                  key={item.id}
                  item={item}
                  actionLabel="ดำเนินการต่อ"
                  actionHref="/finance/instructions"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-10 text-center">
              <Wallet aria-hidden="true" className="h-7 w-7 text-[var(--ink-subtle)]" />
              <p className="text-sm leading-7 text-[var(--ink-muted)]">
                ยังไม่มีรายการที่ต้องชำระ รายการจะปรากฏที่นี่หลังจากลงทะเบียนรายวิชา
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="ประวัติการทำรายการล่าสุด">
          {historyPreview.length > 0 ? (
            <>
              <div>
                {historyPreview.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-2 border-b border-[color:var(--border)] py-3 last:border-b-0 last:pb-0"
                  >
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">
                      {entry.name}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[var(--ink-subtle)]">{entry.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[var(--foreground)]">
                          {formatTHB(entry.amount)}
                        </span>
                        <StatusBadge state={entry.state} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/finance/documents"
                className="mt-4 inline-flex text-sm font-medium text-[var(--primary)] hover:underline focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
              >
                ดูเอกสารทั้งหมด
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-4 py-8 text-center">
              <p className="text-sm leading-6 text-[var(--ink-muted)]">
                ยังไม่มีประวัติการทำรายการ
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
