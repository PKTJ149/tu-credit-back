"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    label: "เส้นทางสู่ความสำเร็จ",
    title: "สะสมหน่วยกิตให้กลายเป็นความสำเร็จที่จับต้องได้",
    description:
      "เริ่มจากรายวิชาที่สนใจ สะสมหน่วยกิตตามเป้าหมาย และต่อยอดสู่หลักสูตรหรือประกาศนียบัตรที่ช่วยยืนยันความสามารถของคุณ",
    image: "/images/banners/home-graduation.png",
    primaryHref: "/programs",
    primaryLabel: "สำรวจหลักสูตร",
    secondaryHref: "/subjects",
    secondaryLabel: "ดูรายวิชาทั้งหมด",
    badgeClass: "bg-white/90 text-[color:var(--primary)]",
  },
  {
    id: 2,
    label: "ทักษะสำหรับงานจริง",
    title: "เรียนรู้ทักษะใหม่ที่เชื่อมกับอุตสาหกรรมและอาชีพ",
    description:
      "เลือกหลักสูตรที่ออกแบบจากความต้องการของตลาดแรงงาน ทั้งสายเทคโนโลยี ข้อมูล ธุรกิจ และทักษะวิชาชีพที่นำไปใช้ได้จริง",
    image: "/images/banners/home-industry.png",
    primaryHref: "/programs/software-development",
    primaryLabel: "ดูหลักสูตรแนะนำ",
    secondaryHref: "/programs",
    secondaryLabel: "เปรียบเทียบหลักสูตร",
    badgeClass: "bg-blue-50 text-blue-700",
  },
  {
    id: 3,
    label: "เรียนรู้ข้ามศาสตร์",
    title: "รวมผลการเรียนรู้จากหลายแหล่งไว้ในระบบเดียว",
    description:
      "ใช้ Credit Bank เพื่อวางแผนการเรียน ติดตามหน่วยกิต และเตรียมหลักฐานสำหรับการเทียบโอนอย่างเป็นระบบ",
    image: "/images/banners/home-research.png",
    primaryHref: "/learning",
    primaryLabel: "วางเป้าหมายการเรียนรู้",
    secondaryHref: "/transfer",
    secondaryLabel: "ดูขั้นตอนเทียบโอน",
    badgeClass: "bg-cyan-50 text-cyan-700",
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
      className="relative overflow-hidden rounded-2xl bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[420px] sm:min-h-[500px]">
        {slides.map((item, index) => (
          <Image
            key={item.id}
            src={item.image}
            alt=""
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 1184px, 100vw"
            className={`object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.58)_36%,rgba(0,0,0,0.18)_68%,rgba(0,0,0,0.08)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(0,0,0,0.45),transparent)]" />

        <div className="relative z-10 flex min-h-[420px] items-center px-8 py-14 sm:min-h-[500px] sm:px-12 lg:px-16">
          <div className="flex max-w-xl flex-col gap-5">
            <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${slide.badgeClass}`}>
              {slide.label}
            </span>
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold leading-tight text-white [text-wrap:balance] sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="max-w-[55ch] text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
                {slide.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={slide.primaryHref} className="ui-button-primary h-11 px-6 text-sm">
                {slide.primaryLabel}
              </Link>
              <Link
                href={slide.secondaryHref}
                className="flex h-11 items-center justify-center rounded-lg border border-white/35 bg-white/12 px-6 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {slide.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        type="button"
        onClick={prev}
        aria-label="สไลด์ก่อนหน้า"
        className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[var(--foreground)] shadow-sm backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="สไลด์ถัดไป"
        className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[var(--foreground)] shadow-sm backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`สไลด์ที่ ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 bg-white opacity-85"
                : "w-1.5 bg-white opacity-35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
