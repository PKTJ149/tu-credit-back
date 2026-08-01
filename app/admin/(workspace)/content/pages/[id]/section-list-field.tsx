"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/admin/form-fields";

export type PageSectionDraft = { id: string; heading: string; body: string };

type SectionListFieldProps = {
  sections: PageSectionDraft[];
  onChange: (sections: PageSectionDraft[]) => void;
  onAdd: () => void;
  /** Only populated once the officer has attempted to save — matches the
   *  house rule of validating on submit, not on blur. */
  errors?: Record<string, { heading?: string; body?: string }>;
};

/** Add/remove rows for a page's ordered heading+body sections. Modelled on
 *  `StringListField` in `components/admin/form-fields.tsx`, but each row is a
 *  {heading, body} pair rather than a single string — a page section is a
 *  slide, not a line, so one textarea pretending to hold the whole page
 *  would lose the boundary between sections the moment someone edits it. */
export function SectionListField({ sections, onChange, onAdd, errors }: SectionListFieldProps) {
  function updateAt(index: number, patch: Partial<PageSectionDraft>) {
    onChange(sections.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }
  function removeAt(index: number) {
    onChange(sections.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {sections.length === 0 ? (
        <p className="text-sm text-[var(--ink-muted)]">ยังไม่มีหัวข้อในหน้านี้ เพิ่มหัวข้อแรกด้านล่าง</p>
      ) : (
        <ol className="space-y-4">
          {sections.map((section, index) => {
            const err = errors?.[section.id];
            return (
              <li key={section.id} className="rounded-lg border border-[var(--border)] p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="mt-2 text-xs font-medium text-[var(--ink-subtle)]">หัวข้อที่ {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeAt(index)}
                    aria-label={`ลบหัวข้อที่ ${index + 1}`}
                  >
                    <X className="size-4" aria-hidden />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`section-heading-${section.id}`}>
                      หัวเรื่อง<span className="ms-1 text-[var(--destructive)]">*</span>
                    </Label>
                    <Input
                      id={`section-heading-${section.id}`}
                      value={section.heading}
                      onChange={(e) => updateAt(index, { heading: e.target.value })}
                      placeholder="เช่น ช่องทางติดต่อสำนักงาน"
                      aria-invalid={Boolean(err?.heading)}
                      aria-describedby={err?.heading ? `section-heading-${section.id}-error` : undefined}
                    />
                    <FieldError id={`section-heading-${section.id}-error`} message={err?.heading} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`section-body-${section.id}`}>
                      เนื้อหา<span className="ms-1 text-[var(--destructive)]">*</span>
                    </Label>
                    <Textarea
                      id={`section-body-${section.id}`}
                      rows={4}
                      value={section.body}
                      onChange={(e) => updateAt(index, { body: e.target.value })}
                      aria-invalid={Boolean(err?.body)}
                      aria-describedby={err?.body ? `section-body-${section.id}-error` : undefined}
                    />
                    <FieldError id={`section-body-${section.id}-error`} message={err?.body} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="size-4" aria-hidden />
        เพิ่มหัวข้อ
      </Button>
    </div>
  );
}
