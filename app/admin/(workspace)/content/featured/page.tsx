"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AlertTriangle, ImageOff, MoreHorizontal, Plus, Sparkles, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  featuredEntries as initialEntries,
  featuredSlotHomepageNote,
  featuredSlotLabel,
  getFeaturedCatalogueItem,
} from "@/lib/admin/mock-content";
import type { FeaturedEntry } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import { FeaturedPickerSheet } from "./featured-picker-sheet";
import { ReorderControls } from "@/components/admin/reorder-controls";

type Slot = FeaturedEntry["slot"];
const SLOTS: Slot[] = ["hero", "recommended", "popular"];

export default function FeaturedPage() {
  const [entries, setEntries] = useState<FeaturedEntry[]>(initialEntries);
  const [activeSlot, setActiveSlot] = useState<Slot>("hero");
  const [pickerOpen, setPickerOpen] = useState(false);

  const bySlot = useMemo(() => {
    const map: Record<Slot, FeaturedEntry[]> = { hero: [], recommended: [], popular: [] };
    for (const slot of SLOTS) {
      map[slot] = entries.filter((e) => e.slot === slot).sort((a, b) => a.order - b.order);
    }
    return map;
  }, [entries]);

  function move(entry: FeaturedEntry, direction: "up" | "down") {
    const list = bySlot[entry.slot];
    const index = list.findIndex((e) => e.id === entry.id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= list.length) return;

    const a = list[index];
    const b = list[swapWith];
    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === a.id) return { ...item, order: b.order };
        if (item.id === b.id) return { ...item, order: a.order };
        return item;
      }),
    );
  }

  function toggleActive(entry: FeaturedEntry) {
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, active: !e.active } : e)));
    const item = getFeaturedCatalogueItem(entry);
    toast.success(entry.active ? "ปิดใช้งานรายการแล้ว" : "เปิดใช้งานรายการแล้ว", { description: item?.name });
  }

  function removeEntry(entry: FeaturedEntry) {
    const item = getFeaturedCatalogueItem(entry);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    toast.success("นำออกจากชุดแล้ว", { description: item?.name });
  }

  function handleAdd(itemType: FeaturedEntry["itemType"], itemId: string) {
    const currentSlotEntries = bySlot[activeSlot];
    const maxOrder = currentSlotEntries.reduce((max, e) => Math.max(max, e.order), 0);
    const newEntry: FeaturedEntry = {
      id: `fe-new-${entries.length + 1}`,
      itemType,
      itemId,
      slot: activeSlot,
      order: maxOrder + 1,
      active: true,
    };
    setEntries((prev) => [...prev, newEntry]);
    const item = getFeaturedCatalogueItem(newEntry);
    toast.success(`เพิ่ม "${item?.name ?? itemId}" ในชุด “${featuredSlotLabel[activeSlot]}” แล้ว`);
    setPickerOpen(false);
  }

  function columnsFor(slot: Slot): Column<FeaturedEntry>[] {
    const list = bySlot[slot];
    return [
      {
        key: "order",
        header: "ลำดับ",
        width: "w-24",
        cell: (entry) => {
          const index = list.findIndex((e) => e.id === entry.id);
          // The label names the program or subject, not just the direction: a
          // dozen buttons all announcing "เลื่อนขึ้น" tell a screen-reader user
          // nothing about which row they are about to move.
          const name = getFeaturedCatalogueItem(entry)?.name ?? entry.itemId;
          return (
            <ReorderControls
              position={index + 1}
              itemLabel={name}
              canMoveUp={index > 0}
              canMoveDown={index < list.length - 1}
              onMoveUp={() => move(entry, "up")}
              onMoveDown={() => move(entry, "down")}
            />
          );
        },
      },
      {
        key: "thumbnail",
        header: "ภาพ",
        width: "w-20",
        cell: (entry) => {
          const item = getFeaturedCatalogueItem(entry);
          return <ItemThumbnail src={item?.image} />;
        },
      },
      {
        key: "name",
        header: "รายการ",
        truncate: "max-w-[30ch]",
        cell: (entry) => {
          const item = getFeaturedCatalogueItem(entry);
          if (!item) {
            return <span className="text-[var(--destructive)]">ไม่พบข้อมูลรายการนี้ในคลัง (id: {entry.itemId})</span>;
          }
          return (
            <div className="min-w-0">
              <p className="truncate font-medium">{item.name}</p>
              <p className="truncate text-xs text-[var(--ink-subtle)]">
                {entry.itemType === "program" ? "หลักสูตร" : "รายวิชา"} · {item.meta}
              </p>
            </div>
          );
        },
      },
      {
        key: "status",
        header: "สถานะรับสมัคร",
        width: "w-44",
        cell: (entry) => {
          const item = getFeaturedCatalogueItem(entry);
          if (!item) return null;
          if (item.status === "closed") {
            return (
              <span className="inline-flex items-center gap-1.5">
                <StatusBadge label="ปิดรับสมัครแล้ว" tone="critical" />
              </span>
            );
          }
          return <StatusBadge label="เปิดรับสมัคร" tone="positive" />;
        },
      },
      {
        key: "active",
        header: "ใช้งาน",
        width: "w-24",
        cell: (entry) => (
          <Switch
            checked={entry.active}
            onCheckedChange={() => toggleActive(entry)}
            aria-label={entry.active ? "ปิดใช้งานรายการนี้" : "เปิดใช้งานรายการนี้"}
          />
        ),
      },
      {
        key: "actions",
        header: "จัดการ",
        align: "end",
        stickyEnd: true,
        cell: (entry) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="จัดการรายการนี้">
                <MoreHorizontal className="size-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="size-4" aria-hidden />
                    นำออกจากชุดนี้
                  </DropdownMenuItem>
                }
                title="นำออกจากชุดหลักสูตรแนะนำ"
                description={`รายการนี้จะหายไปจากโซน “${featuredSlotLabel[slot]}” บนหน้าแรกทันที`}
                confirmLabel="นำออก"
                tone="destructive"
                onConfirm={() => removeEntry(entry)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }

  const closedInAnySlot = entries.some((e) => getFeaturedCatalogueItem(e)?.status === "closed");

  return (
    <>
      <PageHeader
        title="หลักสูตรแนะนำ"
        description="ควบคุมรายการหลักสูตรและรายวิชาที่แสดงบนหน้าแรกจริง แทนที่อาร์เรย์ slug ที่ฝังอยู่ในโค้ดปัจจุบัน — สิ่งที่จัดเรียงและเปิด/ปิดใช้งานที่นี่ คือสิ่งที่ผู้เรียนเห็นบนหน้าแรกโดยตรง"
        actions={
          <Button type="button" size="sm" onClick={() => setPickerOpen(true)}>
            <Plus className="size-4" aria-hidden />
            เพิ่มรายการ
          </Button>
        }
      />

      {closedInAnySlot ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-[var(--destructive)]/30 bg-[color:color-mix(in_oklch,var(--destructive)_6%,white)] px-4 py-3 text-sm text-[var(--destructive)]"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            มีรายการที่ปิดรับสมัครแล้วแต่ยังอยู่ในชุดหลักสูตรแนะนำ ผู้เรียนจะยังเห็นรายการนี้บนหน้าแรกแต่ลงทะเบียนไม่ได้ —
            แนะนำให้นำออกหรือแทนที่ด้วยรายการที่เปิดรับสมัคร
          </p>
        </div>
      ) : null}

      <Tabs value={activeSlot} onValueChange={(v) => setActiveSlot(v as Slot)}>
        <TabsList>
          {SLOTS.map((slot) => (
            <TabsTrigger key={slot} value={slot}>
              {featuredSlotLabel[slot]}
              <span className="ms-1 text-xs text-[var(--ink-subtle)]">({bySlot[slot].length})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {SLOTS.map((slot) => (
          <TabsContent key={slot} value={slot} className="space-y-3">
            <p className="text-sm leading-6 text-[var(--ink-muted)] text-pretty">{featuredSlotHomepageNote[slot]}</p>
            <DataTable
              columns={columnsFor(slot)}
              rows={bySlot[slot]}
              rowKey={(e) => e.id}
              caption={`รายการในชุด ${featuredSlotLabel[slot]}`}
              empty={
                <EmptyState
                  icon={Sparkles}
                  title={`ยังไม่มีรายการในชุด “${featuredSlotLabel[slot]}”`}
                  description="เพิ่มหลักสูตรหรือรายวิชาแรกด้วยปุ่ม “เพิ่มรายการ” ด้านบน เพื่อให้โซนนี้มีเนื้อหาแสดงบนหน้าแรก"
                />
              }
            />
          </TabsContent>
        ))}
      </Tabs>

      <FeaturedPickerSheet
        open={pickerOpen}
        slot={activeSlot}
        existingEntries={bySlot[activeSlot]}
        onOpenChange={setPickerOpen}
        onAdd={handleAdd}
      />
    </>
  );
}

function ItemThumbnail({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  const trimmed = src?.trim();

  if (!trimmed || failed) {
    return (
      <div
        className={cn(
          "flex aspect-square w-12 items-center justify-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-[var(--ink-subtle)]",
        )}
      >
        <ImageOff className="size-3.5" aria-hidden />
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-12 overflow-hidden rounded-md bg-[var(--surface-strong)]">
      <Image src={trimmed} alt="" fill sizes="48px" className="object-cover" onError={() => setFailed(true)} />
    </div>
  );
}
