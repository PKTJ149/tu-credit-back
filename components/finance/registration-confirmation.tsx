"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, CircleAlert, X } from "lucide-react";
import { formatTHB } from "@/lib/finance/payment-state";
import { useSessionData } from "@/lib/session/session-data";
import { programs } from "@/lib/data/programs";
import { getSubjectsByIds, subjects } from "@/lib/data/subjects";

export function RegistrationConfirmation() {
  const router = useRouter();
  const { data, cancelRegistration, updateRegistrationSelection } = useSessionData();
  // The most recently registered item is the one we just confirmed.
  const latest = data.registrations[0];
  const program = latest?.itemType === "program"
    ? programs.find((item) => item.slug === latest.slug)
    : undefined;
  const programSubjects = useMemo(
    () => (program ? getSubjectsByIds(program.subjectIds) : []),
    [program],
  );
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    latest?.selectedSubjectIds ??
      (program ? programSubjects.map((subject) => subject.id) : []),
  );

  // Safety net: someone opened this page without registering anything.
  if (!latest) {
    return (
      <div className="mx-auto max-w-2xl">
        <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6 text-center sm:p-8">
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            ยังไม่มีรายการลงทะเบียนล่าสุด
          </p>
          <Link href="/member/programs" className="ui-button-primary mt-6">
            เลือกหลักสูตรเพื่อลงทะเบียน
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </div>
    );
  }

  const canSelectSubjects = latest.itemType === "program" && programSubjects.length > 0;
  const registeredSubjects = program
    ? programSubjects.filter((subject) => selectedSubjectIds.includes(subject.id))
    : subjects.filter((subject) => subject.slug === latest.slug);
  const totalCredits = registeredSubjects.reduce(
    (total, subject) => total + subject.credits,
    0,
  );
  const subjectTotal = registeredSubjects.reduce(
    (total, subject) => total + (subject.price ?? 0),
    0,
  );
  const paymentRequired = subjectTotal > 0;
  const canConfirm = registeredSubjects.length > 0;
  const cancelHref = latest.itemType === "program"
    ? `/member/programs/${latest.slug}`
    : `/member/subjects/${latest.slug}`;

  function handleConfirmRegistration() {
    if (!canConfirm) return;
    updateRegistrationSelection(latest.id, {
      amount: subjectTotal,
      selectedSubjectIds: program ? selectedSubjectIds : undefined,
    });
    router.push(paymentRequired ? "/profile/finance" : "/registrations");
  }

  function handleCancelRegistration() {
    cancelRegistration(latest.id);
    router.push(cancelHref);
  }

  function toggleSubject(subjectId: string) {
    setSelectedSubjectIds((current) =>
      current.includes(subjectId)
        ? current.filter((id) => id !== subjectId)
        : [...current, subjectId],
    );
  }

  function selectAllSubjects() {
    setSelectedSubjectIds(programSubjects.map((subject) => subject.id));
  }

  function clearSelectedSubjects() {
    setSelectedSubjectIds([]);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] text-[var(--primary)]">
            <BookOpen aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold leading-9 text-[var(--foreground)]">
              ตรวจสอบรายการลงทะเบียนเรียน
            </h1>
            <p className="text-sm leading-7 text-[var(--ink-muted)]">
              ตรวจสอบรายวิชา หน่วยกิต และค่าใช้จ่ายก่อนยืนยันการลงทะเบียนเรียน
              หลังจากยืนยันแล้ว ระบบจะพาคุณไปยังหน้าชำระเงิน
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {latest.itemType === "program" ? "หลักสูตร" : "รายวิชา"}: {latest.itemName}
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">{latest.term}</p>
              {canSelectSubjects ? (
                <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">
                  เลือกรายวิชาที่ต้องการลงทะเบียนในหลักสูตรนี้ก่อนยืนยัน
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm sm:min-w-56">
              <div className="rounded-lg bg-[var(--background)] px-3 py-2">
                <p className="text-xs text-[var(--ink-subtle)]">รายวิชา</p>
                <p className="mt-0.5 font-semibold text-[var(--foreground)]">
                  {registeredSubjects.length} รายวิชา
                </p>
              </div>
              <div className="rounded-lg bg-[var(--background)] px-3 py-2">
                <p className="text-xs text-[var(--ink-subtle)]">หน่วยกิตรวม</p>
                <p className="mt-0.5 font-semibold text-[var(--foreground)]">
                  {totalCredits || "-"} หน่วยกิต
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-[color:var(--border)]">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 bg-[var(--surface)] px-4 py-3 text-xs font-semibold text-[var(--ink-muted)]">
            <span>{canSelectSubjects ? "เลือกรายวิชา" : "รายวิชา"}</span>
            <span className="text-right">หน่วยกิต</span>
            <span className="text-right">ราคา</span>
          </div>
          <ul className="divide-y divide-[color:var(--border)]">
            {(canSelectSubjects ? programSubjects : registeredSubjects).map((subject) => {
              const selected = selectedSubjectIds.includes(subject.id);
              return (
              <li
                key={subject.id}
                className={`grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-4 py-3 text-sm transition ${
                  canSelectSubjects && !selected ? "bg-[var(--surface)] text-[var(--ink-muted)]" : ""
                }`}
              >
                <label className="flex min-w-0 items-start gap-3">
                  {canSelectSubjects ? (
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSubject(subject.id)}
                      className="mt-1 h-4 w-4 rounded border-[color:var(--border)] accent-[var(--primary)]"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block font-medium text-[var(--foreground)]">
                      {subject.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--ink-muted)]">
                      {subject.code} · {subject.category}
                    </span>
                  </span>
                </label>
                <p className="whitespace-nowrap text-right font-medium text-[var(--foreground)]">
                  {subject.credits} หน่วยกิต
                </p>
                <p className="whitespace-nowrap text-right font-semibold text-[var(--foreground)]">
                  {formatTHB(subject.price ?? 0)}
                </p>
              </li>
              );
            })}
          </ul>
          {canSelectSubjects ? (
            <div className="flex flex-col gap-3 border-t border-[color:var(--border)] bg-[var(--background)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[var(--ink-muted)]">
                เลือกแล้ว {registeredSubjects.length} จาก {programSubjects.length} รายวิชา
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllSubjects}
                  className="rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                >
                  เลือกทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={clearSelectedSubjects}
                  className="rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                >
                  ล้างการเลือก
                </button>
              </div>
            </div>
          ) : null}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-[color:var(--border)] bg-[var(--surface)] px-4 py-4 text-sm">
            <span className="font-semibold text-[var(--foreground)]">
              รวมค่าใช้จ่ายรายวิชา
            </span>
            <span className="text-right font-semibold text-[var(--foreground)]">
              {formatTHB(subjectTotal)}
            </span>
            <span className="font-semibold text-[var(--foreground)]">
              ยอดที่ต้องชำระ
            </span>
            <span className="text-right text-lg font-bold text-[var(--primary)]">
              {formatTHB(subjectTotal)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-[color:color-mix(in_oklch,var(--primary)_28%,white)] bg-[color:color-mix(in_oklch,var(--primary)_6%,white)] p-4">
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
          />
          <p className="text-sm leading-7 text-[var(--foreground)]">
            {canConfirm
              ? "กรุณายืนยันการลงทะเบียนเรียนก่อนดำเนินการชำระเงิน หากยกเลิก รายการนี้จะถูกนำออกจากรายการลงทะเบียนเรียนและยอดชำระของคุณ"
              : "กรุณาเลือกรายวิชาอย่างน้อย 1 รายวิชาก่อนยืนยันการลงทะเบียนเรียน"}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCancelRegistration}
            className="ui-button-secondary w-full sm:w-auto sm:flex-1"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleConfirmRegistration}
            disabled={!canConfirm}
            className="ui-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-1"
          >
            ยืนยันการลงทะเบียน
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
