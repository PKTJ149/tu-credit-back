import { transferStateInfo, transferStateToneClasses, type TransferState } from "@/lib/credit-transfer/transfer-state";

type TransferStatusBadgeProps = {
  state: TransferState;
};

export function TransferStatusBadge({ state }: TransferStatusBadgeProps) {
  const info = transferStateInfo[state];
  const tone = transferStateToneClasses[info.tone];

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${tone.badgeBg} ${tone.badgeText}`}
    >
      {info.label}
    </span>
  );
}
