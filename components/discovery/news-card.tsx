import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { NewsItem } from "@/lib/discovery/types";

type NewsCardProps = {
  news: NewsItem;
};

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link
      href={`/news/${news.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 transition hover:border-[color:var(--ring)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
    >
      <div className="flex items-center gap-2 text-[var(--ink-subtle)]">
        <Newspaper aria-hidden="true" className="h-4 w-4" />
        <span className="text-xs font-medium">{news.date}</span>
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)]">{news.title}</h3>
      <p className="text-sm leading-6 text-[var(--ink-muted)]">{news.summary}</p>
    </Link>
  );
}
