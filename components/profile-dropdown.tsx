"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, KeyRound, Settings, LogOut, ChevronDown } from "lucide-react";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_50%,white)] text-xs font-semibold text-[var(--secondary-foreground)]">
          นศ
        </div>
        <span className="hidden sm:block">โปรไฟล์ของฉัน</span>
        <ChevronDown
          aria-hidden="true"
          className={`hidden h-4 w-4 text-[var(--ink-subtle)] transition-transform duration-150 sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-[color:var(--border)] bg-[var(--background)] py-1.5 shadow-lg">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] focus:outline-none"
          >
            <User aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]" />
            โปรไฟล์ของฉัน
          </Link>
          <Link
            href="/profile/change-password"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] focus:outline-none"
          >
            <KeyRound aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]" />
            เปลี่ยนรหัสผ่าน
          </Link>
          <Link
            href="/profile/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] focus:outline-none"
          >
            <Settings aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]" />
            ตั้งค่า
          </Link>
          <hr className="my-1.5 border-[color:var(--border)]" />
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--destructive)] hover:bg-[color:color-mix(in_oklch,var(--destructive)_6%,white)] focus:outline-none"
          >
            <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
            ออกจากระบบ
          </Link>
        </div>
      )}
    </div>
  );
}
