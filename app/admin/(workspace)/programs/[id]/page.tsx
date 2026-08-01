import { notFound } from "next/navigation";

import { programs } from "@/lib/data/programs";
import { ProgramDetailView } from "./program-detail-view";

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = programs.find((p) => p.id === id);
  if (!program) notFound();

  return <ProgramDetailView program={program} />;
}
