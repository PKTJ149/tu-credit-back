import { notFound } from "next/navigation";

import { staticPages } from "@/lib/admin/mock-pages";
import { PageDetailView } from "./page-detail-view";

export default async function ContentPageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = staticPages.find((p) => p.id === id);
  if (!page) notFound();

  return <PageDetailView page={page} />;
}
