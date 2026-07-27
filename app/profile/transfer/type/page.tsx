import { redirect } from "next/navigation";

export default async function ProfileTransferTypePage({
  searchParams,
}: {
  searchParams: Promise<{ direction?: string }>;
}) {
  const params = await searchParams;
  const direction = params.direction === "out" ? "out" : "in";

  redirect(`/profile/transfer/request?direction=${direction}`);
}
