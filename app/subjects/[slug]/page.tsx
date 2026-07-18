import { PublicPageShell } from "@/components/public-page-shell";
import { SubjectDetail } from "@/components/discovery/subject-detail";

type SubjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  await params;

  return (
    <PublicPageShell>
      <SubjectDetail />
    </PublicPageShell>
  );
}
