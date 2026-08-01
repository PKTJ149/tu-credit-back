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
import { staffRoleInfo } from "@/lib/admin/types";
import type { StaffRole, StaffUser } from "@/lib/admin/types";
import type { Teacher } from "@/lib/discovery/types";

export type StaffFormValues = {
  name: string;
  email: string;
  role: StaffRole;
  department: string;
  teacherId?: string;
};

type StaffSheetProps = {
  open: boolean;
  mode: "add" | "edit";
  staff?: StaffUser;
  /** Teachers not already linked to another staff account (plus this
   *  account's own current link, when editing). Assigning the same teacher
   *  record to two logins would make "who sees this subject" ambiguous. */
  availableTeachers: Teacher[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StaffFormValues) => void;
};

const ROLE_OPTIONS: StaffRole[] = ["super-admin", "officer", "teacher"];

function emptyValues(): StaffFormValues {
  return { name: "", email: "", role: "officer", department: "", teacherId: undefined };
}

function valuesFromStaff(staff: StaffUser): StaffFormValues {
  return {
    name: staff.name,
    email: staff.email,
    role: staff.role,
    department: staff.department,
    teacherId: staff.teacherId,
  };
}

/** Create or edit a staff account. Role is only ever set here on creation —
 *  changing an existing account's role is a consequential action that goes
 *  through a `ConfirmDialog` on the table row instead, so it always states
 *  what access is gained or lost. */
export function StaffSheet({ open, mode, staff, availableTeachers, onOpenChange, onSubmit }: StaffSheetProps) {
  const [values, setValues] = useState<StaffFormValues>(() =>
    mode === "edit" && staff ? valuesFromStaff(staff) : emptyValues(),
  );
  const [touched, setTouched] = useState(false);

  // Reset to fresh values exactly on the closed → open transition, computed
  // during render rather than in an effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(mode === "edit" && staff ? valuesFromStaff(staff) : emptyValues());
      setTouched(false);
    }
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());

  const errors = {
    name: values.name.trim() === "" ? "กรุณาระบุชื่อ-นามสกุล" : undefined,
    email: values.email.trim() === "" ? "กรุณาระบุอีเมล" : !emailValid ? "รูปแบบอีเมลไม่ถูกต้อง" : undefined,
    department: values.department.trim() === "" ? "กรุณาระบุหน่วยงานต้นสังกัด" : undefined,
    // A teacher account with nothing to link to cannot see any subject —
    // the whole reason this field exists — so it is required, not optional.
    teacherId:
      values.role === "teacher" && !values.teacherId
        ? "กรุณาเลือกอาจารย์ที่ผูกกับบัญชีนี้ มิฉะนั้นบัญชีนี้จะไม่เห็นรายวิชาใด ๆ"
        : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;
    onSubmit(values);
  }

  function handleRoleChange(role: StaffRole) {
    // Switching away from "teacher" clears the link immediately — an
    // officer or super-admin account should never carry a stale teacherId.
    setValues((s) => ({ ...s, role, teacherId: role === "teacher" ? s.teacherId : undefined }));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "เพิ่มบัญชีเจ้าหน้าที่" : "แก้ไขข้อมูลเจ้าหน้าที่"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "สร้างบัญชีใหม่ให้เจ้าหน้าที่หรืออาจารย์ ระบบจะส่งอีเมลเชิญให้ตั้งรหัสผ่านเอง ไม่ต้องตั้งรหัสผ่านในหน้านี้"
              : "แก้ไขข้อมูลทั่วไปของบัญชีนี้ การเปลี่ยนบทบาททำได้จากเมนู ⋯ ในตารางเท่านั้น เพื่อให้เห็นผลของการเปลี่ยนก่อนยืนยันเสมอ"}
          </SheetDescription>
        </SheetHeader>

        <form id="staff-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="staff-name">
              ชื่อ-นามสกุล<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="staff-name"
              value={values.name}
              onChange={(e) => setValues((s) => ({ ...s, name: e.target.value }))}
              placeholder="เช่น สมชาย ใจดี"
              aria-invalid={touched && Boolean(errors.name)}
              aria-describedby={touched && errors.name ? "staff-name-error" : undefined}
            />
            {touched && errors.name ? (
              <p id="staff-name-error" className="text-sm text-[var(--destructive)]">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="staff-email">
              อีเมล<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="staff-email"
              type="email"
              value={values.email}
              onChange={(e) => setValues((s) => ({ ...s, email: e.target.value }))}
              placeholder="name@tu.ac.th"
              aria-invalid={touched && Boolean(errors.email)}
              aria-describedby={touched && errors.email ? "staff-email-error" : undefined}
            />
            {touched && errors.email ? (
              <p id="staff-email-error" className="text-sm text-[var(--destructive)]">
                {errors.email}
              </p>
            ) : null}
          </div>

          {mode === "add" ? (
            <div className="space-y-1.5">
              <Label htmlFor="staff-role">บทบาท</Label>
              <Select value={values.role} onValueChange={(v) => handleRoleChange(v as StaffRole)}>
                <SelectTrigger id="staff-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {staffRoleInfo[role].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-[var(--ink-muted)]">{staffRoleInfo[values.role].description}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <Label>บทบาทปัจจุบัน</Label>
              <p className="text-sm font-medium">{staffRoleInfo[values.role].label}</p>
              <p className="text-xs text-[var(--ink-muted)]">{staffRoleInfo[values.role].description}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="staff-department">
              หน่วยงานต้นสังกัด<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="staff-department"
              value={values.department}
              onChange={(e) => setValues((s) => ({ ...s, department: e.target.value }))}
              placeholder="เช่น งานการเงินและบัญชี"
              aria-invalid={touched && Boolean(errors.department)}
              aria-describedby={touched && errors.department ? "staff-department-error" : undefined}
            />
            {touched && errors.department ? (
              <p id="staff-department-error" className="text-sm text-[var(--destructive)]">
                {errors.department}
              </p>
            ) : null}
          </div>

          {values.role === "teacher" ? (
            <div className="space-y-1.5">
              <Label htmlFor="staff-teacher">
                ผูกกับอาจารย์<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Select value={values.teacherId ?? ""} onValueChange={(v) => setValues((s) => ({ ...s, teacherId: v }))}>
                <SelectTrigger
                  id="staff-teacher"
                  className="w-full"
                  aria-invalid={touched && Boolean(errors.teacherId)}
                  aria-describedby={touched && errors.teacherId ? "staff-teacher-error" : "staff-teacher-help"}
                >
                  <SelectValue placeholder="เลือกอาจารย์" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched && errors.teacherId ? (
                <p id="staff-teacher-error" className="text-sm text-[var(--destructive)]">
                  {errors.teacherId}
                </p>
              ) : (
                <p id="staff-teacher-help" className="text-xs text-[var(--ink-muted)]">
                  บัญชีนี้จะเห็นเฉพาะรายวิชาที่อาจารย์ท่านนี้รับผิดชอบเท่านั้น
                </p>
              )}
            </div>
          ) : null}

          {mode === "add" ? (
            <p className="rounded-lg bg-[var(--surface)] px-3 py-2.5 text-xs leading-5 text-[var(--ink-muted)]">
              ไม่ต้องตั้งรหัสผ่านที่นี่ — ระบบจะส่งอีเมลลิงก์ตั้งรหัสผ่านไปยัง {values.email.trim() || "อีเมลที่ระบุ"} โดยอัตโนมัติหลังบันทึก
            </p>
          ) : null}
        </form>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--border)]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button type="submit" form="staff-form">
            {mode === "add" ? "สร้างบัญชี" : "บันทึกการแก้ไข"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
