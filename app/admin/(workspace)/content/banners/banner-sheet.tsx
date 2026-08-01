"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ImageOff } from "lucide-react";
import Image from "next/image";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { publishStateLabel } from "@/lib/admin/mock-content";
import { publishStateLearnerEffect } from "@/lib/admin/publish-state";
import type { HomeBanner, PublishState } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export type BannerFormValues = {
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  state: PublishState;
  startAt: string;
  endAt: string;
};

type BannerSheetProps = {
  open: boolean;
  mode: "add" | "edit";
  banner?: HomeBanner;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BannerFormValues) => void;
};

function emptyValues(): BannerFormValues {
  return { title: "", subtitle: "", image: "", ctaLabel: "", ctaHref: "", state: "draft", startAt: "", endAt: "" };
}

function valuesFromBanner(banner: HomeBanner): BannerFormValues {
  return {
    title: banner.title,
    subtitle: banner.subtitle ?? "",
    image: banner.image,
    ctaLabel: banner.ctaLabel ?? "",
    ctaHref: banner.ctaHref ?? "",
    state: banner.state,
    startAt: banner.startAt ?? "",
    endAt: banner.endAt ?? "",
  };
}

const STATE_OPTIONS = Object.keys(publishStateLabel) as PublishState[];

/** Add/edit form for one homepage banner. A side sheet, not a modal — this is
 *  a correction to one carousel slide, not a takeover of the screen. */
export function BannerSheet({ open, mode, banner, onOpenChange, onSubmit }: BannerSheetProps) {
  const [values, setValues] = useState<BannerFormValues>(() =>
    mode === "edit" && banner ? valuesFromBanner(banner) : emptyValues(),
  );
  const [touched, setTouched] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(mode === "edit" && banner ? valuesFromBanner(banner) : emptyValues());
      setTouched(false);
      setImageFailed(false);
    }
  }

  const errors = {
    title: values.title.trim() === "" ? "กรุณาระบุชื่อแบนเนอร์" : undefined,
    ctaLabel: values.ctaHref.trim() !== "" && values.ctaLabel.trim() === "" ? "กรุณาระบุข้อความบนปุ่ม เมื่อมีลิงก์ปลายทางแล้ว" : undefined,
    ctaHref: values.ctaLabel.trim() !== "" && values.ctaHref.trim() === "" ? "กรุณาระบุลิงก์ปลายทาง เมื่อมีข้อความบนปุ่มแล้ว" : undefined,
    endAt:
      values.startAt.trim() !== "" && values.endAt.trim() !== "" && values.endAt < values.startAt
        ? "วันสิ้นสุดต้องอยู่หลังวันเริ่มแสดงผล"
        : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;
    onSubmit(values);
  }

  const trimmedImage = values.image.trim();
  const showImagePlaceholder = !trimmedImage || imageFailed;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "เพิ่มแบนเนอร์หน้าแรก" : "แก้ไขแบนเนอร์"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "แบนเนอร์ใหม่จะต่อท้ายลำดับปัจจุบัน ปรับลำดับได้ภายหลังจากรายการ"
              : "การเปลี่ยนแปลงนี้จะมีผลกับหน้าแรกทันทีที่บันทึก หากอยู่ในสถานะเผยแพร่และอยู่ในช่วงเวลาแสดงผล"}
          </SheetDescription>
        </SheetHeader>

        <form id="banner-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="banner-title">
              ชื่อแบนเนอร์<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="banner-title"
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              placeholder="เช่น สะสมหน่วยกิตให้กลายเป็นความสำเร็จที่จับต้องได้"
              aria-invalid={touched && Boolean(errors.title)}
              aria-describedby={touched && errors.title ? "banner-title-error" : undefined}
            />
            {touched && errors.title ? (
              <p id="banner-title-error" className="text-sm text-[var(--destructive)]">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="banner-subtitle">คำโปรยรอง</Label>
            <Input
              id="banner-subtitle"
              value={values.subtitle}
              onChange={(e) => setValues((v) => ({ ...v, subtitle: e.target.value }))}
              placeholder="ข้อความสั้น ๆ ใต้หัวข้อหลัก"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="banner-image">ภาพแบนเนอร์ (URL)</Label>
            <Input
              id="banner-image"
              value={values.image}
              onChange={(e) => {
                setValues((v) => ({ ...v, image: e.target.value }));
                setImageFailed(false);
              }}
              placeholder="/images/banners/example.png"
            />
            {showImagePlaceholder ? (
              <div className="flex aspect-[21/9] w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-[var(--ink-subtle)]">
                <ImageOff className="size-5" aria-hidden />
                <span className="text-xs font-medium">{trimmedImage ? "ไม่พบไฟล์ภาพนี้ในระบบ" : "ยังไม่ได้ตั้งค่าภาพ"}</span>
              </div>
            ) : (
              <div className={cn("relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-[var(--surface-strong)]")}>
                <Image
                  src={trimmedImage}
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover"
                  onError={() => setImageFailed(true)}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="banner-cta-label">ข้อความบนปุ่ม</Label>
              <Input
                id="banner-cta-label"
                value={values.ctaLabel}
                onChange={(e) => setValues((v) => ({ ...v, ctaLabel: e.target.value }))}
                placeholder="เช่น สำรวจหลักสูตร"
                aria-invalid={touched && Boolean(errors.ctaLabel)}
                aria-describedby={touched && errors.ctaLabel ? "banner-cta-label-error" : undefined}
              />
              {touched && errors.ctaLabel ? <p className="text-sm text-[var(--destructive)]">{errors.ctaLabel}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="banner-cta-href">ลิงก์ปลายทาง</Label>
              <Input
                id="banner-cta-href"
                value={values.ctaHref}
                onChange={(e) => setValues((v) => ({ ...v, ctaHref: e.target.value }))}
                placeholder="/programs"
                aria-invalid={touched && Boolean(errors.ctaHref)}
                aria-describedby={touched && errors.ctaHref ? "banner-cta-href-error" : undefined}
              />
              {touched && errors.ctaHref ? <p className="text-sm text-[var(--destructive)]">{errors.ctaHref}</p> : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="banner-state">สถานะ</Label>
            <Select value={values.state} onValueChange={(v) => setValues((s) => ({ ...s, state: v as PublishState }))}>
              <SelectTrigger id="banner-state" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {publishStateLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p aria-live="polite" className="text-xs leading-5 text-[var(--ink-muted)]">
              {publishStateLearnerEffect[values.state]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="banner-start">เริ่มแสดงผล</Label>
              <Input
                id="banner-start"
                type="date"
                value={values.startAt}
                onChange={(e) => setValues((v) => ({ ...v, startAt: e.target.value }))}
              />
              <p className="text-xs text-[var(--ink-subtle)]">เว้นว่างหากต้องการให้แสดงผลทันทีที่เผยแพร่</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="banner-end">สิ้นสุดการแสดงผล</Label>
              <Input
                id="banner-end"
                type="date"
                value={values.endAt}
                onChange={(e) => setValues((v) => ({ ...v, endAt: e.target.value }))}
                aria-invalid={touched && Boolean(errors.endAt)}
              />
              {touched && errors.endAt ? <p className="text-sm text-[var(--destructive)]">{errors.endAt}</p> : null}
              <p className="text-xs text-[var(--ink-subtle)]">เว้นว่างหากต้องการให้แสดงผลตลอดไป</p>
            </div>
          </div>
        </form>

        <SheetFooter>
          <Button type="submit" form="banner-form">
            บันทึก
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
