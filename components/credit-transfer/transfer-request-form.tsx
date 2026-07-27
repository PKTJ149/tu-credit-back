"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { FileUploadField } from "@/components/finance/file-upload-field";

type RequestErrors = {
  sourceInstitution?: string;
  subjectName?: string;
  destinationInstitution?: string;
  destinationType?: string;
  evidenceFile?: string;
};

const sourceInstitutionOptions = [
  "มหาวิทยาลัยเกษตรศาสตร์",
  "มหาวิทยาลัยเชียงใหม่",
  "มหาวิทยาลัยขอนแก่น",
  "มหาวิทยาลัยสงขลานครินทร์",
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
];

const incomingSubjectOptions = [
  "แคลคูลัส 1",
  "ฟิสิกส์ทั่วไป",
  "เคมีทั่วไป",
  "สถิติเบื้องต้นสำหรับนักวิจัย",
  "หลักการตลาดดิจิทัล",
  "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
];

const completedSubjectOptions = [
  "การเขียนโปรแกรมเบื้องต้น",
  "โครงสร้างข้อมูลและอัลกอริทึม",
  "หลักการตลาดดิจิทัล",
  "อบรมเชิงปฏิบัติการการพูดในที่สาธารณะ",
];

type TransferRequestFormProps = {
  basePath?: string;
};

export function TransferRequestForm({ basePath = "/transfer" }: TransferRequestFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const direction = searchParams.get("direction") === "out" ? "out" : "in";

  const [sourceInstitution, setSourceInstitution] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [requestDetail, setRequestDetail] = useState("");
  const [destinationInstitution, setDestinationInstitution] = useState("");
  const [destinationType, setDestinationType] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<RequestErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: RequestErrors = {};

    if (direction === "in") {
      if (!sourceInstitution.trim()) {
        nextErrors.sourceInstitution = "กรุณาเลือกสถาบันต้นทาง";
      }
      if (!subjectName.trim()) {
        nextErrors.subjectName = "กรุณาเลือกรายวิชาหรือหลักสูตร";
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

    if (!evidenceFile) {
      nextErrors.evidenceFile = "กรุณาแนบไฟล์เอกสารหลักฐาน";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    router.push(`${basePath}/review`);
  }

  return (
    <div>
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
            <select
              id="sourceInstitution"
              value={sourceInstitution}
              onChange={(event) => setSourceInstitution(event.target.value)}
              aria-invalid={errors.sourceInstitution ? "true" : "false"}
              className="ui-input"
            >
              <option value="">เลือกสถาบันต้นทาง</option>
              {sourceInstitutionOptions.map((institution) => (
                <option key={institution} value={institution}>
                  {institution}
                </option>
              ))}
            </select>
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
          <select
            id="subjectName"
            value={subjectName}
            onChange={(event) => setSubjectName(event.target.value)}
            aria-invalid={errors.subjectName ? "true" : "false"}
            className="ui-input"
          >
            <option value="">
              {direction === "in"
                ? "เลือกรายวิชาหรือหลักสูตร"
                : "เลือกรายวิชาที่เสร็จสิ้นแล้ว"}
            </option>
            {(direction === "in" ? incomingSubjectOptions : completedSubjectOptions).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
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
            รายละเอียดคำขอเพิ่มเติม
            <span className="ml-1 font-normal text-[var(--ink-muted)]">(ไม่บังคับ)</span>
          </label>
          <textarea
            id="requestDetail"
            rows={5}
            value={requestDetail}
            onChange={(event) => setRequestDetail(event.target.value)}
            className="ui-input h-auto py-2"
          />
        </div>

        <FileUploadField
          id="transferEvidenceFile"
          label="เอกสารหรือไฟล์หลักฐาน"
          hint="รองรับไฟล์ภาพ (JPG, PNG) หรือ PDF ขนาดไม่เกิน 10MB"
          error={errors.evidenceFile}
          fileName={evidenceFile?.name}
          emptyText="แตะเพื่อแนบเอกสารหลักฐาน"
          onFileSelected={setEvidenceFile}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link href={basePath} className="ui-button-secondary">
            ย้อนกลับ
          </Link>

          <button
            type="submit"
            className="ui-button-primary w-full sm:w-auto sm:min-w-56"
          >
            ส่งคำร้องขอเทียบโอน
          </button>
        </div>
      </form>
    </div>
  );
}
