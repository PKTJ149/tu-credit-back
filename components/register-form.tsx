"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, UserPlus, Users } from "lucide-react";
import { useState } from "react";

type UserType = "student" | "general";

type RegisterErrors = {
  studentId?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  tuEmail?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  consent?: string;
};

const departmentOptions = [
  "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
  "คณะวิทยาศาสตร์และเทคโนโลยี",
  "คณะพาณิชยศาสตร์และการบัญชี",
  "คณะศิลปศาสตร์",
  "คณะสาธารณสุขศาสตร์",
];

export function RegisterForm() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("student");
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [tuEmail, setTuEmail] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchType(type: UserType) {
    setUserType(type);
    setErrors({});
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: RegisterErrors = {};

    if (userType === "student") {
      if (!studentId.trim()) next.studentId = "กรุณากรอกรหัสนักศึกษา";
      if (!department.trim()) next.department = "กรุณาเลือกคณะ / สาขาวิชา";
      if (!tuEmail.trim() || !tuEmail.endsWith("@tu.ac.th"))
        next.tuEmail = "กรุณาใช้อีเมลมหาวิทยาลัย (@tu.ac.th)";
    } else {
      if (!email.trim() || !email.includes("@"))
        next.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    }

    if (!firstName.trim()) next.firstName = "กรุณากรอกชื่อ";
    if (!lastName.trim()) next.lastName = "กรุณากรอกนามสกุล";
    if (!phone.trim()) next.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (password.length < 8) next.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    if (!confirmPassword || confirmPassword !== password)
      next.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!consent) next.consent = "กรุณายอมรับเงื่อนไขก่อนดำเนินการต่อ";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const targetEmail = userType === "student" ? tuEmail : email;
    router.push(`/register/confirm?email=${encodeURIComponent(targetEmail)}&type=${userType}`);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* ── Type selector ── */}
      <div>
        <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
          ประเภทผู้สมัคร
        </p>
        <div className="grid grid-cols-2 gap-3">
          <TypeCard
            active={userType === "student"}
            onClick={() => switchType("student")}
            icon={<GraduationCap className="h-4 w-4" />}
            label="นักศึกษา มธ."
            description="มีรหัสนักศึกษาและอีเมล @tu.ac.th"
          />
          <TypeCard
            active={userType === "general"}
            onClick={() => switchType("general")}
            icon={<Users className="h-4 w-4" />}
            label="บุคคลทั่วไป"
            description="สมัครด้วยอีเมลส่วนตัว"
          />
        </div>
      </div>

      {/* ── TU Student fields ── */}
      {userType === "student" && (
        <div className="space-y-4 rounded-xl border border-[color:color-mix(in_oklch,var(--primary)_28%,var(--border))] bg-[color:color-mix(in_oklch,var(--primary)_5%,white)] px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--primary)]">
            ข้อมูลนักศึกษา มธ.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label="ชื่อ" value={firstName} onChange={setFirstName} error={errors.firstName} />
            <Field id="lastName" label="นามสกุล" value={lastName} onChange={setLastName} error={errors.lastName} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="studentId"
              label="รหัสนักศึกษา"
              value={studentId}
              onChange={setStudentId}
              error={errors.studentId}
              placeholder="เช่น 6900122332"
            />
            <SelectField
              id="department"
              label="คณะ / สาขาวิชา"
              value={department}
              onChange={setDepartment}
              error={errors.department}
              placeholder="เลือกคณะ / สาขาวิชา"
              options={departmentOptions}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="tuEmail"
              label="อีเมลมหาวิทยาลัย"
              type="email"
              value={tuEmail}
              onChange={setTuEmail}
              error={errors.tuEmail}
              placeholder="example@tu.ac.th"
              helper="ต้องเป็น @tu.ac.th เท่านั้น"
            />
            <Field
              id="phone"
              label="เบอร์โทรศัพท์"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              placeholder="08X-XXX-XXXX"
            />
          </div>
        </div>
      )}

      {/* ── General user fields ── */}
      {userType === "general" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label="ชื่อ" value={firstName} onChange={setFirstName} error={errors.firstName} />
            <Field id="lastName" label="นามสกุล" value={lastName} onChange={setLastName} error={errors.lastName} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="email"
              label="อีเมล"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              placeholder="name@example.com"
            />
            <Field
              id="phone"
              label="เบอร์โทรศัพท์"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              placeholder="08X-XXX-XXXX"
            />
          </div>
        </div>
      )}

      {/* ── Password ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="password"
          label="ตั้งรหัสผ่าน"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          helper="อย่างน้อย 8 ตัวอักษร"
        />
        <Field
          id="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
        />
      </div>

      {/* ── Consent ── */}
      <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)] px-4 py-4 text-sm leading-6 text-[var(--ink-muted)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[color:var(--border)] text-[var(--primary)] focus:ring-[color:var(--ring)]"
        />
        <span>
          ฉันยอมรับ{" "}
          <a href="#terms" className="font-medium text-[var(--primary)] underline underline-offset-2">
            เงื่อนไขการใช้งาน
          </a>{" "}
          และ{" "}
          <a href="#privacy" className="font-medium text-[var(--primary)] underline underline-offset-2">
            นโยบายความเป็นส่วนตัว
          </a>{" "}
          ของ Credit Bank มหาวิทยาลัยธรรมศาสตร์
          {errors.consent ? (
            <span className="mt-1 block text-[var(--destructive)]">{errors.consent}</span>
          ) : null}
        </span>
      </label>

      {/* ── Submit ── */}
      <div className="space-y-3">
        <button type="submit" disabled={isSubmitting} className="ui-button-primary w-full">
          <UserPlus aria-hidden="true" className="h-4 w-4" />
          {isSubmitting ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
        </button>

        <p className="text-center text-sm text-[var(--ink-muted)]">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--primary)] transition hover:text-[color:color-mix(in_oklch,var(--primary)_84%,black)]"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </form>
  );
}

// ── TypeCard ──────────────────────────────────────────────────────────────────
type TypeCardProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
};

function TypeCard({ active, onClick, icon, label, description }: TypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
        active
          ? "border-[var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)]"
          : "border-[color:var(--border)] bg-[var(--background)] hover:border-[color:color-mix(in_oklch,var(--primary)_40%,var(--border))]"
      }`}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
          active
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "bg-[var(--surface)] text-[var(--ink-muted)]"
        }`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`text-sm font-semibold ${
            active ? "text-[var(--primary)]" : "text-[var(--foreground)]"
          }`}
        >
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-[var(--ink-muted)]">{description}</p>
      </div>
    </button>
  );
}

// ── SelectField ───────────────────────────────────────────────────────────────
type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  helper?: string;
  placeholder?: string;
};

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  helper,
  placeholder = "เลือกข้อมูล",
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : "false"}
        className="ui-input"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p className="ui-error-text">{error}</p>
      ) : helper ? (
        <p className="ui-helper-text">{helper}</p>
      ) : null}
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  placeholder?: string;
  type?: string;
};

function Field({ id, label, value, onChange, error, helper, placeholder, type = "text" }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : "false"}
        className="ui-input"
      />
      {error ? (
        <p className="ui-error-text">{error}</p>
      ) : helper ? (
        <p className="ui-helper-text">{helper}</p>
      ) : null}
    </div>
  );
}
