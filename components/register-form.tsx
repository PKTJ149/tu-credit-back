"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useState } from "react";

type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  consent?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: RegisterErrors = {};

    if (!firstName.trim()) nextErrors.firstName = "กรุณากรอกชื่อ";
    if (!lastName.trim()) nextErrors.lastName = "กรุณากรอกนามสกุล";
    if (!phone.trim()) nextErrors.phone = "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง";
    if (!email.trim() || !email.includes("@")) {
      nextErrors.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    }
    if (password.length < 8) {
      nextErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    }
    if (confirmPassword !== password || !confirmPassword) {
      nextErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }
    if (!consent) {
      nextErrors.consent = "กรุณายอมรับเงื่อนไขก่อนดำเนินการต่อ";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    router.push("/register/success");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          label="ชื่อ"
          value={firstName}
          onChange={setFirstName}
          error={errors.firstName}
        />
        <Field
          id="lastName"
          label="นามสกุล"
          value={lastName}
          onChange={setLastName}
          error={errors.lastName}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label="เบอร์โทรศัพท์"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
          placeholder="+66 8X XXX XXXX"
        />
        <Field
          id="email"
          label="อีเมล"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          placeholder="name@example.com"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="password"
          label="รหัสผ่าน"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          helper="ใช้อย่างน้อย 8 ตัวอักษร"
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

      <label className="flex items-start gap-3 rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)] px-4 py-4 text-sm leading-6 text-[var(--ink-muted)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[color:var(--border)] text-[var(--primary)] focus:ring-[color:var(--ring)]"
        />
        <span>
          ฉันยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
          {errors.consent ? (
            <span className="mt-1 block text-[var(--destructive)]">
              {errors.consent}
            </span>
          ) : null}
        </span>
      </label>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="ui-button-primary w-full"
        >
          <UserPlus aria-hidden="true" className="h-4 w-4" />
          {isSubmitting ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
        </button>

        <div className="text-sm text-[var(--ink-muted)]">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/"
            className="font-medium text-[var(--primary)] transition hover:text-[color:color-mix(in_oklch,var(--primary)_84%,black)]"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </form>
  );
}

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

function Field({
  id,
  label,
  value,
  onChange,
  error,
  helper,
  placeholder,
  type = "text",
}: FieldProps) {
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
        onChange={(event) => onChange(event.target.value)}
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
