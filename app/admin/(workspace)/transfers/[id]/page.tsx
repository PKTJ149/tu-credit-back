import { notFound } from "next/navigation";

import { getTransferCaseById } from "@/lib/admin/mock-data";
import { TransferCaseReview } from "./case-review";

type TransferCaseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TransferCaseDetailPage({ params }: TransferCaseDetailPageProps) {
  const { id } = await params;
  const transferCase = getTransferCaseById(id);

  if (!transferCase) {
    notFound();
  }

  return <TransferCaseReview initialCase={transferCase} />;
}
