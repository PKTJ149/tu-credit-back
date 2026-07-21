"use client";

import { useEffect, useState } from "react";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    label: "หลักสูตรใหม่",
    title: "พัฒนาซอฟต์แวร์ยุคใหม่",
    subtitle: "ประกาศนียบัตร · 18 หน่วยกิต · 6 เดือน",
    colorFrom: "color-mix(in oklch, var(--secondary) 20%, white)",
    colorTo: "color-mix(in oklch, var(--secondary) 8%, white)",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    label: "แนะนำ",
    title: "วิเคราะห์ข้อมูลเพื่อธุรกิจ",
    subtitle: "ประกาศนียบัตร · 15 หน่วยกิต · 5 เดือน",
    colorFrom: "color-mix(in oklch, var(--primary) 12%, white)",
    colorTo: "color-mix(in oklch, var(--primary) 4%, white)",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    id: 3,
    label: "กำลังเปิดรับ",
    title: "ภาษาอังกฤษในยุคดิจิทัล",
    subtitle: "อบรมระยะสั้น · 3 หน่วยกิต · 4 สัปดาห์",
    colorFrom: "color-mix(in oklch, oklch(0.65 0.15 162) 18%, white)",
    colorTo: "color-mix(in oklch, oklch(0.65 0.15 162) 6%, white)",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
];

export function HomeBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ background: `linear-gradient(135deg, ${slide.colorFrom}, ${slide.colorTo})` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex min-h-[220px] items-center px-8 py-10 sm:min-h-[260px] sm:px-12">
        {/* Content */}
        <div className="flex flex-1 flex-col gap-3">
          <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${slide.badgeColor}`}>
            {slide.label}
          </span>
          <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl [text-wrap:balance]">
            {slide.title}
          </h2>
          <p className="text-sm text-[var(--ink-muted)]">{slide.subtitle}</p>
        </div>

        {/* Decorative icon */}
        <div className="hidden shrink-0 items-center justify-center sm:flex">
          <GraduationCap
            aria-hidden="true"
            className="h-24 w-24 text-[var(--secondary-foreground)] opacity-[0.08]"
          />
        </div>
      </div>

      {/* Prev / Next */}
      <button
        type="button"
        onClick={prev}
        aria-label="สไลด์ก่อนหน้า"
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm transition hover:bg-white/90"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="สไลด์ถัดไป"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm transition hover:bg-white/90"
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`สไลด์ที่ ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 bg-[var(--foreground)] opacity-60"
                : "w-1.5 bg-[var(--foreground)] opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
