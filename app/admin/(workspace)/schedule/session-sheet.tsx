"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scheduleStatusLabel } from "@/lib/admin/mock-academic";
import type { ScheduleItem } from "@/lib/discovery/types";
import type { ScheduleSession } from "@/lib/admin/mock-schedule";

export type SessionFormValues = {
  subjectId: string;
  date: string;
  time: string;
  topic: string;
  teacher: string;
  status: ScheduleItem["status"];
  mode: "" | "online" | "onsite";
  studyLink: string;
  venue: string;
  building: string;
  room: string;
};

type SubjectOption = { value: string; label: string };

type SessionSheetProps = {
  open: boolean;
  mode: "add" | "edit";
  session?: ScheduleSession;
  subjectOptions: SubjectOption[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SessionFormValues) => void;
};

function emptyValues(defaultSubjectId: string): SessionFormValues {
  return {
    subjectId: defaultSubjectId,
    date: "",
    time: "",
    topic: "",
    teacher: "",
    status: "upcoming",
    mode: "",
    studyLink: "",
    venue: "",
    building: "",
    room: "",
  };
}

function valuesFromSession(session: ScheduleSession): SessionFormValues {
  return {
    subjectId: session.subjectId,
    date: session.date,
    time: session.time ?? "",
    topic: session.topic,
    teacher: session.teacher,
    status: session.status,
    mode: session.mode ?? "",
    studyLink: session.studyLink ?? "",
    venue: session.location?.venue ?? "",
    building: session.location?.building ?? "",
    room: session.location?.room ?? "",
  };
}

const STATUS_OPTIONS: ScheduleItem["status"][] = ["upcoming", "ongoing", "completed"];

/** Add/edit form for a single schedule session, as a side sheet rather than a
 *  modal dialog — this form covers every `ScheduleItem` field including the
 *  nested location, which is too much to justify a modal takeover for. */
