import { PublicPageShell } from "@/components/public-page-shell";
import { ProgramDetail } from "@/components/discovery/program-detail";
import type { Program } from "@/lib/discovery/types";

const mockProgram: Program = {
  id: "p1",
  slug: "software-development",
  name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
  credits: 18,
  level: "ประกาศนียบัตร",
  faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
  summary:
    "เส้นทางการเรียนรู้สำหรับผู้ที่ต้องการทักษะการพัฒนาซอฟต์แวร์อย่างเป็นระบบ ครอบคลุมตั้งแต่พื้นฐานไปจนถึงระดับกลาง",
  description:
    "หลักสูตรออกแบบมาสำหรับผู้ที่ต้องการสร้างทักษะการพัฒนาซอฟต์แวร์จากพื้นฐานถึงระดับกลาง ครอบคลุมการเขียนโปรแกรม โครงสร้างข้อมูล และการพัฒนาแอปพลิเคชันจริง",
  seats: 40,
  enrolledCount: 28,
  teachers: ["ผศ.ดร. สมชาย ใจดี", "อ.ดร. วันดี มีสุข", "อ. ประสิทธิ์ เกิดผล"],
  status: "open",
  type: "ประกาศนียบัตร",
  totalPrice: 9000,
  qualification:
    "เปิดรับทั้งนักศึกษาปัจจุบันและผู้เรียนภายนอกที่มีพื้นฐานการใช้คอมพิวเตอร์เบื้องต้น ไม่จำเป็นต้องมีประสบการณ์การเขียนโปรแกรม",
  careerPaths: ["นักพัฒนาซอฟต์แวร์", "โปรแกรมเมอร์", "นักวิเคราะห์ระบบ", "DevOps Engineer"],
  outcomes: [
    "ทักษะการเขียนโปรแกรมที่นำไปใช้งานได้จริง",
    "ความเข้าใจหลักการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
    "ผลงานที่สามารถนำไปใช้ประกอบพอร์ตโฟลิโอ",
    "ประกาศนียบัตรรับรองจาก TU Credit Bank",
  ],
  subjects: [
    {
      id: "s1",
      slug: "intro-programming",
      name: "การเขียนโปรแกรมเบื้องต้น",
      credits: 3,
      faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
      summary: "พื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น",
      price: 1500,
    },
    {
      id: "s4",
      slug: "data-structures",
      name: "โครงสร้างข้อมูลและอัลกอริทึม",
      credits: 3,
      faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
      summary: "หลักการจัดการข้อมูลและอัลกอริทึมพื้นฐาน",
      price: 1500,
    },
    {
      id: "sw3",
      slug: "web-development",
      name: "การพัฒนาเว็บแอปพลิเคชัน",
      credits: 3,
      faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
      summary: "สร้างเว็บแอปพลิเคชันด้วย React และ Next.js",
      price: 2000,
    },
    {
      id: "sw4",
      slug: "database-design",
      name: "ออกแบบและจัดการฐานข้อมูล",
      credits: 3,
      faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
      summary: "หลักการออกแบบฐานข้อมูลเชิงสัมพันธ์และ NoSQL",
      price: 1500,
    },
    {
      id: "sw5",
      slug: "software-project",
      name: "โครงงานพัฒนาซอฟต์แวร์",
      credits: 6,
      faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
      summary: "พัฒนาโปรเจกต์จริงภายใต้การดูแลของอาจารย์",
      price: 2500,
    },
  ],
};

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  await params;

  return (
    <PublicPageShell>
      <ProgramDetail program={mockProgram} />
    </PublicPageShell>
  );
}
