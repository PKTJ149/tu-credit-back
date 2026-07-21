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
    "เส้นทางการเรียนรู้สำหรับผู้ที่ต้องการทักษะการพัฒนาซอฟต์แวร์จากพื้นฐานจนถึงระดับกลาง",
  description:
    "หลักสูตรออกแบบมาสำหรับผู้ที่ต้องการสร้างทักษะการพัฒนาซอฟต์แวร์อย่างเป็นระบบ ครอบคลุมการเขียนโปรแกรม โครงสร้างข้อมูล และการพัฒนาแอปพลิเคชันจริง พร้อมโปรเจกต์จบหลักสูตร",
  seats: 40,
  enrolledCount: 28,
  teachers: ["ผศ.ดร. สมชาย ใจดี", "อ.ดร. วันดี มีสุข", "อ. ประสิทธิ์ เกิดผล"],
  status: "open",
  type: "ประกาศนียบัตร",
  totalPrice: 9000,
  originalPrice: 12000,
  duration: "6 เดือน",
  qualification:
    "เปิดรับทั้งนักศึกษาปัจจุบันและผู้เรียนภายนอกที่มีพื้นฐานการใช้คอมพิวเตอร์เบื้องต้น ไม่จำเป็นต้องมีประสบการณ์การเขียนโปรแกรม",
  careerPaths: ["นักพัฒนาซอฟต์แวร์", "โปรแกรมเมอร์", "นักวิเคราะห์ระบบ", "DevOps Engineer"],
  outcomes: [
    "ทักษะการเขียนโปรแกรมที่นำไปใช้งานได้จริง",
    "ความเข้าใจหลักการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
    "ผลงานที่สามารถนำไปใช้ประกอบพอร์ตโฟลิโอ",
    "ประกาศนียบัตรรับรองจาก TU Credit Bank",
  ],
  subjectCategories: [
    {
      id: "cat1",
      name: "หมวดวิชาศึกษาทั่วไป",
      nameEn: "General Education",
      subjects: [
        {
          id: "g1",
          slug: "english-communication",
          name: "ภาษาอังกฤษเพื่อการสื่อสารในยุคดิจิทัล",
          nameEn: "English Communication in the Digital Age",
          code: "TU101",
          credits: 3,
          faculty: "คณะศิลปศาสตร์",
          summary: "ทักษะภาษาอังกฤษสำหรับการทำงานและการสื่อสารในสภาพแวดล้อมดิจิทัล",
          price: 1500,
        },
        {
          id: "g2",
          slug: "digital-literacy",
          name: "ทักษะดิจิทัลสำหรับโลกการทำงาน",
          nameEn: "Digital Literacy for the Workplace",
          code: "TU102",
          credits: 3,
          faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
          summary: "ความรู้พื้นฐานด้านเทคโนโลยีดิจิทัลและทักษะที่จำเป็นในการทำงานยุคใหม่",
          price: 1500,
        },
      ],
    },
    {
      id: "cat2",
      name: "หมวดวิชาแกน",
      nameEn: "Core Subjects",
      subjects: [
        {
          id: "c1",
          slug: "intro-programming",
          name: "การเขียนโปรแกรมเบื้องต้น",
          nameEn: "Introduction to Programming",
          code: "CS201",
          credits: 3,
          faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
          summary: "พื้นฐานการเขียนโปรแกรมด้วยภาษา Python สำหรับผู้เริ่มต้น",
          price: 1500,
        },
        {
          id: "c2",
          slug: "data-structures",
          name: "โครงสร้างข้อมูลและอัลกอริทึม",
          nameEn: "Data Structures and Algorithms",
          code: "CS202",
          credits: 3,
          faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
          summary: "หลักการจัดการข้อมูลและการออกแบบอัลกอริทึมที่มีประสิทธิภาพ",
          price: 1500,
        },
        {
          id: "c3",
          slug: "web-development",
          name: "การพัฒนาเว็บแอปพลิเคชัน",
          nameEn: "Web Application Development",
          code: "CS203",
          credits: 3,
          faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
          summary: "สร้างเว็บแอปพลิเคชันด้วย React และ Next.js พร้อม RESTful API",
          price: 2000,
        },
        {
          id: "c4",
          slug: "database-design",
          name: "ออกแบบและจัดการฐานข้อมูล",
          nameEn: "Database Design and Management",
          code: "CS204",
          credits: 3,
          faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
          summary: "หลักการออกแบบฐานข้อมูลเชิงสัมพันธ์และ NoSQL สำหรับแอปพลิเคชันจริง",
          price: 1500,
        },
      ],
    },
    {
      id: "cat3",
      name: "หมวดวิชาเลือก",
      nameEn: "Elective Subjects",
      subjects: [
        {
          id: "e1",
          slug: "software-project",
          name: "โครงงานพัฒนาซอฟต์แวร์",
          nameEn: "Software Development Project",
          code: "CS301",
          credits: 6,
          faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
          summary: "พัฒนาซอฟต์แวร์จริงภายใต้การดูแลของอาจารย์ พร้อมนำเสนอผลงาน",
          price: 500,
        },
      ],
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
