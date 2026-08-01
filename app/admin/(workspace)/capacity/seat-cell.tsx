"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { CapacityItem } from "@/lib/admin/mock-schedule";

type SeatCellProps = {
  item: CapacityItem;
  onSave: (newSeats: number) => void;
};

/** Inline seat editor for one capacity row. Plain edit-in-place rather than a
 *  dialog — this is a single number, not enough content to justify a modal —
 *  but a reduction below current enrolment is a real conflict (seats already
 *  promised to enrolled students) and routes through `ConfirmDialog` instead
 *  of saving silently. */
export function SeatCell({ item, onSave }: SeatCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => String(item.seats));

  if (!editing) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="font-mono tabular-nums">{item.seats}</span>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => {
            setDraft(String(item.seats));
            setEditing(true);
          }}
          aria-label={`แก้ไขจำนวนที่นั่งของ ${item.name}`}
        >
          <Pencil className="size-3" aria-hidden />
        </Button>
      </div>
    );
  }

  const parsed = Number(draft);
  const isValid = draft.trim() !== "" && Number.isFinite(parsed) && parsed >= 0 && Number.isInteger(parsed);
  const willConflict = isValid && parsed < item.enrolled;

  function cancel() {
    setEditing(false);
    setDraft(String(item.seats));
  }

  function commit() {
    if (!isValid) return;
    onSave(parsed);
    setEditing(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Input
        type="number"
        min={0}
        step={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        aria-label={`จำนวนที่นั่งใหม่ของ ${item.name}`}
        aria-invalid={!isValid}
        className="h-8 w-20"
      />
      {willConflict ? (
        <ConfirmDialog
          trigger={
            <Button size="sm" className="h-8" disabled={!isValid}>
              บันทึก
            </Button>
          }
          title="ที่นั่งใหม่น้อยกว่าจำนวนผู้ลงทะเบียน"
          description={`"${item.name}" มีผู้ลงทะเบียนอยู่แล้ว ${item.enrolled} คน แต่กำลังตั้งที่นั่งเหลือ ${parsed} ที่ ผู้ที่ลงทะเบียนไว้แล้วจะไม่ถูกถอดออก แต่ระบบจะรับผู้ลงทะเบียนใหม่ไม่ได้จนกว่าจำนวนผู้ลงทะเบียนจะลดลงต่ำกว่าที่นั่งใหม่นี้`}
          confirmLabel="ยืนยันการลดที่นั่ง"
          tone="destructive"
          onConfirm={commit}
        />
      ) : (
        <Button size="sm" className="h-8" onClick={commit} disabled={!isValid}>
          บันทึก
        </Button>
      )}
      <Button size="sm" variant="ghost" className="h-8" onClick={cancel}>
        ยกเลิก
      </Button>
    </div>
  );
}
