import { PublicPageShell } from "@/components/public-page-shell";
import { SubjectDetail } from "@/components/discovery/subject-detail";
import type { Subject } from "@/lib/discovery/types";

const mockSubject: Subject = {
  id: "s1",
  slug: "intro-programming",
  name: "การเขียนโปรแกรมเบื้องต้น",
  nameEn: "Introduction to Programming",
  code: "CS201",
  category: "หมวดวิชาแกน",
  credits: 3,
  faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
  summary:
    "พื้นฐานการเขียนโปรแกรมด้วยภาษา Python สำหรับผู้เริ่มต้น ครอบคลุมตรรกะพื้นฐาน โครงสร้างควบคุม และการแก้ปัญหาด้วยโปรแกรมคอมพิวเตอร์",
  description:
    "รายวิชานี้ออกแบบมาสำหรับผู้ที่ไม่มีพื้นฐานการเขียนโปรแกรมมาก่อน เรียนรู้การเขียนโปรแกรมด้วยภาษา Python ตั้งแต่ระดับพื้นฐาน ฝึกคิดเชิงตรรกะ และแก้ปัญหาด้วยโปรแกรม พร้อมโปรเจกต์จริงปิดรายวิชา",
  price: 1500,
  status: "open",
  seats: 30,
  enrolledCount: 12,
  studyMode: "hybrid",
  startDate: "1 สิงหาคม 2568",
  endDate: "31 ตุลาคม 2568",
  duration: "3 เดือน",
  teachers: ["ผศ.ดร. สมชาย ใจดี", "อ.ดร. วันดี มีสุข"],
  outcomes: [
    "เขียนโปรแกรม Python เบื้องต้นได้อย่างมั่นใจ",
    "เข้าใจหลักการคิดเชิงตรรกะและการแก้ปัญหาด้วยอัลกอริทึม",
    "สร้างโปรเจกต์ขนาดเล็กด้วยตนเองได้ตั้งแต่ต้นจนจบ",
    "มีพื้นฐานสำหรับการเรียนรู้รายวิชาการเขียนโปรแกรมขั้นสูงต่อไป",
  ],
  qualification:
    "ไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรมมาก่อน เหมาะสำหรับนักศึกษาและผู้เรียนภายนอกทุกระดับที่มีพื้นฐานการใช้คอมพิวเตอร์เบื้องต้น",
  scheduleItems: [
    {
      date: "5 ส.ค. 2568",
      topic: "แนะนำหลักสูตรและ Python พื้นฐาน",
      teacher: "ผศ.ดร. สมชาย ใจดี",
      status: "completed",
    },
    {
      date: "12 ส.ค. 2568",
      topic: "ตัวแปรและประเภทข้อมูล",
      teacher: "ผศ.ดร. สมชาย ใจดี",
      status: "completed",
    },
    {
      date: "19 ส.ค. 2568",
      topic: "โครงสร้างควบคุม (if/loop)",
      teacher: "อ.ดร. วันดี มีสุข",
      status: "ongoing",
    },
    {
      date: "26 ส.ค. 2568",
      topic: "ฟังก์ชันและโมดูล",
      teacher: "อ.ดร. วันดี มีสุข",
      status: "upcoming",
    },
    {
      date: "2 ก.ย. 2568",
      topic: "โปรเจกต์จบรายวิชา",
      teacher: "ผศ.ดร. สมชาย ใจดี",
      status: "upcoming",
    },
  ],
};

type SubjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  await params;

  return (
    <PublicPageShell showBreadcrumb={false}>
      <SubjectDetail subject={mockSubject} />
    </PublicPageShell>
  );
}
