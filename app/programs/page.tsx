import { PublicPageShell } from "@/components/public-page-shell";
import { ProgramsList } from "@/components/discovery/programs-list";

export default function ProgramsPage() {
  return (
    <PublicPageShell showBreadcrumb={false}>
      <ProgramsList />
    </PublicPageShell>
  );
}
