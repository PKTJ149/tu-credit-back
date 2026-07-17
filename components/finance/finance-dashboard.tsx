import Link from "next/link";
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
  statusState: PaymentState;
  payableItems: PayableItem[];
  historyPreview?: HistoryPreviewItem[];
};

const defaultHistoryPreview: HistoryPreviewItem[] = [
  {
    id: "history-1",
    name: "รายวิชา: หลักการตลาดดิจิทัล (ภาคเรียนที่ 3/2568)",
    date: "15 มี.ค. 2569",
    amount: 3200,
    state: "payment-confirmed",
  },
  {
    id: "history-2",
    name: "รายวิชา: สถิติเพื่อการวิจัย (ภาคเรียนที่ 2/2568)",
    date: "20 พ.ย. 2568",
    amount: 2800,
    state: "payment-confirmed",
  },
];

export function FinanceDashboard({
  statusState,
  payableItems,
  historyPreview = defaultHistoryPreview,
}: FinanceDashboardProps) {
  const outstandingBalance = payableItems.reduce(
    (total, item) => total + item.amount,
    0,
  );

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

        <StatusPanel
          state={statusState}
          title="มีรายการที่ต้องชำระเงิน"
          body="คุณมียอดค้างชำระที่ต้องดำเนินการ ตรวจสอบรายละเอียดด้านล่างแล้วไปที่ขั้นตอนการชำระเงิน"
        >
          <Link href="/finance/instructions" className="ui-button-primary">
            ดูวิธีการชำระเงิน
          </Link>
        </StatusPanel>

        <SectionCard title="รายการที่ต้องชำระ">
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
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="ประวัติการทำรายการล่าสุด">
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
        </SectionCard>
      </div>
    </div>
  );
}
