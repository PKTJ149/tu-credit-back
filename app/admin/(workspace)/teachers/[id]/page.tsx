import { notFound } from "next/navigation";

import { teachers } from "@/lib/data/teachers";
import { TeacherDetailView } from "./teacher-detail-view";

export default async function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) notFound();

  return <TeacherDetailView teacher={teacher} />;
}
