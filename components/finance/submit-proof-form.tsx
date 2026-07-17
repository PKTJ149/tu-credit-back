"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { FileUploadField } from "@/components/finance/file-upload-field";

type ProofErrors = {
  proofFile?: string;
  amountPaid?: string;
  paymentDate?: string;
};

const checklistItems = [
  "สลิปโอนเงินหรือหลักฐานการชำระที่ชัดเจน",
  "รองรับไฟล์ภาพ (JPG, PNG) หรือ PDF ขนาดไม่เกิน 10MB",
  "ตรวจสอบยอดเงินและวันที่ให้ตรงกับการโอนจริง",
];

export function SubmitProofForm() {
  const router = useRouter();
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentTime, setPaymentTime] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<ProofErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ProofErrors = {};

    if (!proofFile) {
      nextErrors.proofFile = "กรุณาแนบหลักฐานการชำระเงิน";
    }

    if (!amountPaid.trim()) {
      nextErrors.amountPaid = "กรุณากรอกจำนวนเงินที่ชำระ";
    }

    if (!paymentDate.trim()) {
      nextErrors.paymentDate = "กรุณาเลือกวันที่ชำระเงิน";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsSaving(false);

    router.push("/finance/proof-submitted");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="space-y-5 rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_16%,white)] p-5">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            สิ่งที่ต้องเตรียม
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
          id="proofFile"
          label="หลักฐานการชำระเงิน"
          hint="รองรับไฟล์ภาพ (JPG, PNG) หรือ PDF ขนาดไม่เกิน 10MB"
          error={errors.proofFile}
          fileName={proofFile?.name}
          onFileSelected={setProofFile}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="amountPaid"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              จำนวนเงินที่ชำระ (บาท)
            </label>
            <input
              id="amountPaid"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(event) => setAmountPaid(event.target.value)}
              aria-invalid={errors.amountPaid ? "true" : "false"}
              className="ui-input"
            />
            {errors.amountPaid ? (
              <p className="ui-error-text">{errors.amountPaid}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="paymentDate"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              วันที่ชำระเงิน
            </label>
            <input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
              aria-invalid={errors.paymentDate ? "true" : "false"}
              className="ui-input"
            />
            {errors.paymentDate ? (
              <p className="ui-error-text">{errors.paymentDate}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="paymentTime"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              เวลาที่ชำระเงิน (ถ้ามี)
            </label>
            <input
              id="paymentTime"
              type="time"
              value={paymentTime}
              onChange={(event) => setPaymentTime(event.target.value)}
              className="ui-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="note"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            หมายเหตุเพิ่มเติม (ถ้ามี)
          </label>
          <textarea
            id="note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="ui-input h-auto py-2"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSaving}
            className="ui-button-primary w-full sm:w-auto sm:min-w-44"
          >
            {isSaving ? "กำลังส่งหลักฐาน..." : "ส่งหลักฐาน"}
          </button>

          <Link href="/finance" className="ui-button-secondary">
            กลับไปหน้าการเงิน
          </Link>
        </div>
      </form>
    </div>
  );
}
