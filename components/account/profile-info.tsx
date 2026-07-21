"use client";

import { useState } from "react";
import {
  Pencil,
  BookOpen,
  Book,
  CheckSquare,
  Award,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

type ProfileErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  faculty?: string;
  educationLevel?: string;
  studentId?: string;
  branch?: string;
};

const profileStats = [
  { icon: BookOpen, value: "2", label: "หลักสูตร" },
  { icon: Book, value: "43", label: "รายวิชา" },
  { icon: CheckSquare, value: "163", label: "หน่วยกิต" },
  { icon: Award, value: "4", label: "ประกาศนียบัตร" },
  { icon: GraduationCap, value: "–", label: "ปริญญา" },
];

const educationHistory = [
  {
    status: "กำลังศึกษา",
    period: "ปัจจุบัน",
    program: "คณะวิทยาศาสตร์และเทคโนโลยี (ออกแบบสิ่งทอ)",
    institution: "มหาวิทยาลัยธรรมศาสตร์",
    active: true,
  },
  {
    status: "สำเร็จการศึกษา",
    period: "ปีที่สำเร็จการศึกษา 2567",
    program: "ศิลปศาสตรบัณฑิต (รัฐประศาสนศาสตร์)",
    institution: "จุฬาลงกรณ์มหาวิทยาลัย",
    active: false,
  },
];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-[var(--ink-subtle)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--foreground)]">{value}</dd>
    </div>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ui-input mt-1 w-full"
      />
      {error && <p className="ui-error-text mt-1">{error}</p>}
    </div>
  );
}

