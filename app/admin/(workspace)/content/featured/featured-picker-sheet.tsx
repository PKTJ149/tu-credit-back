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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { featuredSlotHomepageNote, featuredSlotLabel, listCatalogueOptions } from "@/lib/admin/mock-content";
import type { FeaturedEntry } from "@/lib/admin/types";

type ItemType = FeaturedEntry["itemType"];

type FeaturedPickerSheetProps = {
  open: boolean;
  slot: FeaturedEntry["slot"];
  /** Entries already in this slot — drives the duplicate guard. */
  existingEntries: FeaturedEntry[];
  onOpenChange: (open: boolean) => void;
  onAdd: (itemType: ItemType, itemId: string) => void;
};

/** Adds one program or subject to a curation slot. The picker itself is the
 *  guard: closed items and items already in this slot are shown, disabled,
 *  with the reason spelled out — not silently hidden. */
export function FeaturedPickerSheet({ open, slot, existingEntries, onOpenChange, onAdd }: FeaturedPickerSheetProps) {
  const [itemType, setItemType] = useState<ItemType>("program");
  const [itemId, setItemId] = useState("");
  const [touched, setTouched] = useState(false);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setItemType("program");
      setItemId("");
      setTouched(false);
    }
  }

  const options = listCatalogueOptions(itemType);
  const usedIds = new Set(existingEntries.filter((e) => e.itemType === itemType).map((e) => e.itemId));
  const selected = options.find((o) => o.id === itemId);

  const error =
    itemId === ""
      ? "กรุณาเลือกรายการที่ต้องการเพิ่ม"
      : selected?.status === "closed"
        ? "ไม่สามารถเพิ่มรายการที่ปิดรับสมัครแล้วได้"
        : usedIds.has(itemId)
          ? "รายการนี้อยู่ในชุดนี้อยู่แล้ว ไม่สามารถเพิ่มซ้ำได้"
          : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    onAdd(itemType, itemId);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>เพิ่มรายการในชุด “{featuredSlotLabel[slot]}”</SheetTitle>
          <SheetDescription>{featuredSlotHomepageNote[slot]}</SheetDescription>
        </SheetHeader>

        <form
          id="featured-picker-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="fp-type">ประเภทรายการ</Label>
            <Select
              value={itemType}
              onValueChange={(v) => {
                setItemType(v as ItemType);
                setItemId("");
              }}
            >
              <SelectTrigger id="fp-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="program">หลักสูตร</SelectItem>
                <SelectItem value="subject">รายวิชา</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fp-item">{itemType === "program" ? "หลักสูตร" : "รายวิชา"}</Label>
            <Select value={itemId || undefined} onValueChange={setItemId}>
              <SelectTrigger id="fp-item" className="w-full" aria-invalid={touched && Boolean(error)}>
                <SelectValue placeholder={`เลือก${itemType === "program" ? "หลักสูตร" : "รายวิชา"}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => {
                  const disabled = o.status === "closed" || usedIds.has(o.id);
                  const reason = o.status === "closed" ? " (ปิดรับสมัครแล้ว)" : usedIds.has(o.id) ? " (อยู่ในชุดนี้แล้ว)" : "";
                  return (
                    <SelectItem key={o.id} value={o.id} disabled={disabled}>
                      {o.name}
                      {reason}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {touched && error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
            <p className="text-xs text-[var(--ink-subtle)]">
              รายการที่ปิดรับสมัครแล้ว หรืออยู่ในชุดนี้อยู่แล้ว จะเลือกซ้ำไม่ได้
            </p>
          </div>
        </form>

        <SheetFooter>
          <Button type="submit" form="featured-picker-form">
            เพิ่มรายการ
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
