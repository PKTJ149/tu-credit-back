"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { useMemo, useState } from "react";

type ProfileErrors = {
  studentType?: string;
  faculty?: string;
  educationLevel?: string;
  studentId?: string;
  previousInstitution?: string;
};

const requirementItems = [
  {
    title: "ข้อมูลส่วนตัว",
    detail: "ใช้ยืนยันตัวตนของผู้เรียนในการลงทะเบียนและบันทึกการชำระเงิน",
  },
  {
    title: "ข้อมูลการศึกษา",
    detail: "ใช้จับคู่กับหลักสูตร นโยบาย และเงื่อนไขหน่วยกิตที่เกี่ยวข้อง",
  },
  {
    title: "ประวัติการศึกษา",
    detail: "จำเป็นสำหรับการเทียบโอน การลงทะเบียน และคำขอสำคัญในขั้นตอนถัดไป",
  },
];

export function ProfileCompletionForm() {
  const router = useRouter();
  const [studentType, setStudentType] = useState("");
  const [faculty, setFaculty] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [studentId, setStudentId] = useState("");
  const [previousInstitution, setPreviousInstitution] = useState("");
  const allowContinueLater = true;
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const completedCount = useMemo(() => {
    return [
      studentType,
      faculty,
      educationLevel,
      studentId,
      previousInstitution,
    ].filter((value) => value.trim().length > 0).length;
  }, [educationLevel, faculty, previousInstitution, studentId, studentType]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ProfileErrors = {};

    if (!studentType.trim()) {
      nextErrors.studentType = "กรุณาเลือกประเภทผู้เรียน";
    }

    if (!faculty.trim()) {
      nextErrors.faculty = "กรุณากรอกคณะหรือหน่วยงาน";
    }

    if (!educationLevel.trim()) {
      nextErrors.educationLevel = "กรุณาเลือกระดับการศึกษา";
    }

    if (!studentId.trim()) {
      nextErrors.studentId = "กรุณากรอกรหัสนักศึกษาหรือรหัสผู้เรียน";
    }

    if (!previousInstitution.trim()) {
      nextErrors.previousInstitution =
        "กรุณากรอกสถาบันหรือแหล่งเรียนรู้เดิม";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    setIsSuccess(false);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsSaving(false);
    setIsSuccess(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });

    router.push("/ready");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="space-y-5 rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_16%,white)] p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <CircleAlert aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
            ข้อมูลที่ยังต้องกรอก
          </div>
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            เมื่อกรอกโปรไฟล์ครบแล้ว คุณจะสามารถลงทะเบียนและใช้งานส่วนที่ต้องยืนยันตัวตนได้
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--foreground)]">
              ความคืบหน้าโปรไฟล์
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {completedCount}/5
            </span>
          </div>
          <div className="h-2 rounded-full bg-[color:color-mix(in_oklch,var(--background)_80%,white)]">
            <div
              className="h-2 rounded-full bg-[var(--primary)] transition-[width]"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>

        <ul className="space-y-4">
          {requirementItems.map((item) => (
            <li key={item.title} className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <form className="min-w-0 space-y-5" onSubmit={handleSubmit} noValidate>
        <section className="space-y-5 border-b border-[color:var(--border)] pb-6">
          <div className="max-w-2xl">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              ข้อมูลส่วนตัว
            </h3>
            <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
              กรอกข้อมูลยืนยันตัวตนขั้นต่ำก่อนใช้งานด้านการเรียนที่ต้องยืนยันบัญชี
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id="studentType"
              label="ประเภทผู้เรียน"
              value={studentType}
              onChange={setStudentType}
              error={errors.studentType}
              options={["นักศึกษาปัจจุบัน", "ผู้เรียนภายนอก", "ศิษย์เก่า"]}
            />
            <TextField
              id="studentId"
              label="รหัสนักศึกษาหรือรหัสผู้เรียน"
              value={studentId}
              onChange={setStudentId}
              error={errors.studentId}
              placeholder="TU-XXXXXXX"
            />
          </div>
        </section>

        <section className="space-y-5 border-b border-[color:var(--border)] pb-6">
          <div className="max-w-2xl">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              ข้อมูลการศึกษา
            </h3>
            <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
              ข้อมูลนี้ช่วยให้ระบบจับคู่กับคณะ เงื่อนไข และตัวเลือกการลงทะเบียนที่ถูกต้อง
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="faculty"
              label="คณะหรือหน่วยงาน"
              value={faculty}
              onChange={setFaculty}
              error={errors.faculty}
              placeholder="เช่น คณะวิทยาการเรียนรู้และศึกษาศาสตร์"
            />
            <SelectField
              id="educationLevel"
              label="ระดับการศึกษา"
              value={educationLevel}
              onChange={setEducationLevel}
              error={errors.educationLevel}
              options={["ปริญญาตรี", "บัณฑิตศึกษา", "การศึกษาต่อเนื่อง"]}
            />
          </div>
        </section>

        <section className="space-y-5 border-b border-[color:var(--border)] pb-6">
          <div className="max-w-2xl">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              ประวัติการศึกษา
            </h3>
            <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
              กรอกสถาบันหรือแหล่งเรียนรู้เดิม หากมีผลต่อการลงทะเบียน การชำระเงิน หรือการเทียบโอน
            </p>
          </div>

          <TextField
            id="previousInstitution"
            label="สถาบันหรือแหล่งเรียนรู้เดิม"
            value={previousInstitution}
            onChange={setPreviousInstitution}
            error={errors.previousInstitution}
            placeholder="เช่น มหาวิทยาลัยธรรมศาสตร์ สถาบันคู่ความร่วมมือ หรือหลักสูตรเดิม"
          />
        </section>

        {isSuccess ? (
          <div className="flex items-center gap-3 rounded-lg border border-[color:color-mix(in_oklch,var(--primary)_22%,white)] bg-[color:color-mix(in_oklch,var(--secondary)_28%,white)] px-4 py-3 text-sm text-[var(--foreground)]">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
            <span>บันทึกข้อมูลโปรไฟล์แล้ว</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSaving}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[color:color-mix(in_oklch,var(--primary)_88%,black)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกและไปต่อ"}
          </button>

          {allowContinueLater ? (
            <Link
              href="/ready"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[var(--card)] px-5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
            >
              ทำต่อภายหลัง
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? "true" : "false"}
        className="h-11 w-full rounded-lg border border-[color:var(--input)] bg-white px-3 text-sm text-[var(--foreground)] outline-none focus:border-[color:var(--ring)] focus:ring-4 focus:ring-[var(--focus-ring)]"
      />
      {error ? (
        <p className="text-sm text-[var(--destructive)]">{error}</p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
};

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? "true" : "false"}
        className="h-11 w-full rounded-lg border border-[color:var(--input)] bg-white px-3 text-sm text-[var(--foreground)] outline-none focus:border-[color:var(--ring)] focus:ring-4 focus:ring-[var(--focus-ring)]"
      >
        <option value="">เลือกตัวเลือก</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-[var(--destructive)]">{error}</p>
      ) : null}
    </div>
  );
}