export function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("นักศึกษา ทดสอบระบบ");
  const [email, setEmail] = useState("student@example.ac.th");
  const [phone, setPhone] = useState("081-234-5678");
  const [studentId, setStudentId] = useState("TU-6612345");
  const [faculty, setFaculty] = useState("คณะวิทยาศาสตร์และเทคโนโลยี");
  const [branch, setBranch] = useState("ออกแบบสิ่งทอ");
  const [educationLevel, setEducationLevel] = useState("ปริญญาตรี");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function clearError(field: keyof ProfileErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSave() {
    const next: ProfileErrors = {};
    if (!fullName.trim()) next.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!email.trim() || !email.includes("@")) next.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    if (!phone.trim()) next.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!studentId.trim()) next.studentId = "กรุณากรอกรหัสนักศึกษา";
    if (!faculty.trim()) next.faculty = "กรุณากรอกคณะหรือหน่วยงาน";
    if (!educationLevel.trim()) next.educationLevel = "กรุณาเลือกระดับการศึกษา";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSaving(true);
    await new Promise((r) => window.setTimeout(r, 900));
    setIsSaving(false);
    setIsEditing(false);
    setIsSuccess(true);
    window.setTimeout(() => setIsSuccess(false), 3000);
  }

  function handleCancel() {
    setErrors({});
    setIsEditing(false);
  }

  /* ─── VIEW MODE ─── */
  if (!isEditing) {
    return (
      <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
        {/* Success toast */}
        {isSuccess && (
          <div className="flex items-center gap-2 border-b border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] px-5 py-3 text-sm font-medium text-[var(--primary)] sm:px-6">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            บันทึกข้อมูลเรียบร้อยแล้ว
          </div>
        )}

        {/* Profile header */}
        <div className="px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
          {/* Avatar + greeting + edit button — one row */}
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_50%,white)] text-xl font-semibold text-[var(--secondary-foreground)]">
              นศ
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                สวัสดี, {fullName}
              </h2>
              <p className="mt-0.5 text-sm text-[var(--ink-subtle)]">{studentId}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
            >
              <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
              แก้ไขข้อมูล
            </button>
          </div>

          {/* Stats row — only vertical dividers, no top/bottom border */}
          <div className="grid grid-cols-5 divide-x divide-[color:var(--border)]">
            {profileStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-center gap-2 px-1 py-3 sm:px-2"
                >
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--primary)]"
                  />
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {stat.value}
                  </span>
                  <span className="hidden text-sm text-[var(--ink-muted)] sm:block">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ข้อมูลส่วนตัว */}
        <div className="border-t border-[color:var(--border)] px-5 py-5 sm:px-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
            ข้อมูลส่วนตัว
          </h3>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Field label="ชื่อ-นามสกุล" value={fullName} />
            <Field label="รหัสนักศึกษาหรือรหัสผู้เรียน" value={studentId} />
            <Field label="อีเมล" value={email} />
            <Field label="เบอร์โทรศัพท์" value={phone} />
          </dl>
        </div>

        {/* ข้อมูลการศึกษา */}
        <div className="border-t border-[color:var(--border)] px-5 py-5 sm:px-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
            ข้อมูลการศึกษา
          </h3>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Field label="คณะหรือหน่วยงาน" value={faculty} />
            <Field label="สาขาวิชา" value={branch} />
            <Field label="ระดับการศึกษา" value={educationLevel} />
          </dl>
        </div>

        {/* ประวัติการศึกษา */}
        <div className="border-t border-[color:var(--border)] px-5 py-5 sm:px-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
            ประวัติการศึกษา
          </h3>
          <ul className="space-y-5">
            {educationHistory.map((entry, i) => (
              <li key={i} className="flex gap-6">
                <div className="w-40 shrink-0">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                      entry.active
                        ? "bg-[color:color-mix(in_oklch,var(--primary)_10%,white)] text-[var(--primary)]"
                        : "bg-[var(--surface)] text-[var(--ink-muted)]"
                    }`}
                  >
                    {entry.status}
                  </span>
                  <p className="mt-1.5 text-xs text-[var(--ink-subtle)]">{entry.period}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{entry.program}</p>
                  <p className="mt-0.5 text-sm text-[var(--ink-muted)]">{entry.institution}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  /* ─── EDIT MODE ─── */
  return (
    <div className="space-y-4">
      {/* Personal info form */}
      <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[var(--foreground)]">ข้อมูลส่วนตัว</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            ข้อมูลนี้ใช้ยืนยันตัวตนของคุณในการลงทะเบียนและติดต่อกลับ
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="fullName"
            label="ชื่อ-นามสกุล"
            value={fullName}
            onChange={(v) => { setFullName(v); clearError("fullName"); }}
            error={errors.fullName}
          />
          <FormField
            id="studentId"
            label="รหัสนักศึกษาหรือรหัสผู้เรียน"
            value={studentId}
            onChange={(v) => { setStudentId(v); clearError("studentId"); }}
            error={errors.studentId}
          />
          <FormField
            id="email"
            label="อีเมล"
            value={email}
            onChange={(v) => { setEmail(v); clearError("email"); }}
            error={errors.email}
            type="email"
          />
          <FormField
            id="phone"
            label="เบอร์โทรศัพท์"
            value={phone}
            onChange={(v) => { setPhone(v); clearError("phone"); }}
            error={errors.phone}
            type="tel"
          />
        </div>
      </div>

      {/* Education info form */}
      <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[var(--foreground)]">ข้อมูลการศึกษา</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            ใช้บ่งชี้คณะ เงื่อนไข และตัวเลือกการลงทะเบียนที่ถูกต้อง
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="faculty"
            label="คณะหรือหน่วยงาน"
            value={faculty}
            onChange={(v) => { setFaculty(v); clearError("faculty"); }}
            error={errors.faculty}
          />
          <FormField
            id="branch"
            label="สาขาวิชา"
            value={branch}
            onChange={(v) => { setBranch(v); clearError("branch"); }}
            error={errors.branch}
          />
          <div>
            <label
              htmlFor="educationLevel"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              ระดับการศึกษา
            </label>
            <select
              id="educationLevel"
              value={educationLevel}
              onChange={(e) => {
                setEducationLevel(e.target.value);
                clearError("educationLevel");
              }}
              className="ui-input mt-1 w-full"
            >
              <option value="">เลือกระดับการศึกษา</option>
              <option>ประกาศนียบัตร</option>
              <option>อนุปริญญา</option>
              <option>ปริญญาตรี</option>
              <option>ปริญญาโท</option>
              <option>ปริญญาเอก</option>
            </select>
            {errors.educationLevel && (
              <p className="ui-error-text mt-1">{errors.educationLevel}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ui-button-primary px-5 py-2.5 text-sm"
        >
          {isSaving ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}
        </button>
        <button
          onClick={handleCancel}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--ink-muted)] transition hover:text-[var(--foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
