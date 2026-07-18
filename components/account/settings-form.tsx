"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

type ToggleSetting = {
  id: string;
  label: string;
  description: string;
};

const notificationSettings: ToggleSetting[] = [
  {
    id: "notify-payment",
    label: "แจ้งเตือนสถานะการชำระเงิน",
    description: "รับอีเมลเมื่อสถานะการชำระเงินของคุณเปลี่ยนแปลง",
  },
  {
    id: "notify-registration",
    label: "แจ้งเตือนสถานะการลงทะเบียน",
    description: "รับอีเมลเมื่อการลงทะเบียนของคุณได้รับการยืนยัน",
  },
  {
    id: "notify-transfer",
    label: "แจ้งเตือนสถานะการเทียบโอนหน่วยกิต",
    description: "รับอีเมลเมื่อคำขอเทียบโอนของคุณมีความคืบหน้า",
  },
];

const privacySettings: ToggleSetting[] = [
  {
    id: "privacy-directory",
    label: "แสดงชื่อในทำเนียบผู้เรียน",
    description: "อนุญาตให้ผู้เรียนคนอื่นเห็นชื่อคุณในทำเนียบสาธารณะของ Credit Bank",
  },
];

export function SettingsForm() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "notify-payment": true,
    "notify-registration": true,
    "notify-transfer": true,
    "privacy-directory": false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
    setIsSuccess(false);
  }

  async function handleSave() {
    setIsSuccess(false);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });
    setIsSuccess(true);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">การแจ้งเตือน</h2>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          เลือกการแจ้งเตือนที่คุณต้องการรับทางอีเมล
        </p>

        <div className="mt-5 space-y-4">
          {notificationSettings.map((setting) => (
            <ToggleRow
              key={setting.id}
              setting={setting}
              checked={enabled[setting.id]}
              onToggle={() => toggle(setting.id)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">ความเป็นส่วนตัว</h2>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          จัดการการมองเห็นข้อมูลของคุณในระบบ
        </p>

        <div className="mt-5 space-y-4">
          {privacySettings.map((setting) => (
            <ToggleRow
              key={setting.id}
              setting={setting}
              checked={enabled[setting.id]}
              onToggle={() => toggle(setting.id)}
            />
          ))}
        </div>
      </section>

      {isSuccess ? (
        <div className="flex items-center gap-3 rounded-lg border border-[color:color-mix(in_oklch,var(--primary)_22%,white)] bg-[color:color-mix(in_oklch,var(--secondary)_28%,white)] px-4 py-3 text-sm text-[var(--foreground)]">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
          <span>บันทึกการตั้งค่าแล้ว</span>
        </div>
      ) : null}

      <button type="button" onClick={handleSave} className="ui-button-primary w-full sm:w-auto sm:min-w-44">
        บันทึกการตั้งค่า
      </button>
    </div>
  );
}

type ToggleRowProps = {
  setting: ToggleSetting;
  checked: boolean;
  onToggle: () => void;
};

function ToggleRow({ setting, checked, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-4 last:border-b-0 last:pb-0">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">{setting.label}</p>
        <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{setting.description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={setting.label}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
          checked ? "bg-[var(--primary)]" : "bg-[color:color-mix(in_oklch,var(--muted)_70%,white)]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
