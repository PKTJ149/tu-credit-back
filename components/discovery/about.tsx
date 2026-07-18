import Link from "next/link";

export function About() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        เกี่ยวกับ Credit Bank
      </h1>

      <p
        className="mt-6 text-base leading-relaxed text-[var(--ink-muted)]"
        style={{ textWrap: "pretty" }}
      >
        Credit Bank เป็นระบบสะสมและเทียบโอนหน่วยกิตของมหาวิทยาลัยธรรมศาสตร์
        พัฒนาขึ้นเพื่อรองรับการเรียนรู้ตลอดชีวิตที่ยืดหยุ่นและเข้าถึงได้ง่ายขึ้น
        สำหรับทั้งนักศึกษาปัจจุบันและผู้เรียนภายนอก
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          เหตุผลที่ระบบนี้มีอยู่
        </h2>
        <p
          className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]"
          style={{ textWrap: "pretty" }}
        >
          การเรียนรู้ในปัจจุบันไม่จำเป็นต้องเกิดขึ้นในรูปแบบเดียวอีกต่อไป
          Credit Bank ถูกสร้างขึ้นเพื่อให้ผู้เรียนสามารถสะสมความรู้จากหลายแหล่ง
          และเทียบโอนหน่วยกิตระหว่างสถาบันได้อย่างเป็นระบบ โปร่งใส และตรวจสอบได้
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          การกำกับดูแลและมาตรฐาน
        </h2>
        <p
          className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]"
          style={{ textWrap: "pretty" }}
        >
          หลักสูตร รายวิชา และกระบวนการเทียบโอนหน่วยกิตทั้งหมดดำเนินการภายใต้การกำกับดูแลของมหาวิทยาลัยธรรมศาสตร์
          และเป็นไปตามเกณฑ์มาตรฐานทางวิชาการที่มหาวิทยาลัยกำหนด
        </p>
      </section>

      <div className="mt-10">
        <Link href="/programs" className="ui-button-primary h-11 px-6 text-sm">
          สำรวจหลักสูตรและรายวิชา
        </Link>
      </div>
    </div>
  );
}
