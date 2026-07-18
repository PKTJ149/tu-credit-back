import { NewsCard } from "@/components/discovery/news-card";
import type { NewsItem } from "@/lib/discovery/types";

type NewsListProps = {
  newsItems: NewsItem[];
};

export function NewsList({ newsItems }: NewsListProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          ข่าวสาร
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)] sm:text-base">
          ติดตามประกาศและความเคลื่อนไหวล่าสุดของ Credit Bank
        </p>
      </div>

      {newsItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div
          role="status"
          className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm leading-6 text-[var(--ink-muted)]"
        >
          ยังไม่มีข่าวสารในขณะนี้
        </div>
      )}
    </div>
  );
}
