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
import { TAXONOMY_KIND_LABEL } from "@/lib/admin/mock-settings";
import type { TaxonomyKind, TaxonomyTerm } from "@/lib/admin/types";

export type TaxonomyTermFormValues = {
  value: string;
  valueEn: string;
};

type TaxonomyTermSheetProps = {
  open: boolean;
  mode: "add" | "edit";
  kind: TaxonomyKind;
  term?: TaxonomyTerm;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaxonomyTermFormValues) => void;
};

function emptyValues(): TaxonomyTermFormValues {
  return { value: "", valueEn: "" };
}

function valuesFromTerm(term: TaxonomyTerm): TaxonomyTermFormValues {
  return { value: term.value, valueEn: term.valueEn ?? "" };
}

/** Add/edit one taxonomy term. Order changes only through the up/down
 *  controls in the table, and active/inactive only through the row menu's
 *  confirmed actions — both are consequential enough to want their own
 *  moment, not a checkbox buried in this form. */
export function TaxonomyTermSheet({ open, mode, kind, term, onOpenChange, onSubmit }: TaxonomyTermSheetProps) {
  const [values, setValues] = useState<TaxonomyTermFormValues>(() =>
    mode === "edit" && term ? valuesFromTerm(term) : emptyValues(),
  );
  const [touched, setTouched] = useState(false);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(mode === "edit" && term ? valuesFromTerm(term) : emptyValues());
      setTouched(false);
    }
  }

  const errors = {
    value: values.value.trim() === "" ? "กรุณาระบุชื่อภาษาไทย" : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;
    onSubmit(values);
  }

  const kindLabel = TAXONOMY_KIND_LABEL[kind];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? `เพิ่มรายการ${kindLabel}` : `แก้ไขรายการ${kindLabel}`}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? `รายการใหม่จะพร้อมใช้งานทันทีในทุกแบบฟอร์มที่อ้างอิงชุดข้อมูล "${kindLabel}"`
              : `แก้ไขชื่อที่แสดงของรายการนี้ ระบบอื่นที่อ้างอิงอยู่จะเห็นชื่อใหม่ทันที`}
          </SheetDescription>
        </SheetHeader>

        <form id="taxonomy-term-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="term-value">
              ชื่อภาษาไทย<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="term-value"
              value={values.value}
              onChange={(e) => setValues((s) => ({ ...s, value: e.target.value }))}
              placeholder="เช่น คณะวิทยาศาสตร์และเทคโนโลยี"
              aria-invalid={touched && Boolean(errors.value)}
              aria-describedby={touched && errors.value ? "term-value-error" : undefined}
            />
            {touched && errors.value ? (
              <p id="term-value-error" className="text-sm text-[var(--destructive)]">
                {errors.value}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="term-value-en">ชื่อภาษาอังกฤษ (ถ้ามี)</Label>
            <Input
              id="term-value-en"
              value={values.valueEn}
              onChange={(e) => setValues((s) => ({ ...s, valueEn: e.target.value }))}
              placeholder="เช่น Faculty of Science and Technology"
            />
          </div>
        </form>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--border)]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button type="submit" form="taxonomy-term-form">
            {mode === "add" ? "เพิ่มรายการ" : "บันทึกการแก้ไข"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