export function SessionSheet({ open, mode, session, subjectOptions, onOpenChange, onSubmit }: SessionSheetProps) {
  const [values, setValues] = useState<SessionFormValues>(() =>
    mode === "edit" && session ? valuesFromSession(session) : emptyValues(subjectOptions[0]?.value ?? ""),
  );
  const [touched, setTouched] = useState(false);

  // Reset the form to fresh values exactly on the closed → open transition,
  // computed during render rather than in an effect (React's documented
  // pattern for adjusting state from props without an extra render pass).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(mode === "edit" && session ? valuesFromSession(session) : emptyValues(subjectOptions[0]?.value ?? ""));
      setTouched(false);
    }
  }

  const errors = {
    subject: mode === "add" && !values.subjectId ? "กรุณาเลือกรายวิชา" : undefined,
    date: values.date.trim() === "" ? "กรุณาระบุวันที่" : undefined,
    topic: values.topic.trim() === "" ? "กรุณาระบุหัวข้อ" : undefined,
    teacher: values.teacher.trim() === "" ? "กรุณาระบุผู้สอน" : undefined,
    studyLink: values.mode === "online" && values.studyLink.trim() === "" ? "กรุณาระบุลิงก์เรียนสำหรับคาบออนไลน์" : undefined,
    location:
      values.mode === "onsite" && (values.venue.trim() === "" || values.building.trim() === "" || values.room.trim() === "")
        ? "กรุณาระบุสถานที่ อาคาร และห้องให้ครบ สำหรับคาบเรียนในสถานที่"
        : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;
    onSubmit(values);
  }

  const subjectLabel =
    mode === "edit" && session
      ? session.subjectCode
        ? `${session.subjectName} (${session.subjectCode})`
        : session.subjectName
      : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "เพิ่มคาบเรียน" : "แก้ไขคาบเรียน"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "กำหนดรายละเอียดคาบเรียนใหม่ให้กับรายวิชาที่เลือก"
              : "แก้ไขรายละเอียดคาบเรียนนี้ การเปลี่ยนแปลงจะมีผลทันทีที่บันทึก"}
          </SheetDescription>
        </SheetHeader>

        <form id="session-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          {mode === "add" ? (
            <div className="space-y-1.5">
              <Label htmlFor="session-subject">
                รายวิชา<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Select value={values.subjectId} onValueChange={(v) => setValues((s) => ({ ...s, subjectId: v }))}>
                <SelectTrigger id="session-subject" className="w-full" aria-invalid={touched && Boolean(errors.subject)}>
                  <SelectValue placeholder="เลือกรายวิชา" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched && errors.subject ? <p className="text-sm text-[var(--destructive)]">{errors.subject}</p> : null}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label>รายวิชา</Label>
              <p className="text-sm font-medium">{subjectLabel}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="session-date">
                วันที่<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="session-date"
                value={values.date}
                onChange={(e) => setValues((s) => ({ ...s, date: e.target.value }))}
                placeholder="เช่น 15 ส.ค. 2569"
                aria-invalid={touched && Boolean(errors.date)}
                aria-describedby={touched && errors.date ? "session-date-error" : undefined}
              />
              {touched && errors.date ? (
                <p id="session-date-error" className="text-sm text-[var(--destructive)]">
                  {errors.date}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="session-time">เวลา</Label>
              <Input
                id="session-time"
                value={values.time}
                onChange={(e) => setValues((s) => ({ ...s, time: e.target.value }))}
                placeholder="เช่น 09:00 - 12:00"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="session-topic">
              หัวข้อ<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="session-topic"
              value={values.topic}
              onChange={(e) => setValues((s) => ({ ...s, topic: e.target.value }))}
              aria-invalid={touched && Boolean(errors.topic)}
              aria-describedby={touched && errors.topic ? "session-topic-error" : undefined}
            />
            {touched && errors.topic ? (
              <p id="session-topic-error" className="text-sm text-[var(--destructive)]">
                {errors.topic}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="session-teacher">
              ผู้สอน<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="session-teacher"
              value={values.teacher}
              onChange={(e) => setValues((s) => ({ ...s, teacher: e.target.value }))}
              aria-invalid={touched && Boolean(errors.teacher)}
              aria-describedby={touched && errors.teacher ? "session-teacher-error" : undefined}
            />
            {touched && errors.teacher ? (
              <p id="session-teacher-error" className="text-sm text-[var(--destructive)]">
                {errors.teacher}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="session-status">สถานะ</Label>
            <Select
              value={values.status}
              onValueChange={(v) => setValues((s) => ({ ...s, status: v as ScheduleItem["status"] }))}
            >
              <SelectTrigger id="session-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {scheduleStatusLabel[opt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="session-mode">รูปแบบ</Label>
            <Select
              value={values.mode || "unset"}
              onValueChange={(v) => setValues((s) => ({ ...s, mode: v === "unset" ? "" : (v as "online" | "onsite") }))}
            >
              <SelectTrigger id="session-mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">ไม่ระบุ</SelectItem>
                <SelectItem value="online">ออนไลน์</SelectItem>
                <SelectItem value="onsite">ในสถานที่</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {values.mode === "online" ? (
            <div className="space-y-1.5">
              <Label htmlFor="session-link">
                ลิงก์เรียน<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="session-link"
                type="url"
                value={values.studyLink}
                onChange={(e) => setValues((s) => ({ ...s, studyLink: e.target.value }))}
                placeholder="https://classroom.tucreditbank.ac.th/..."
                aria-invalid={touched && Boolean(errors.studyLink)}
                aria-describedby={touched && errors.studyLink ? "session-link-error" : undefined}
              />
              {touched && errors.studyLink ? (
                <p id="session-link-error" className="text-sm text-[var(--destructive)]">
                  {errors.studyLink}
                </p>
              ) : null}
            </div>
          ) : null}

          {values.mode === "onsite" ? (
            <div className="space-y-3 rounded-lg border border-[var(--border)] p-3">
              <div className="space-y-1.5">
                <Label htmlFor="session-venue">
                  สถานที่<span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id="session-venue"
                  value={values.venue}
                  onChange={(e) => setValues((s) => ({ ...s, venue: e.target.value }))}
                  placeholder="เช่น มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="session-building">อาคาร</Label>
                  <Input
                    id="session-building"
                    value={values.building}
                    onChange={(e) => setValues((s) => ({ ...s, building: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="session-room">ห้อง</Label>
                  <Input
                    id="session-room"
                    value={values.room}
                    onChange={(e) => setValues((s) => ({ ...s, room: e.target.value }))}
                  />
                </div>
              </div>
              {touched && errors.location ? <p className="text-sm text-[var(--destructive)]">{errors.location}</p> : null}
            </div>
          ) : null}
        </form>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--border)]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button type="submit" form="session-form">
            {mode === "add" ? "เพิ่มคาบเรียน" : "บันทึกการแก้ไข"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
