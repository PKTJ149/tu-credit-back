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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldError } from "@/components/admin/form-fields";
import { TODAY } from "@/lib/admin/mock-data";
import { legalKindLabel, suggestNextVersion } from "@/lib/admin/mock-pages";
import type { LegalDocument } from "@/lib/admin/types";

export type LegalVersionFormValues = {
  version: string;
  effectiveAt: string;
  body: string;
  publishNow: boolean;
};

type LegalVersionSheetProps = {
  open: boolean;
  /** The version this edit starts from — its body pre-fills the form, and
   *  its version string seeds the suggested next version. */
  basedOn?: LegalDocument;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: LegalVersionFormValues) => void;
};

function valuesFrom(basedOn?: LegalDocument): LegalVersionFormValues {
  return {
    version: basedOn ? suggestNextVersion(basedOn.version) : "1.0",
    effectiveAt: TODAY,
    body: basedOn?.body ?? "",
    publishNow: true,
  };
}

/** Every submit inserts a new `LegalDocument` row — it never overwrites the
 *  one already in force. Consent was given against specific wording, so the
 *  previous version has to stay readable under its own version number. */
export function LegalVersionSheet({ open, basedOn, onOpenChange, onSubmit }: LegalVersionSheetProps) {
  const [values, setValues] = useState<LegalVersionFormValues>(() => valuesFrom(basedOn));
  const [touched, setTouched] = useState(false);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(valuesFrom(basedOn));
      setTouched(false);
    }
  }

  const errors = {
    version: values.version.trim() === "" ? "กรุณาระบุหมายเลขเวอร์ชัน" : undefined,
    effectiveAt: values.effectiveAt === "" ? "กรุณาระบุวันที่มีผลบังคับใช้" : undefined,
    body: values.body.trim() === "" ? "กรุณากรอกเนื้อหาเอกสาร" : undefined,
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
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{basedOn ? `แก้ไข${legalKindLabel[basedOn.kind]} — สร้างเวอร์ชันใหม่` : "สร้างเวอร์ชันใหม่"}</SheetTitle>
          <SheetDescription>
            การบันทึกจะสร้างเวอร์ชันใหม่เสมอ ไม่บันทึกทับฉบับที่ใช้อยู่ในปัจจุบัน ผู้เรียนที่เคยให้ความยินยอมกับฉบับเดิมจะยังอ้างอิงข้อความฉบับนั้นได้ครบถ้วน
          </SheetDescription>
        </SheetHeader>

        <form id="legal-version-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="legal-version">
                หมายเลขเวอร์ชัน<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="legal-version"
                value={values.version}
                onChange={(e) => setValues((s) => ({ ...s, version: e.target.value }))}
                aria-invalid={touched && Boolean(errors.version)}
                aria-describedby={touched && errors.version ? "legal-version-error" : undefined}
              />
              <FieldError id="legal-version-error" message={touched ? errors.version : undefined} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="legal-effective">
                วันที่มีผลบังคับใช้<span className="ms-1 text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="legal-effective"
                type="date"
                value={values.effectiveAt}
                onChange={(e) => setValues((s) => ({ ...s, effectiveAt: e.target.value }))}
                aria-invalid={touched && Boolean(errors.effectiveAt)}
                aria-describedby={touched && errors.effectiveAt ? "legal-effective-error" : undefined}
              />
              <FieldError id="legal-effective-error" message={touched ? errors.effectiveAt : undefined} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="legal-body">
              เนื้อหาเอกสาร<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Textarea
              id="legal-body"
              rows={12}
              value={values.body}
              onChange={(e) => setValues((s) => ({ ...s, body: e.target.value }))}
              aria-invalid={touched && Boolean(errors.body)}
              aria-describedby={touched && errors.body ? "legal-body-error" : undefined}
            />
            <FieldError id="legal-body-error" message={touched ? errors.body : undefined} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="legal-publish">เมื่อบันทึก</Label>
            <Select
              value={values.publishNow ? "publish" : "draft"}
              onValueChange={(v) => setValues((s) => ({ ...s, publishNow: v === "publish" }))}
            >
              <SelectTrigger id="legal-publish" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publish">เผยแพร่ทันที (ฉบับเดิมจะย้ายเป็นเก็บถาวร)</SelectItem>
                <SelectItem value="draft">บันทึกเป็นฉบับร่างก่อน</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--border)]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button type="submit" form="legal-version-form">
            บันทึกเป็นเวอร์ชันใหม่
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
