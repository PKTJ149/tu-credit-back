import { MemberPageShell } from "@/components/member-page-shell";
import { ChangesRequested } from "@/components/credit-transfer/changes-requested";

export default function TransferChangesRequestedPage() {
  return (
    <MemberPageShell
      title="ต้องแก้ไขข้อมูลเพิ่มเติม"
      description="ตรวจสอบรายละเอียดที่เจ้าหน้าที่ระบุ แล้วส่งคำขอแก้ไขอีกครั้ง"
      currentNav="transfer"
    >
      <ChangesRequested />
    </MemberPageShell>
  );
}
