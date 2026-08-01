import { notFound } from "next/navigation";

import { getPaymentById } from "@/lib/admin/mock-data";

import { PaymentDetailClient } from "./payment-detail-client";

type PaymentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const { id } = await params;
  const payment = getPaymentById(id);

  if (!payment) {
    notFound();
  }

  return <PaymentDetailClient initialPayment={payment} />;
}
