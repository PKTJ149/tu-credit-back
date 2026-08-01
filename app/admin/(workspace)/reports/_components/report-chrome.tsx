"use client";

import { Download, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/admin/detail-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";

/**
 * Shared chrome for all three report screens: the super-admin-only gate and
 * the export affordance. Both are identical across enrollment, revenue, and
 * workload, so they live once here instead of drifting into three slightly
 * different copies.
 */

export function ReportAccessDenied() {
  return (
    <Panel>
      <EmptyState
        icon={ShieldAlert}
        title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
        description="รายงานนี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการดูรายงาน กรุณาติดต่อผู้ดูแลระบบสูงสุด"
      />
    </Panel>
  );
}

/** Real in the UI, honest about its limits: it does not silently do nothing,
 *  it says plainly that the prototype does not produce a file yet. */
export function ReportExportButton({ label = "ส่งออกรายงาน" }: { label?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        toast.info("ยังไม่สามารถส่งออกไฟล์ได้", {
          description: "ต้นแบบนี้ยังไม่เชื่อมต่อระบบสร้างไฟล์ส่งออก ฟีเจอร์นี้อยู่ระหว่างการพัฒนา",
        })
      }
    >
      <Download className="size-4" aria-hidden />
      {label}
    </Button>
  );
}
