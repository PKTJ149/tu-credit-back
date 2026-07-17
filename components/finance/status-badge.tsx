import { paymentStateInfo, paymentStateToneClasses, type PaymentState } from "@/lib/finance/payment-state";

type StatusBadgeProps = {
  state: PaymentState;
};

export function StatusBadge({ state }: StatusBadgeProps) {
  const info = paymentStateInfo[state];
  const tone = paymentStateToneClasses[info.tone];

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${tone.badgeBg} ${tone.badgeText}`}
    >
      {info.label}
    </span>
  );
}
