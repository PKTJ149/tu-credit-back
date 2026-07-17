import { CircleCheck } from "lucide-react";
import { formatTHB } from "@/lib/finance/payment-state";

type PaymentInstructionCardProps = {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  reference: string;
  proofChecklist: string[];
};

export function PaymentInstructionCard({
  amount,
  bankName,
  accountNumber,
  accountName,
  reference,
  proofChecklist,
}: PaymentInstructionCardProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
      <div className="border-b border-[color:var(--border)] p-5 sm:p-6">
        <p className="text-sm font-medium text-[var(--ink-subtle)]">ยอดที่ต้องชำระ</p>
        <p className="mt-1 font-mono text-3xl font-semibold text-[var(--foreground)]">
          {formatTHB(amount)}
        </p>
      </div>

      <dl className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <dt className="text-xs font-medium text-[var(--ink-subtle)]">ธนาคาร</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">{bankName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-[var(--ink-subtle)]">เลขที่บัญชี</dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-[var(--foreground)]">
            {accountNumber}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-[var(--ink-subtle)]">ชื่อบัญชี</dt>
          <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">{accountName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-[var(--ink-subtle)]">หมายเลขอ้างอิง</dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-[var(--foreground)]">
            {reference}
          </dd>
        </div>
      </dl>

      <div className="border-t border-[color:var(--border)] p-5 sm:p-6">
        <p className="text-sm font-semibold text-[var(--foreground)]">หลักฐานที่ต้องเตรียม</p>
        <ul className="mt-3 space-y-2">
          {proofChecklist.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[var(--ink-muted)]">
              <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
