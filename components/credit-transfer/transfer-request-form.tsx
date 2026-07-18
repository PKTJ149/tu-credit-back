"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Stepper } from "@/components/credit-transfer/stepper";

type RequestErrors = {
  sourceInstitution?: string;
  subjectName?: string;
  requestDetail?: string;
  destinationInstitution?: string;
  destinationType?: string;
};

export function TransferRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const direction = searchParams.get("direction") === "out" ? "out" : "in";

  const [sourceInstitution, setSourceInstitution] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [requestDetail, setRequestDetail] = useState("");
  const [destinationInstitution, setDestinationInstitution] = useState("");
  const [destinationType, setDestinationType] = useState("");
  const [errors, setErrors] = useState<RequestErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: RequestErrors = {};

    if (direction === "in") {
      if (!sourceInstitution.trim()) {
        nextErrors.sourceInstitution = "กรุณากรอกชื่อสถาบันต้นทาง";
      }
      if (!subjectName.trim()) {
        nextErrors.subjectName = "กรุณากรอกชื่อรายวิชาหรือหลักสูตร";
      }
    } else {
      if (!subjectName.trim()) {
        nextErrors.subjectName = "กรุณากรอกรายวิชาที่เสร็จสิ้นแล้วที่ต้องการส่ง";
      }
      if (!destinationInstitution.trim()) {
        nextErrors.destinationInstitution = "กรุณากรอกชื่อสถาบันปลายทาง";
      }
      if (!destinationType.trim()) {
        nextErrors.destinationType = "กรุณาระบุประเภทสถาบันปลายทาง";
      }
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
        <p className="text-sm font-medium text-[var(--primary)]">
          {direction === "in" ? "เทียบโอนเข้า" : "เทียบโอนออก"}
        </p>

        {direction === "in" ? (
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
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="subjectName"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {direction === "in"
              ? "รายวิชาหรือหลักสูตรที่ต้องการเทียบโอน"
              : "รายวิชาที่เสร็จสิ้นแล้วที่ต้องการส่ง"}
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

        {direction === "out" ? (
          <>
            <div className="space-y-2">
              <label
                htmlFor="destinationInstitution"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                สถาบันปลายทาง
              </label>
              <input
                id="destinationInstitution"
                type="text"
                placeholder="เช่น มหาวิทยาลัยเชียงใหม่"
                value={destinationInstitution}
                onChange={(event) => setDestinationInstitution(event.target.value)}
                aria-invalid={errors.destinationInstitution ? "true" : "false"}
                className="ui-input"
              />
              {errors.destinationInstitution ? (
                <p className="ui-error-text">{errors.destinationInstitution}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="destinationType"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                ประเภทสถาบันปลายทาง
              </label>
              <input
                id="destinationType"
                type="text"
                placeholder="เช่น มหาวิทยาลัยของรัฐ"
                value={destinationType}
                onChange={(event) => setDestinationType(event.target.value)}
                aria-invalid={errors.destinationType ? "true" : "false"}
                className="ui-input"
              />
              {errors.destinationType ? (
                <p className="ui-error-text">{errors.destinationType}</p>
              ) : null}
            </div>
          </>
        ) : null}

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
