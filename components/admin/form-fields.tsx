"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Two small controlled inputs shared by the programs, subjects, and teachers
 * forms — not tied to any one entity, so all three import the same file
 * instead of drifting into three slightly different add/remove rows.
 */

type StringListFieldProps = {
  id: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  placeholder?: string;
  emptyHint: string;
};

/** Add/remove rows for a `string[]` field — education history, outcomes,
 *  career paths. A single textarea pretending to be a list loses the
 *  boundary between entries the moment someone edits it. */
export function StringListField({ id, label, items, onChange, addLabel, placeholder, emptyHint }: StringListFieldProps) {
  function updateAt(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }
  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...items, ""]);
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--ink-muted)]">{emptyHint}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${id}-${index}`} className="flex items-center gap-2">
              <Input
                aria-label={`${label} รายการที่ ${index + 1}`}
                value={item}
                placeholder={placeholder}
                onChange={(e) => updateAt(index, e.target.value)}
                className="h-9"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeAt(index)}
                aria-label={`ลบ${label}รายการที่ ${index + 1}`}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="size-4" aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}

type MultiSelectListProps = {
  id: string;
  label: string;
  options: { id: string; label: string; hint?: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  emptyOptionsHint: string;
};

/** Checklist for assigning teachers/subjects to a program or subject. A
 *  bordered scrollable list, not a modal — the assignment is part of the
 *  form, not a separate step. */
export function MultiSelectList({ id, label, options, selectedIds, onChange, emptyOptionsHint }: MultiSelectListProps) {
  function toggle(optionId: string, checked: boolean) {
    onChange(checked ? [...selectedIds, optionId] : selectedIds.filter((v) => v !== optionId));
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label}
        <span className="font-normal text-[var(--ink-subtle)]">({selectedIds.length} รายการ)</span>
      </Label>
      {options.length === 0 ? (
        <p className="text-sm text-[var(--ink-muted)]">{emptyOptionsHint}</p>
      ) : (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-[var(--border)]">
          <ul className="divide-y divide-[var(--border)]">
            {options.map((option) => {
              const checkboxId = `${id}-${option.id}`;
              const checked = selectedIds.includes(option.id);
              return (
                <li key={option.id}>
                  <label
                    htmlFor={checkboxId}
                    className="flex cursor-pointer items-start gap-2.5 px-3 py-2 text-sm hover:bg-[var(--surface)]"
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={checked}
                      onCheckedChange={(value) => toggle(option.id, value === true)}
                      className="mt-0.5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{option.label}</span>
                      {option.hint ? (
                        <span className="block truncate text-xs text-[var(--ink-subtle)]">{option.hint}</span>
                      ) : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

type FieldErrorProps = { id: string; message?: string };

/** Consistent inline error copy under a field — pair its `id` with the
 *  field's `aria-describedby`. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-[var(--destructive)]">
      {message}
    </p>
  );
}

/** Announced once, at the top of a form, the moment a submit attempt fails
 *  validation — so a screen reader user hears that something needs fixing
 *  without waiting to tab through every field. */
export function FormErrorSummary({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-[var(--destructive)]/30 bg-[color:color-mix(in_oklch,var(--destructive)_6%,white)] px-4 py-3 text-sm text-[var(--destructive)]"
    >
      กรุณาตรวจสอบข้อมูลที่ยังไม่ครบถ้วน ({count} รายการ) ก่อนบันทึก
    </div>
  );
}
