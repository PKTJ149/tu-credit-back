"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ImageOff,
  LayoutPanelTop,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge, type StatusTone } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TODAY } from "@/lib/admin/mock-data";
import { homeBanners as initialBanners, isBannerLiveNow, publishStateLabel, publishStateTone } from "@/lib/admin/mock-content";
import type { HomeBanner } from "@/lib/admin/types";
import { formatThaiDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { BannerSheet, type BannerFormValues } from "./banner-sheet";

type SheetState = { mode: "add" | "edit"; banner?: HomeBanner };

function windowLabel(banner: HomeBanner): string {
  if (!banner.startAt && !banner.endAt) return "ตลอดเวลา";
  if (banner.startAt && banner.endAt) return `${formatThaiDate(banner.startAt)} – ${formatThaiDate(banner.endAt)}`;
  if (banner.startAt) return `เริ่ม ${formatThaiDate(banner.startAt)}`;
  return `ถึง ${formatThaiDate(banner.endAt as string)}`;
}

function liveNowInfo(banner: HomeBanner, today: string): { label: string; tone: StatusTone } {
  if (isBannerLiveNow(banner, today)) return { label: "แสดงอยู่บนหน้าแรกตอนนี้", tone: "positive" };
  if (banner.state === "published" && banner.endAt && banner.endAt < today) {
    return { label: "หมดช่วงเวลาแสดงผลแล้ว", tone: "critical" };
  }
  if (banner.state === "published" && banner.startAt && banner.startAt > today) {
    return { label: "ยังไม่ถึงช่วงเวลาแสดงผล", tone: "pending" };
  }
  if (banner.state === "scheduled") return { label: "ยังไม่เผยแพร่", tone: "pending" };
  return { label: "ไม่แสดงบนหน้าแรก", tone: "neutral" };
}

export default function BannersPage() {
  const [banners, setBanners] = useState<HomeBanner[]>(initialBanners);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({ mode: "add" });

  const sorted = useMemo(() => [...banners].sort((a, b) => a.order - b.order), [banners]);

  function openAdd() {
    setSheetState({ mode: "add" });
    setSheetOpen(true);
  }

  function openEdit(banner: HomeBanner) {
    setSheetState({ mode: "edit", banner });
    setSheetOpen(true);
  }

  function handleSubmit(values: BannerFormValues) {
    const title = values.title.trim();
    const base = {
      title,
      subtitle: values.subtitle.trim() || undefined,
      image: values.image.trim(),
      ctaLabel: values.ctaLabel.trim() || undefined,
      ctaHref: values.ctaHref.trim() || undefined,
      state: values.state,
      startAt: values.startAt.trim() || undefined,
      endAt: values.endAt.trim() || undefined,
    };

    if (sheetState.mode === "edit" && sheetState.banner) {
      const target = sheetState.banner;
      setBanners((prev) => prev.map((b) => (b.id === target.id ? { ...b, ...base } : b)));
      toast.success(`บันทึกการแก้ไขแบนเนอร์ "${title}" แล้ว`);
    } else {
      const newBanner: HomeBanner = {
        id: `banner-new-${banners.length + 1}`,
        order: banners.length + 1,
        ...base,
      };
      setBanners((prev) => [...prev, newBanner]);
      toast.success(`เพิ่มแบนเนอร์ "${title}" แล้ว`);
    }
    setSheetOpen(false);
  }

  function handleDelete(banner: HomeBanner) {
    setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    toast.success("ลบแบนเนอร์แล้ว", { description: banner.title });
  }

  function move(banner: HomeBanner, direction: "up" | "down") {
    const list = [...banners].sort((a, b) => a.order - b.order);
    const index = list.findIndex((b) => b.id === banner.id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= list.length) return;

    const a = list[index];
    const b = list[swapWith];
    setBanners((prev) =>
      prev.map((item) => {
        if (item.id === a.id) return { ...item, order: b.order };
        if (item.id === b.id) return { ...item, order: a.order };
        return item;
      }),
    );
  }

  const columns: Column<HomeBanner>[] = [
    {
      key: "order",
      header: "ลำดับ",
      width: "w-24",
      cell: (b) => {
        const index = sorted.findIndex((x) => x.id === b.id);
        return (
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs tabular-nums text-[var(--ink-subtle)]">{index + 1}</span>
            <div className="flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`เลื่อน "${b.title}" ขึ้น`}
                disabled={index === 0}
                onClick={() => move(b, "up")}
              >
                <ArrowUp className="size-3" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`เลื่อน "${b.title}" ลง`}
                disabled={index === sorted.length - 1}
                onClick={() => move(b, "down")}
              >
                <ArrowDown className="size-3" aria-hidden />
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      key: "thumbnail",
      header: "ภาพ",
      width: "w-20",
      cell: (b) => <BannerThumbnail src={b.image} />,
    },
    {
      key: "title",
      header: "ชื่อแบนเนอร์",
      truncate: "max-w-[28ch]",
      cell: (b) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{b.title}</p>
          {b.subtitle ? <p className="truncate text-xs text-[var(--ink-subtle)]">{b.subtitle}</p> : null}
        </div>
      ),
    },
    {
      key: "cta",
      header: "ปุ่ม",
      hideOnMobile: true,
      truncate: "max-w-[20ch]",
      cell: (b) => (b.ctaLabel ? `${b.ctaLabel} → ${b.ctaHref}` : "—"),
    },
    {
      key: "window",
      header: "ช่วงเวลาแสดงผล",
      hideOnMobile: true,
      cell: (b) => windowLabel(b),
    },
    {
      key: "state",
      header: "สถานะ",
      width: "w-32",
      cell: (b) => <StatusBadge label={publishStateLabel[b.state]} tone={publishStateTone[b.state]} />,
    },
    {
      key: "liveNow",
      header: "การแสดงผลตอนนี้",
      width: "w-40",
      cell: (b) => {
        const info = liveNowInfo(b, TODAY);
        return <StatusBadge label={info.label} tone={info.tone} />;
      },
    },
    {
      key: "actions",
      header: "จัดการ",
      align: "end",
      stickyEnd: true,
      cell: (b) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`จัดการแบนเนอร์ ${b.title}`}>
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openEdit(b)}>
              <Pencil className="size-4" aria-hidden />
              แก้ไข
            </DropdownMenuItem>
            <ConfirmDialog
              trigger={
                <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="size-4" aria-hidden />
                  ลบแบนเนอร์
                </DropdownMenuItem>
              }
              title={`ลบแบนเนอร์: ${b.title}`}
              description="แบนเนอร์นี้จะหายไปจากหน้าแรกทันที และไม่สามารถกู้คืนได้ในเซสชันนี้"
              confirmLabel="ลบแบนเนอร์"
              tone="destructive"
              onConfirm={() => handleDelete(b)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="แบนเนอร์หน้าแรก"
        description="ชุดสไลด์ที่แสดงบน Hero Banner ของหน้าแรกจริง เรียงจากบนลงล่างตามลำดับที่กำหนด — ลำดับ ภาพ และช่วงเวลาที่แก้ไขที่นี่คือสิ่งที่ผู้เรียนเห็นทันที"
        actions={
          <Button type="button" size="sm" onClick={openAdd}>
            <Plus className="size-4" aria-hidden />
            เพิ่มแบนเนอร์
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={sorted}
        rowKey={(b) => b.id}
        caption="รายการแบนเนอร์หน้าแรก เรียงตามลำดับการแสดงผล"
        empty={
          <EmptyState
            icon={LayoutPanelTop}
            title="ยังไม่มีแบนเนอร์ในระบบ"
            description="เพิ่มแบนเนอร์แรกด้วยปุ่ม “เพิ่มแบนเนอร์” ด้านบน เพื่อให้หน้าแรกมีสไลด์แสดงผล"
          />
        }
      />

      <BannerSheet
        open={sheetOpen}
        mode={sheetState.mode}
        banner={sheetState.banner}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function BannerThumbnail({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const trimmed = src.trim();

  if (!trimmed || failed) {
    return (
      <div
        className={cn(
          "flex aspect-video w-16 items-center justify-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-[var(--ink-subtle)]",
        )}
        aria-label={trimmed ? "ไม่พบไฟล์ภาพนี้ในระบบ" : "ยังไม่ได้ตั้งค่าภาพ"}
        title={trimmed ? "ไม่พบไฟล์ภาพนี้ในระบบ" : "ยังไม่ได้ตั้งค่าภาพ"}
      >
        <ImageOff className="size-3.5" aria-hidden />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-16 overflow-hidden rounded-md bg-[var(--surface-strong)]">
      <Image src={trimmed} alt="" fill sizes="64px" className="object-cover" onError={() => setFailed(true)} />
    </div>
  );
}
