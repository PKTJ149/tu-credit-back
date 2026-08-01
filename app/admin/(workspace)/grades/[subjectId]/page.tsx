import { notFound } from "next/navigation";

import { getGradeEntriesForSubject } from "@/lib/admin/mock-grades";
import { subjects } from "@/lib/data/subjects";

import { GradeRosterClient } from "./grade-roster-client";

type GradeRosterPageProps = {
  params: Promise<{ subjectId: string }>;
};

export default async function GradeRosterPage({ params }: GradeRosterPageProps) {
  const { subjectId } = await params;
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    notFound();
  }

  const initialEntries = getGradeEntriesForSubject(subject.id);

  return <GradeRosterClient subject={subject} initialEntries={initialEntries} />;
}
