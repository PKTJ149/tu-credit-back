"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  /** Spell out the consequence, including who gets told. "แน่ใจหรือไม่" on its
   *  own gives the officer nothing to decide with. */
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "destructive";
  /** Turns the dialog into a reason capture. A rejection with no recorded
   *  reason is the gap the payment state machine already has. */
  reason?: {
    label: string;
    placeholder: string;
    required?: boolean;
    helpText?: string;
  };
  onConfirm: (reason?: string) => void;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = "ยกเลิก",
  tone = "default",
  reason,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const missingReason = Boolean(reason?.required) && value.trim() === "";
  /**
   * Validation surfaces only after a submit attempt, never on blur. Radix
   * focuses the first field when the dialog opens and then moves focus to the
   * content, which fires a blur nobody caused — and an error message shown
   * before the officer has typed anything reads as the dialog being broken.
   */
  const showError = touched && missingReason;

  function handleConfirm() {
    setTouched(true);
    if (missingReason) return;
    onConfirm(reason ? value.trim() : undefined);
    setOpen(false);
    setValue("");
    setTouched(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setValue("");
      setTouched(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="leading-6 text-pretty">{description}</DialogDescription>
        </DialogHeader>

        {reason ? (
          <div className="space-y-1.5">
            <Label htmlFor="confirm-reason">
              {reason.label}
              {reason.required ? <span className="ms-1 text-[var(--destructive)]">*</span> : null}
            </Label>
            <Textarea
              id="confirm-reason"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (touched) setTouched(false);
              }}
              placeholder={reason.placeholder}
              rows={4}
              aria-invalid={showError}
              aria-describedby={showError ? "confirm-reason-error" : reason.helpText ? "confirm-reason-help" : undefined}
            />
            {showError ? (
              <p id="confirm-reason-error" className="text-sm text-[var(--destructive)]">
                กรุณาระบุเหตุผล ผู้เรียนจะเห็นข้อความนี้
              </p>
            ) : reason.helpText ? (
              <p id="confirm-reason-help" className="text-xs text-[var(--ink-muted)]">
                {reason.helpText}
              </p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "destructive" ? "destructive" : "default"} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
