"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

type ProfileErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  faculty?: string;
  educationLevel?: string;
  studentId?: string;
};

export function ProfileForm() {
  const [fullName, setFullName] = useState("นักศึกษา ทดสอบระบบ");
  const [email, setEmail] = useState("student@example.ac.th");
  const [phone, setPhone] = useState("081-234-5678");
  const [studentId, setStudentId] = useState("TU-6612345");
  const [faculty, setFaculty] = useState("คณะวิทยาการเรียนรู้และศึกษาศาสตร์");
  const [educationLevel, setEducationLevel] = useState("ปริญญาตรี");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ProfileErrors = {};

    if (!fullName.trim()) nextErrors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!email.trim() || !email.includes("@")) {
      nextErrors.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    }
    if (!phone.trim()) nextErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!studentId.trim()) nextErrors.studentId = "กรุณากรอกรหัสนักศึกษาหรือรหัสผู้เรียน";
    if (!faculty.trim()) nextErrors.faculty = "กรุณากรอกคณะหรือหน่วยงาน";
    if (!educationLevel.trim()) nextErrors.educationLevel = "กรุณาเลือกระดับการศึกษา";

    setErrors(nextErrors);
    setIsSuccess(false);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsSaving(false);
    setIsSuccess(true);
  }

  return (
    <form
      className="min-w-0 space-y-5 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <section className="space-y-5 border-b border-[color:var(--border)] pb-6">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            ข้อมูลส่วนตัว
          </h2>
          <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
            ข้อมูลนี้ใช้ยืนยันตัวตนของคุณในการลงทะเบียนและติดต่อกลับ
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="fullName"
            label="ชื่อ-นามสกุล"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
          />
          <TextField
            id="studentId"
            label="รหัสนักศึกษาหรือรหัสผู้เรียน"
            value={studentId}
            onChange={setStudentId}
            error={errors.studentId}
          />
          <TextField
            id="email"
            label="อีเมล"
            value={email}
            onChange={setEmail}
            error={errors.email}
            type="email"
          />
          <TextField
            id="phone"
            label="เบอร์โทรศัพท์"
            value={phone}
            onChange={setPhone}
            error={errors.phone}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            ข้อมูลการศึกษา
          </h2>
          <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
            ใช้จับคู่กับคณะ เงื่อนไข และตัวเลือกการลงทะเบียนที่ถูกต้อง
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="faculty"
            label="คณะหรือหน่วยงาน"
            value={faculty}
            onChange={setFaculty}
            error={errors.faculty}
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

      {isSuccess ? (
        <div className="flex items-center gap-3 rounded-lg border border-[color:color-mix(in_oklch,var(--primary)_22%,white)] bg-[color:color-mix(in_oklch,var(--secondary)_28%,white)] px-4 py-3 text-sm text-[var(--foreground)]">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
          <span>บันทึกข้อมูลโปรไฟล์แล้ว</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="ui-button-primary w-full sm:w-auto sm:min-w-44"
      >
        {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
      </button>
    </form>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
};

function TextField({ id, label, value, onChange, error, type = "text" }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? "true" : "false"}
        className="ui-input"
      />
      {error ? <p className="ui-error-text">{error}</p> : null}
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

function SelectField({ id, label, value, onChange, options, error }: SelectFieldProps) {
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
        className="ui-input"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="ui-error-text">{error}</p> : null}
    </div>
  );
}
