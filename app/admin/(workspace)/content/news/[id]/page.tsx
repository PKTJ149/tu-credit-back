import { notFound } from "next/navigation";

import { getNewsArticleById } from "@/lib/admin/mock-content";
import { ArticleEditorView } from "../article-editor-view";

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = getNewsArticleById(id);
  if (!article) notFound();

  return <ArticleEditorView mode="edit" article={article} />;
}
