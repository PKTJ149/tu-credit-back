import type { LucideIcon } from "lucide-react";
import { CircleAlert, CircleCheck, Clock, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { paymentStateInfo, paymentStateToneClasses, type PaymentState } from "@/lib/finance/payment-state";

const defaultIconByTone: Record<string, LucideIcon> = {
  neutral: Clock,
  urgent: CircleAlert,
  positive: CircleCheck,
  corrective: TriangleAlert,
  administrative: Clock,
};

type StatusPanelProps = {
  state: PaymentState;
  title: string;
  body: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

export function StatusPanel({ state, title, body, icon, children }: StatusPanelProps) {
  const info = paymentStateInfo[state];
  const tone = paymentStateToneClasses[info.tone];
  const Icon = icon ?? defaultIconByTone[info.tone];

  return (
    <section
      className={`rounded-xl border p-5 sm:p-6 ${tone.panelBg} ${tone.panelBorder}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] ${tone.icon}`}
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ${tone.badgeBg} ${tone.badgeText}`}
          >
            {info.label}
          </span>
          <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--ink-muted)]">{body}</p>
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
