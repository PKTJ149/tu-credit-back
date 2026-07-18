"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { FileUploadField } from "@/components/finance/file-upload-field";
import { Stepper } from "@/components/credit-transfer/stepper";

type EvidenceErrors = {
  evidenceFile?: string;
};

const checklistItems = [
  "ใบแสดงผลการเรียน (Transcript) จากสถาบันต้นทาง",
  "เอกสารคำอธิบายรายวิชา (Course Syllabus) หากมี",
  "รองรับไฟล์ภาพ (JPG, PNG) หรือ PDF ขนาดไม่เกิน 10MB",
];

export function EvidenceStep() {
  const router = useRouter();
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<EvidenceErrors>({});
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: EvidenceErrors = {};

    if (!evidenceFile) {
      nextErrors.evidenceFile = "กรุณาแนบไฟล์หลักฐานประกอบอย่างน้อยหนึ่งไฟล์";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsChecking(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsChecking(false);

    router.push("/transfer/review");
  }

  return (
    <div>
      <Stepper currentStepIndex={2} />

      <div className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="space-y-5 rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_16%,white)] p-5">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              หลักฐานที่ต้องเตรียม
            </h2>
          </div>

          <ul className="space-y-4">
            {checklistItems.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
                />
                <p className="text-sm leading-6 text-[var(--ink-muted)]">{item}</p>
              </li>
            ))}
          </ul>
        </aside>

        <form className="min-w-0 space-y-5" onSubmit={handleSubmit} noValidate>
          <FileUploadField
            id="evidenceFile"
            label="ไฟล์หลักฐานประกอบ"
            hint="รองรับไฟล์ภาพ (JPG, PNG) หรือ PDF ขนาดไม่เกิน 10MB"
            error={errors.evidenceFile}
            fileName={evidenceFile?.name}
            onFileSelected={setEvidenceFile}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isChecking}
              className="ui-button-primary w-full sm:w-auto sm:min-w-44"
            >
              {isChecking ? "กำลังตรวจสอบไฟล์..." : "ดำเนินการต่อไปยังการตรวจทาน"}
            </button>

            <Link href="/transfer/request" className="ui-button-secondary">
              ย้อนกลับ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
