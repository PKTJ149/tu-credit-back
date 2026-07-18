import { PublicPageShell } from "@/components/public-page-shell";
import { SubjectsList } from "@/components/discovery/subjects-list";

export default function SubjectsPage() {
  return (
    <PublicPageShell>
      <SubjectsList />
    </PublicPageShell>
  );
}
