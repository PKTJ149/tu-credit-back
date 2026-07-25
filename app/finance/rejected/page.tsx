import { redirect } from "next/navigation";

export default function PaymentRejectedPage() {
  redirect("/profile/finance/rejected");
}
