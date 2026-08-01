"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useStaffSession } from "@/lib/admin/staff-session";
import { TODAY } from "@/lib/admin/mock-data";
import type { NotificationTemplate } from "@/lib/admin/types";
import { substituteTemplate, updateNotificationTemplate } from "@/lib/admin/mock-reports";

type NotificationTemplateClientProps = {
  initialTemplate: NotificationTemplate;
};

export function NotificationTemplateClient({ initialTemplate }: NotificationTemplateClientProps) {
  const { role, staff } = useStaffSession();
  const [template, setTemplate] = useState(initialTemplate);
  const [subject, setSubject] = useState(initialTemplate.subject);
  const [body, setBody] = useState(initialTemplate.body);
  const [active, setActive] = useState(initialTemplate.active);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="เทมเพลตการแจ้งเตือน" backHref="/admin/notifications" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการแก้ไขเทมเพลตการแจ้งเตือน กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  const isDirty = subject !== template.subject || body !== template.body || active !== template.active;

  /** Inserts `{{variable}}` at the current cursor position rather than
   *  appending it to the end — the editor only ever offers variables the
   *  template itself declares, so a placeholder can never end up in the body
   *  without a matching sample value in the preview. */
  function insertVariable(variable: string) {
    const el = bodyRef.current;
    const token = `{{${variable}}}`;
    if (!el) {
      setBody((b) => `${b}${token}`);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = `${body.slice(0, start)}${token}${body.slice(end)}`;
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + token.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  function handleSave() {
    const next: NotificationTemplate = { ...template, subject, body, active, updatedAt: TODAY, updatedByStaffId: staff?.id ?? template.updatedByStaffId };
    updateNotificationTemplate(next);
    setTemplate(next);
    toast.success("บันทึกเทมเพลตแล้ว", { description: template.event });
  }

  function handleToggleActive(value: boolean) {
    setActive(value);
    const next: NotificationTemplate = { ...template, active: value, updatedAt: TODAY, updatedByStaffId: staff?.id ?? template.updatedByStaffId };
    updateNotificationTemplate(next);
    setTemplate(next);
    toast(value ? "เปิดใช้งานเทมเพลตแล้ว" : "ปิดใช้งานเทมเพลตแล้ว", { description: template.event });
  }

  return (
    <>
      <PageHeader
        title={template.event}
        description={`เหตุการณ์: ${template.key}`}
        backHref="/admin/notifications"
        backLabel="กลับไปยังรายการเทมเพลต"
        actions={
          <Button size="sm" onClick={handleSave} disabled={!isDirty}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Panel title="แก้ไขข้อความ" description="ใช้ตัวแปรด้านล่างเพื่อแทรกข้อมูลที่จะถูกแทนที่ด้วยค่าจริงเมื่อระบบส่งข้อความ">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">เปิดใช้งานเทมเพลตนี้</p>
                  <p className="text-xs text-[var(--ink-muted)]">เมื่อปิดใช้งาน ระบบจะไม่ส่งการแจ้งเตือนนี้ให้ผู้เรียนอีก</p>
                </div>
                <Switch checked={active} onCheckedChange={handleToggleActive} aria-label="เปิด/ปิดใช้งานเทมเพลต" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tmpl-subject">หัวข้อข้อความ</Label>
                <Input id="tmpl-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tmpl-body">เนื้อหาข้อความ</Label>
                <Textarea id="tmpl-body" ref={bodyRef} rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="font-mono text-sm" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[var(--ink-subtle)]">ตัวแปรที่ใช้ได้ — คลิกเพื่อแทรกที่ตำแหน่งเคอร์เซอร์</Label>
                <div className="flex flex-wrap gap-1.5">
                  {template.variables.map((v) => (
                    <Button key={v} type="button" variant="outline" size="sm" onClick={() => insertVariable(v)} className="font-mono text-xs">
                      {`{{${v}}}`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="ช่องทางการส่ง">
            <p className="text-sm text-[var(--ink-muted)]">
              {template.channels.map((c) => (c === "in-app" ? "แจ้งเตือนในระบบ" : "อีเมล")).join(" และ ")}
            </p>
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title="ตัวอย่างข้อความ" description="แทนที่ตัวแปรด้วยค่าตัวอย่าง เพื่อดูว่าผู้เรียนจะเห็นข้อความนี้อย่างไรจริง">
            <div className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--ink-subtle)]">หัวข้อ</p>
                <p className="text-sm font-semibold text-pretty">{substituteTemplate(subject, template.variables)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--ink-subtle)]">เนื้อหา</p>
                <p className="text-sm leading-6 whitespace-pre-line text-pretty">{substituteTemplate(body, template.variables)}</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
