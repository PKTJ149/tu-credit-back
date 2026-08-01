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
import type { AcademicTerm } from "@/lib/admin/types";
import { TERM_STATUS_LABEL } from "./term-status";

export type TermFormValues = {
  name: string;
  startDate: string;
  endDate: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
  status: AcademicTerm["status"];
};

type TermSheetProps = {
  open: boolean;
  mode: "add" | "edit";
  term?: AcademicTerm;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TermFormValues) => void;
};

function emptyValues(): TermFormValues {
  return { name: "", startDate: "", endDate: "", registrationOpensAt: "", registrationClosesAt: "", status: "planned" };
}

function valuesFromTerm(term: AcademicTerm): TermFormValues {
  return {
    name: term.name,
    startDate: term.startDate,
    endDate: term.endDate,
    registrationOpensAt: term.registrationOpensAt,
    registrationClosesAt: term.registrationClosesAt,
    status: term.status,
  };
}

const STATUS_OPTIONS: AcademicTerm["status"][] = ["planned", "open", "in-progress", "closed"];

/** Add/edit form for one academic term. A side sheet, not a modal — five
 *  fields including two date ranges is enough content that a modal takeover
 *  would be more disruptive than helpful for a correction this small. */
export function TermSheet({ open, mode, term, onOpenChange, onSubmit }: TermSheetProps) {
  const [values, setValues] = useState<TermFormValues>(() => (mode === "edit" && term ? valuesFromTerm(term) : emptyValues()));
  const [touched, setTouched] = useState(false);

  // Reset the form to fresh values exactly on the closed → open transition,
  // computed during render rather than in an effect (React's documented
  // pattern for adjusting state from props without an extra render pass).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(mode === "edit" && term ? valuesFromTerm(term) : emptyValues());
      setTouched(false);
    }
  }

  const errors = {
    name: values.name.trim() === "" ? "กรุณาระบุชื่อภาคการศึกษา" : undefined,
    startDate: values.startDate === "" ? "กรุณาระบุวันเริ่มภาคการศึกษา" : undefined,
    endDate:
      values.endDate === ""
        ? "กรุณาระบุวันสิ้นสุดภาคการศึกษา"
        : values.startDate && values.endDate < values.startDate
          ? "วันสิ้นสุดต้องอยู่หลังวันเริ่ม"
          : undefined,
    registrationOpensAt: values.registrationOpensAt === "" ? "กรุณาระบุวันเปิดรับลงทะเบียน" : undefined,
    registrationClosesAt:
      values.registrationClosesAt === ""
        ? "กรุณาระบุวันปิดรับลงทะเบียน"
        : values.registrationOpensAt && values.registrationClosesAt < values.registrationOpensAt
          ? "วันปิดรับต้องอยู่หลังวันเปิดรับ"
          : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;
    onSubmit(values);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "เพิ่มภาคการศึกษา" : "แก้ไขภาคการศึกษา"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "กำหนดชื่อ ช่วงการศึกษา และช่วงเปิดรับลงทะเบียนของภาคการศึกษาใหม่"
              : "แก้ไขรายละเอียดภาคการศึกษานี้ การเปลี่ยนแปลงจะมีผลทันทีที่บันทึก"}
          </SheetDescription>
        </SheetHeader>

        <form id="term-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="term-name">
              ชื่อภาคการศึกษา<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="term-name"
              value={values.name}
              onChange={(e) => setValues((s) => ({ ...s, name: e.target.value }))}
              placeholder="เช่น ภาคต้น 2570"
              aria-invalid={touched && Boolean(errors.name)}
              aria-describedby={touched && errors.name ? "term-name-error" : undefined}
            />
            {touched && errors.name ? (
              <p id="term-name-error" className="text-sm text-[var(--destructive)]">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="term-start">
                วันเริ่มภาคการศึกษา<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="term-start"
                type="date"
                value={values.startDate}
                onChange={(e) => setValues((s) => ({ ...s, startDate: e.target.value }))}
                aria-invalid={touched && Boolean(errors.startDate)}
              />
              {touched && errors.startDate ? <p className="text-sm text-[var(--destructive)]">{errors.startDate}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="term-end">
                วันสิ้นสุดภาคการศึกษา<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="term-end"
                type="date"
                value={values.endDate}
                onChange={(e) => setValues((s) => ({ ...s, endDate: e.target.value }))}
                aria-invalid={touched && Boolean(errors.endDate)}
              />
              {touched && errors.endDate ? <p className="text-sm text-[var(--destructive)]">{errors.endDate}</p> : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="term-reg-open">
                วันเปิดรับลงทะเบียน<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="term-reg-open"
                type="date"
                value={values.registrationOpensAt}
                onChange={(e) => setValues((s) => ({ ...s, registrationOpensAt: e.target.value }))}
                aria-invalid={touched && Boolean(errors.registrationOpensAt)}
              />
              {touched && errors.registrationOpensAt ? (
                <p className="text-sm text-[var(--destructive)]">{errors.registrationOpensAt}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="term-reg-close">
                วันปิดรับลงทะเบียน<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="term-reg-close"
                type="date"
                value={values.registrationClosesAt}
                onChange={(e) => setValues((s) => ({ ...s, registrationClosesAt: e.target.value }))}
                aria-invalid={touched && Boolean(errors.registrationClosesAt)}
              />
              {touched && errors.registrationClosesAt ? (
                <p className="text-sm text-[var(--destructive)]">{errors.registrationClosesAt}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="term-status">สถานะ</Label>
            <Select
              value={values.status}
              onValueChange={(v) => setValues((s) => ({ ...s, status: v as AcademicTerm["status"] }))}
            >
              <SelectTrigger id="term-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {TERM_STATUS_LABEL[opt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--ink-muted)]">
              ปกติควรเปลี่ยนสถานะผ่านปุ่มดำเนินการในหน้ารายการ ใช้ตัวเลือกนี้เฉพาะเมื่อต้องการแก้ไขให้ตรงกับความเป็นจริงเท่านั้น
            </p>
          </div>
        </form>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--border)]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button type="submit" form="term-form">
            {mode === "add" ? "เพิ่มภาคการศึกษา" : "บันทึกการแก้ไข"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
