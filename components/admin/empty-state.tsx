import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  /** Say what would put something here, not "no data found". An empty queue
   *  should teach the officer what fills it. */
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-14 text-center", className)}>
      <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--ink-subtle)]">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mx-auto max-w-[46ch] text-sm leading-6 text-[var(--ink-muted)] text-pretty">{description}</p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
