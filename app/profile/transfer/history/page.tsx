import { StatusHistory } from "@/components/credit-transfer/status-history";
import type { TransferRequest } from "@/lib/credit-transfer/transfer-state";

const mockRequests: TransferRequest[] = [
  {
    id: "t1",
    type: "in",
    title: "เทียบโอนรายวิชาแคลคูลัส 1 จากมหาวิทยาลัยเกษตรศาสตร์",
    submittedDate: "10 ก.ค. 2569",
    state: "under-review",
  },
  {
    id: "t2",
    type: "out",
    title: "ส่งผลการเรียนไปยังมหาวิทยาลัยเชียงใหม่",
    submittedDate: "2 มิ.ย. 2569",
    state: "approved",
  },
  {
    id: "t3",
    type: "in",
    title: "เทียบโอนรายวิชาฟิสิกส์ทั่วไปจากมหาวิทยาลัยขอนแก่น",
    submittedDate: "20 พ.ค. 2569",
    state: "changes-requested",
  },
  {
    id: "t4",
    type: "in",
    title: "เทียบโอนรายวิชาเคมีทั่วไปจากมหาวิทยาลัยสงขลานครินทร์",
    submittedDate: "1 เม.ย. 2569",
    state: "rejected",
  },
  {
    id: "t5",
    type: "out",
    title: "ส่งผลการเรียนไปยังสถาบันเทคโนโลยีพระจอมเกล้า",
    submittedDate: "15 มี.ค. 2569",
    state: "withdrawn",
  },
];

export default function ProfileTransferHistoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">สถานะและประวัติคำขอ</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ติดตามคำขอเทียบโอนทั้งหมดของคุณและดูรายละเอียดเพิ่มเติมได้ที่นี่
        </p>
      </div>
      <StatusHistory requests={mockRequests} basePath="/profile/transfer" />
    </div>
  );
}
