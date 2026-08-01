"use client";

import { FileCode, FileText, ImageIcon, MoreHorizontal, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatThaiDate } from "@/lib/admin/format";
import { getStaffName } from "@/lib/admin/mock-data";
import type { MediaAsset } from "@/lib/admin/types";

const FILE_ICON: Record<MediaAsset["fileType"], LucideIcon> = {
  png: ImageIcon,
  jpg: ImageIcon,
  webp: ImageIcon,
  svg: FileCode,
  pdf: FileText,
};

type MediaTileProps = {
  asset: MediaAsset;
  onDelete: (id: string) => void;
};

export function MediaTile({ asset, onDelete }: MediaTileProps) {
  // Assets uploaded through the real site sit under a real public path and
  // render as an actual thumbnail. A few rows here model files the
  // prototype never received a real upload for (see the comment in
  // mock-pages.ts) — those get a clearly-labelled icon tile instead of a
  // broken <img>, same rule the rest of the back office follows for
  // missing catalogue images.
  const hasRealFile = asset.url.startsWith("/");
  const Icon = FILE_ICON[asset.fileType];

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
      <div className="relative aspect-[4/3] w-full bg-[var(--surface)]">
        {hasRealFile ? (
          // eslint-disable-next-line @next/next/no-img-element -- fixed-size thumbnail grid, not a page hero; next/image's overhead buys nothing here.
          <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--ink-subtle)]">
            <Icon className="size-8" aria-hidden />
            <span className="text-xs font-medium tracking-wide uppercase">{asset.fileType}</span>
            <span className="px-3 text-center text-[11px] leading-4 text-pretty">ไม่มีไฟล์จริงในต้นแบบนี้</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium" title={asset.filename}>
            {asset.filename}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label={`การดำเนินการสำหรับ ${asset.filename}`}>
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {asset.usedIn.length > 0 ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                      <Trash2 aria-hidden />
                      ลบ
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>ลบไฟล์นี้ไม่ได้</DialogTitle>
                      <DialogDescription className="leading-6 text-pretty">
                        &quot;{asset.filename}&quot; ยังถูกใช้งานอยู่ {asset.usedIn.length} จุด ต้องเลิกใช้งานจากทุกจุดก่อนจึงจะลบไฟล์นี้ได้
                      </DialogDescription>
                    </DialogHeader>
                    <ul className="list-disc space-y-1 ps-5 text-sm leading-6">
                      {asset.usedIn.map((usage) => (
                        <li key={usage}>{usage}</li>
                      ))}
                    </ul>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">ปิด</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                      <Trash2 aria-hidden />
                      ลบ
                    </DropdownMenuItem>
                  }
                  title={`ลบไฟล์ "${asset.filename}"`}
                  description="ไฟล์นี้ไม่ได้ถูกใช้งานในหน้าใดของเว็บไซต์ การลบจะนำออกจากคลังสื่อทันทีและกู้คืนไม่ได้ในต้นแบบนี้"
                  confirmLabel="ลบไฟล์"
                  tone="destructive"
                  onConfirm={() => onDelete(asset.id)}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-[var(--ink-subtle)]">
          {asset.size}
          {asset.dimensions ? ` · ${asset.dimensions}` : ""}
        </p>
        <p className="truncate text-xs text-[var(--ink-subtle)]">
          อัปโหลด {formatThaiDate(asset.uploadedAt)} · {getStaffName(asset.uploadedByStaffId)}
        </p>

        {asset.usedIn.length > 0 ? (
          <StatusBadge label={`ใช้งานอยู่ ${asset.usedIn.length} จุด`} tone="positive" />
        ) : (
          <StatusBadge label="ยังไม่ได้ใช้งาน" tone="neutral" />
        )}
      </div>
    </div>
  );
}
