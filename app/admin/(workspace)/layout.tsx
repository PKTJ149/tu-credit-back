import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";

/** Everything inside this group renders in the staff workspace chrome.
 *  `/admin/login` sits outside it deliberately — a login screen inside the
 *  navigation it is gating is a contradiction. */
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
