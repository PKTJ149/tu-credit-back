import { redirect } from "next/navigation";

export default function PaymentConfirmedPage() {
  redirect("/profile/finance/confirmed");
}
