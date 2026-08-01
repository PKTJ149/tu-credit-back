"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { FormErrorSummary } from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useStaffSession } from "@/lib/admin/staff-session";
import {
  LEARNER_VISIBLE_SETTING_IDS,
  SITE_SETTING_GROUP_HINT,
  SITE_SETTING_GROUP_LABEL,
  siteSettings as initialSiteSettings,
} from "@/lib/admin/mock-settings";
import type { SiteSetting } from "@/lib/admin/types";

const GROUP_ORDER: SiteSetting["group"][] = ["identity", "contact", "registration", "consent"];

/** One rule per `kind`, so a malformed value is caught inline instead of
 *  silently saved — an unreachable support email or a broken logo link only
 *  shows up once a ผู้เรียน hits it. */
function validateSetting(setting: SiteSetting): string | undefined {
  const value = setting.value.trim();
  switch (setting.kind) {
    case "toggle":
      return undefined;
    case "email":
      if (value === "") return "กรุณาระบุอีเมล";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "รูปแบบอีเมลไม่ถูกต้อง";
      return undefined;
    case "phone":
      if (value === "") return "กรุณาระบุเบอร์โทรศัพท์";
      if (!/^[0-9+()\-\s]{6,}$/.test(value)) return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
      return undefined;
    case "url":
      if (value === "") return "กรุณาระบุลิงก์";
      try {
        const url = new URL(value);
        if (!url.protocol.startsWith("http")) return "ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://";
      } catch {
        return "รูปแบบลิงก์ไม่ถูกต้อง";
      }
      return undefined;
    case "number":
      if (value === "") return "กรุณาระบุตัวเลข";
      if (Number.isNaN(Number(value))) return "กรุณาระบุตัวเลขที่ถูกต้อง";
      return undefined;
    case "text":
    case "textarea":
      return value === "" ? "กรุณาระบุข้อมูลนี้" : undefined;
    default:
      return undefined;
  }
}

function GeneralSettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>(initialSiteSettings);
  const [touchedGroups, setTouchedGroups] = useState<Record<SiteSetting["group"], boolean>>({
    identity: false,
    contact: false,
    registration: false,
    consent: false,
  });

  function updateValue(id: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  }

  function handleSave(group: SiteSetting["group"]) {
    setTouchedGroups((prev) => ({ ...prev, [group]: true }));
    const groupSettings = settings.filter((s) => s.group === group);
    const hasErrors = groupSettings.some((s) => validateSetting(s));
    if (hasErrors) return;
    toast.success(`บันทึกการตั้งค่า${SITE_SETTING_GROUP_LABEL[group]}แล้ว`);
  }

  function renderField(setting: SiteSetting, touched: boolean) {
    const error = touched ? validateSetting(setting) : undefined;
    const learnerVisible = LEARNER_VISIBLE_SETTING_IDS.has(setting.id);
    const fieldId = `setting-${setting.id}`;
    const errorId = `${fieldId}-error`;

    let control: ReactNode;
    if (setting.kind === "toggle") {
      control = (
        <div className="flex h-9 items-center gap-2.5">
          <Switch
            id={fieldId}
            checked={setting.value === "true"}
            onCheckedChange={(checked) => updateValue(setting.id, checked ? "true" : "false")}
          />
          <span className="text-sm text-[var(--ink-muted)]">{setting.value === "true" ? "เปิดใช้งาน" : "ปิดใช้งาน"}</span>
        </div>
      );
    } else if (setting.kind === "textarea") {
      control = (
        <Textarea
          id={fieldId}
          value={setting.value}
          onChange={(e) => updateValue(setting.id, e.target.value)}
          rows={3}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      );
    } else {
      const inputType = setting.kind === "email" ? "email" : setting.kind === "url" ? "url" : setting.kind === "phone" ? "tel" : setting.kind === "number" ? "number" : "text";
      control = (
        <Input
          id={fieldId}
          type={inputType}
          value={setting.value}
          onChange={(e) => updateValue(setting.id, e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      );
    }

    return (
      <div key={setting.id} className={setting.kind === "textarea" ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Label htmlFor={fieldId}>{setting.label}</Label>
          <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-subtle)]">
            {learnerVisible ? (
              <>
                <Eye className="size-3" aria-hidden />
                ผู้เรียนเห็นค่านี้
              </>
            ) : (
              <>
                <EyeOff className="size-3" aria-hidden />
                ใช้งานภายในเท่านั้น
              </>
            )}
          </span>
        </div>
        {control}
        {setting.description ? <p className="text-xs text-[var(--ink-muted)]">{setting.description}</p> : null}
        {error ? (
          <p id={errorId} className="text-sm text-[var(--destructive)]">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="ตั้งค่าทั่วไป"
        description="ค่าที่ควบคุมข้อมูลองค์กร ช่องทางติดต่อ พฤติกรรมการลงทะเบียน และความยินยอมทั่วทั้งเว็บไซต์ บันทึกทีละหมวดเพื่อลดความเสี่ยงจากการแก้ไขพร้อมกันหลายจุด"
      />

      <div className="space-y-4">
        {GROUP_ORDER.map((group) => {
          const groupSettings = settings.filter((s) => s.group === group);
          const touched = touchedGroups[group];
          const errorCount = touched ? groupSettings.filter((s) => validateSetting(s)).length : 0;

          return (
            <Panel
              key={group}
              title={SITE_SETTING_GROUP_LABEL[group]}
              description={SITE_SETTING_GROUP_HINT[group]}
              actions={
                <Button size="sm" onClick={() => handleSave(group)}>
                  บันทึก
                </Button>
              }
            >
              <div className="space-y-4">
                <FormErrorSummary count={errorCount} />
                <div className="grid gap-4 sm:grid-cols-2">{groupSettings.map((setting) => renderField(setting, touched))}</div>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}

/** Site identity, contact details, and consent wording feed the learner-facing
 *  site directly — only Super Admin may change them. */
export default function GeneralSettingsPage() {
  const { role } = useStaffSession();

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="ตั้งค่าทั่วไป" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการแก้ไขการตั้งค่าทั่วไป กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  return <GeneralSettingsManager />;
}
