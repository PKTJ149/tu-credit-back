import { MyRegistrations } from "@/components/learning/my-registrations";

export default function RegistrationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">การลงทะเบียน</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ตรวจสอบการลงทะเบียนที่กำลังดำเนินการและล่าสุดของคุณ
        </p>
      </div>
      <MyRegistrations registrations={[]} />
    </div>
  );
}
