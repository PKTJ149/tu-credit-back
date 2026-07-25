import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public-page-shell";
import { SubjectDetail } from "@/components/discovery/subject-detail";
import { subjects } from "@/lib/data/subjects";

type SubjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  const { slug } = await params;
  const subject = subjects.find((s) => s.slug === slug);

  if (!subject) {
    notFound();
  }

  return (
    <PublicPageShell showBreadcrumb={false}>
      <SubjectDetail subject={subject} />
    </PublicPageShell>
  );
}
