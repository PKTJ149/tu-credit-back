"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Stepper } from "@/components/credit-transfer/stepper";

type RequestErrors = {
  sourceInstitution?: string;
  subjectName?: string;
  requestDetail?: string;
};

export function TransferRequestForm() {
  const router = useRouter();
  const [sourceInstitution, setSourceInstitution] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [requestDetail, setRequestDetail] = useState("");
  const [errors, setErrors] = useState<RequestErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: RequestErrors = {};

    if (!sourceInstitution.trim()) {
      nextErrors.sourceInstitution = "กรุณากรอกชื่อสถาบันต้นทาง";
    }

    if (!subjectName.trim()) {
      nextErrors.subjectName = "กรุณากรอกชื่อรายวิชาหรือหลักสูตร";
    }

    if (!requestDetail.trim()) {
      nextErrors.requestDetail = "กรุณากรอกรายละเอียดคำขอ";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    router.push("/transfer/evidence");
  }

  return (
    <div>
      <Stepper currentStepIndex={1} />

      <form
        className="min-w-0 space-y-5 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="space-y-2">
          <label
            htmlFor="sourceInstitution"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            สถาบันต้นทาง
          </label>
          <input
            id="sourceInstitution"
            type="text"
            placeholder="เช่น มหาวิทยาลัยเกษตรศาสตร์"
            value={sourceInstitution}
            onChange={(event) => setSourceInstitution(event.target.value)}
            aria-invalid={errors.sourceInstitution ? "true" : "false"}
            className="ui-input"
          />
          {errors.sourceInstitution ? (
            <p className="ui-error-text">{errors.sourceInstitution}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="subjectName"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            รายวิชาหรือหลักสูตรที่ต้องการเทียบโอน
          </label>
          <input
            id="subjectName"
            type="text"
            placeholder="เช่น แคลคูลัส 1"
            value={subjectName}
            onChange={(event) => setSubjectName(event.target.value)}
            aria-invalid={errors.subjectName ? "true" : "false"}
            className="ui-input"
          />
          {errors.subjectName ? (
            <p className="ui-error-text">{errors.subjectName}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="requestDetail"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            รายละเอียดคำขอ
          </label>
          <textarea
            id="requestDetail"
            rows={5}
            value={requestDetail}
            onChange={(event) => setRequestDetail(event.target.value)}
            aria-invalid={errors.requestDetail ? "true" : "false"}
            className="ui-input h-auto py-2"
          />
          {errors.requestDetail ? (
            <p className="ui-error-text">{errors.requestDetail}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="ui-button-primary w-full sm:w-auto sm:min-w-56"
          >
            ดำเนินการต่อไปยังหลักฐาน
          </button>

          <Link href="/transfer/type" className="ui-button-secondary">
            ย้อนกลับ
          </Link>
        </div>
      </form>
    </div>
  );
}
