import Link from "next/link";
import { ProgramCard } from "@/components/discovery/program-card";
import { SubjectCard } from "@/components/discovery/subject-card";
import type { Program, Subject } from "@/lib/discovery/types";

const featuredPrograms: Program[] = [
  {
    id: "p1",
    slug: "software-development",
    name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    credits: 18,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "เส้นทางการเรียนรู้สำหรับผู้ที่ต้องการทักษะการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
  },
  {
    id: "p2",
    slug: "data-analytics",
    name: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "เรียนรู้การวิเคราะห์และนำเสนอข้อมูลเพื่อการตัดสินใจ",
  },
  {
    id: "p3",
    slug: "digital-marketing",
    name: "หลักสูตรประกาศนียบัตรการตลาดดิจิทัล",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ปูพื้นฐานการตลาดยุคดิจิทัลสำหรับผู้ประกอบการและนักการตลาด",
  },
];

const featuredSubjects: Subject[] = [
  {
    id: "s1",
    slug: "intro-programming",
    name: "การเขียนโปรแกรมเบื้องต้น",
    credits: 3,
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "พื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น",
  },
  {
    id: "s2",
    slug: "intro-statistics",
    name: "สถิติเบื้องต้นสำหรับนักวิจัย",
    credits: 3,
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "หลักการทางสถิติที่ใช้ในการวิจัยเบื้องต้น",
  },
  {
    id: "s3",
    slug: "digital-marketing-principles",
    name: "หลักการตลาดดิจิทัล",
    credits: 3,
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "แนวคิดและเครื่องมือการตลาดดิจิทัลเบื้องต้น",
  },
];

const trustStatements = [
  "ดำเนินการโดยมหาวิทยาลัยธรรมศาสตร์ สถาบันการศึกษาที่ได้รับการรับรองมาตรฐาน",
  "หลักสูตรและรายวิชาทุกรายการผ่านการตรวจสอบและอนุมัติตามเกณฑ์ของมหาวิทยาลัย",
  "ระบบเทียบโอนหน่วยกิตดำเนินการโดยเจ้าหน้าที่วิชาการที่มีความเชี่ยวชาญ",
];

export function Home() {
  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      <section className="flex flex-col gap-6">
        <h1 className="max-w-3xl text-3xl font-semibold text-[var(--foreground)] [text-wrap:balance] sm:text-4xl lg:text-5xl">
          สะสมและเทียบโอนหน่วยกิตกับ Credit Bank มหาวิทยาลัยธรรมศาสตร์
        </h1>
        <p className="max-w-[70ch] text-base leading-7 text-[var(--ink-muted)] sm:text-lg sm:leading-8">
          Credit Bank ช่วยให้คุณเรียนรู้อย่างยืดหยุ่น สะสมหน่วยกิตจากหลักสูตรและรายวิชาที่หลากหลาย
          และเทียบโอนผลการเรียนได้อย่างเป็นระบบ ไม่ว่าคุณจะเป็นนักศึกษาปัจจุบันหรือผู้เรียนภายนอก
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/programs" className="ui-button-primary h-11 px-6 text-sm">
            เริ่มสำรวจหลักสูตร
          </Link>
          <Link href="/subjects" className="ui-button-secondary h-11 px-6 text-sm">
            ดูรายวิชาทั้งหมด
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-[color:var(--border)] pt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          ระบบที่เชื่อถือได้จากมหาวิทยาลัยธรรมศาสตร์
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {trustStatements.map((statement) => (
            <p
              key={statement}
              className="max-w-[65ch] text-sm leading-6 text-[var(--ink-muted)]"
            >
              {statement}
            </p>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">หลักสูตรแนะนำ</h2>
          <p className="mt-1 text-sm text-[var(--ink-subtle)]">
            เริ่มต้นเส้นทางการเรียนรู้ที่เป็นระบบ
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">รายวิชาแนะนำ</h2>
          <p className="mt-1 text-sm text-[var(--ink-subtle)]">
            เลือกเรียนเป็นรายวิชาตามความสนใจของคุณ
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>
    </div>
  );
}
