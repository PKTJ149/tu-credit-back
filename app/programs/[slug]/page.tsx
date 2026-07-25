import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public-page-shell";
import { ProgramDetail } from "@/components/discovery/program-detail";
import { programs } from "@/lib/data/programs";

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    notFound();
  }

  return (
    <PublicPageShell showBreadcrumb={false}>
      <ProgramDetail program={program} />
    </PublicPageShell>
  );
}
