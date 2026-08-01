import { notFound } from "next/navigation";

import { getNotificationTemplateById } from "@/lib/admin/mock-reports";

import { NotificationTemplateClient } from "./notification-template-client";

type NotificationTemplatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotificationTemplatePage({ params }: NotificationTemplatePageProps) {
  const { id } = await params;
  const template = getNotificationTemplateById(id);

  if (!template) {
    notFound();
  }

  return <NotificationTemplateClient initialTemplate={template} />;
}
