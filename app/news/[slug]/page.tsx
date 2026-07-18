import { PublicPageShell } from "@/components/public-page-shell";
import { NewsDetail } from "@/components/discovery/news-detail";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  await params;

  return (
    <PublicPageShell>
      <NewsDetail />
    </PublicPageShell>
  );
}
