import { notFound } from "next/navigation";

import { subjects } from "@/lib/data/subjects";
import { SubjectDetailView } from "./subject-detail-view";

export default async function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subject = subjects.find((s) => s.id === id);
  if (!subject) notFound();

  return <SubjectDetailView subject={subject} />;
}
