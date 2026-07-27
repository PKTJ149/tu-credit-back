import { ChangesRequested } from "@/components/credit-transfer/changes-requested";

export default function ProfileTransferChangesRequestedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">ต้องแก้ไขข้อมูลเพิ่มเติม</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ตรวจสอบรายละเอียดที่เจ้าหน้าที่ระบุ แล้วส่งคำขอแก้ไขอีกครั้ง
        </p>
      </div>
      <ChangesRequested basePath="/profile/transfer" />
    </div>
  );
}
