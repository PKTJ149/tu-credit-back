import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type TransferTypeCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  requirements: string[];
  href: string;
  ctaLabel: string;
};

export function TransferTypeCard({
  icon: Icon,
  title,
  description,
  requirements,
  href,
  ctaLabel,
}: TransferTypeCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{description}</p>
      </div>

      <ul className="space-y-2">
        {requirements.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[var(--ink-muted)]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
            {item}
          </li>
        ))}
      </ul>

      <Link href={href} className="ui-button-primary mt-auto w-full">
        {ctaLabel}
      </Link>
    </div>
  );
}
