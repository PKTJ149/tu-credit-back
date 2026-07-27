import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { RequestRow } from "@/components/credit-transfer/request-row";
import type { TransferRequest, TransferState } from "@/lib/credit-transfer/transfer-state";

type StatusHistoryProps = {
  requests: TransferRequest[];
  basePath?: string;
};

const statusSegmentByState: Partial<Record<TransferState, string>> = {
  "under-review": "under-review",
  "changes-requested": "changes-requested",
  approved: "approved",
  rejected: "rejected",
  withdrawn: "withdrawn",
};

function getDetailHref(state: TransferState, basePath: string) {
  return `${basePath}/${statusSegmentByState[state] ?? "confirmation"}`;
}

export function StatusHistory({ requests, basePath = "/transfer" }: StatusHistoryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Link href={basePath} className="ui-button-primary">
          เริ่มคำขอใหม่
        </Link>
      </div>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          ประวัติคำขอเทียบโอน
        </h2>

        {requests.length > 0 ? (
          <div className="mt-4">
            {requests.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                actionLabel="ดูรายละเอียด"
                actionHref={getDetailHref(request.state, basePath)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-12 text-center">
            <ClipboardList aria-hidden="true" className="h-8 w-8 text-[var(--ink-subtle)]" />
            <p className="text-sm leading-7 text-[var(--ink-muted)]">
              คุณยังไม่มีคำขอเทียบโอนหน่วยกิต
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
