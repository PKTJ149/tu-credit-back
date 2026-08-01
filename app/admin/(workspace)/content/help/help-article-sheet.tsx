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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldError } from "@/components/admin/form-fields";
import { helpCategoryLabel, helpCategoryOrder } from "@/lib/admin/mock-pages";
import type { HelpArticle, PublishState } from "@/lib/admin/types";

/** Help articles never use "scheduled" — the type is shared with content that
 *  does, but a FAQ answer has no publish-at date to schedule against. */
type HelpArticleState = Extract<PublishState, "draft" | "published" | "archived">;

export type HelpArticleFormValues = {
  categoryId: string;
  question: string;
  answer: string;
  state: HelpArticleState;
};

type HelpArticleSheetProps = {
  open: boolean;
  mode: "add" | "edit";
  article?: HelpArticle;
  /** Preselected when adding from inside a specific category panel. */
  defaultCategoryId?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HelpArticleFormValues) => void;
};

const STATE_OPTIONS: HelpArticleState[] = ["draft", "published", "archived"];
const STATE_LABEL: Record<HelpArticleState, string> = {
  draft: "ฉบับร่าง",
  published: "เผยแพร่แล้ว",
  archived: "เก็บถาวร",
};

function emptyValues(defaultCategoryId?: string): HelpArticleFormValues {
  return { categoryId: defaultCategoryId ?? helpCategoryOrder[0], question: "", answer: "", state: "draft" };
}

function valuesFromArticle(article: HelpArticle): HelpArticleFormValues {
  return {
    categoryId: article.categoryId,
    question: article.question,
    answer: article.answer,
    state: article.state === "scheduled" ? "draft" : article.state,
  };
}

export function HelpArticleSheet({
  open,
  mode,
  article,
  defaultCategoryId,
  onOpenChange,
  onSubmit,
}: HelpArticleSheetProps) {
  const [values, setValues] = useState<HelpArticleFormValues>(() =>
    mode === "edit" && article ? valuesFromArticle(article) : emptyValues(defaultCategoryId),
  );
  const [touched, setTouched] = useState(false);

  // Reset exactly on the closed → open transition — see term-sheet.tsx for
  // why this happens during render rather than inside an effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(mode === "edit" && article ? valuesFromArticle(article) : emptyValues(defaultCategoryId));
      setTouched(false);
    }
  }

  const errors = {
    question: values.question.trim() === "" ? "กรุณากรอกคำถาม" : undefined,
    answer: values.answer.trim() === "" ? "กรุณากรอกคำตอบ" : undefined,
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
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "เพิ่มบทความช่วยเหลือ" : "แก้ไขบทความช่วยเหลือ"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "เพิ่มคำถามและคำตอบใหม่ในหมวดช่วยเหลือ บทความจะแสดงต่อผู้เรียนเมื่อเผยแพร่แล้วเท่านั้น"
              : "ย้ายบทความไปหมวดอื่นได้โดยเปลี่ยนหมวดหมู่ด้านล่าง ระบบจะจัดลำดับในหมวดใหม่ให้อัตโนมัติ"}
          </SheetDescription>
        </SheetHeader>

        <form id="help-article-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="ha-category">หมวดหมู่</Label>
            <Select value={values.categoryId} onValueChange={(v) => setValues((s) => ({ ...s, categoryId: v }))}>
              <SelectTrigger id="ha-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {helpCategoryOrder.map((id) => (
                  <SelectItem key={id} value={id}>
                    {helpCategoryLabel[id]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ha-question">
              คำถาม<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Textarea
              id="ha-question"
              rows={2}
              value={values.question}
              onChange={(e) => setValues((s) => ({ ...s, question: e.target.value }))}
              placeholder="เช่น ลืมรหัสผ่านต้องทำอย่างไร"
              aria-invalid={touched && Boolean(errors.question)}
              aria-describedby={touched && errors.question ? "ha-question-error" : undefined}
            />
            <FieldError id="ha-question-error" message={touched ? errors.question : undefined} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ha-answer">
              คำตอบ<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Textarea
              id="ha-answer"
              rows={6}
              value={values.answer}
              onChange={(e) => setValues((s) => ({ ...s, answer: e.target.value }))}
              placeholder="อธิบายขั้นตอนหรือคำตอบให้ผู้เรียนทำตามได้ทันที"
              aria-invalid={touched && Boolean(errors.answer)}
              aria-describedby={touched && errors.answer ? "ha-answer-error" : undefined}
            />
            <FieldError id="ha-answer-error" message={touched ? errors.answer : undefined} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ha-state">สถานะ</Label>
            <Select value={values.state} onValueChange={(v) => setValues((s) => ({ ...s, state: v as HelpArticleState }))}>
              <SelectTrigger id="ha-state" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {STATE_LABEL[opt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mode === "edit" && article ? (
            <p className="text-xs text-[var(--ink-subtle)]">
              ยอดเข้าชม {article.viewCount.toLocaleString("th-TH")} ครั้ง — นับจากพฤติกรรมผู้เรียนจริง แก้ไขเองไม่ได้
            </p>
          ) : null}
        </form>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--border)]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button type="submit" form="help-article-form">
            {mode === "add" ? "เพิ่มบทความ" : "บันทึกการแก้ไข"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
