import Link from "next/link";
import { ProgramCard } from "@/components/discovery/program-card";
import type { Program } from "@/lib/discovery/types";

const relatedProgram: Program = {
  id: "p1",
  slug: "software-development",
  name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
  credits: 18,
  level: "ประกาศนียบัตร",
  summary: "เส้นทางการเรียนรู้สำหรับผู้ที่ต้องการทักษะการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
};

export function SubjectDetail() {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          การเขียนโปรแกรมเบื้องต้น
        </h1>
        <p className="text-base leading-7 text-[var(--ink-muted)]">
          รายวิชานี้ปูพื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น ครอบคลุมตรรกะพื้นฐาน
          โครงสร้างควบคุม และการแก้ปัญหาด้วยโปรแกรมคอมพิวเตอร์
        </p>
        <p className="font-mono text-sm font-medium text-[var(--ink-subtle)]">
          3 หน่วยกิต
        </p>
      </header>

      <section
        aria-labelledby="eligibility-heading"
        className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5"
      >
        <h2
          id="eligibility-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          คุณสมบัติผู้เรียน
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
          ไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรมมาก่อน เหมาะสำหรับผู้เริ่มต้นทุกระดับ
        </p>
      </section>

      <section aria-labelledby="related-program-heading" className="flex flex-col gap-4">
        <h2
          id="related-program-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          ส่วนหนึ่งของหลักสูตร
        </h2>
        <ProgramCard program={relatedProgram} />
      </section>

      <section
        aria-labelledby="subject-cta-heading"
        className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--surface)] p-5"
      >
        <h2
          id="subject-cta-heading"
          className="text-base font-medium text-[var(--foreground)]"
        >
          เริ่มต้นใช้งานเพื่อดำเนินการลงทะเบียน
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className="ui-button-primary">
            สมัครสมาชิก
          </Link>
          <Link href="/login" className="ui-button-secondary">
            เข้าสู่ระบบ
          </Link>
        </div>
      </section>
    </article>
  );
}
