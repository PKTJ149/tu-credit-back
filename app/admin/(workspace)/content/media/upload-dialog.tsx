"use client";

import { UploadCloud } from "lucide-react";

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
import { Label } from "@/components/ui/label";

/** The upload affordance a media library needs — kept honest about what this
 *  prototype actually does. There is no storage backend behind it, so the
 *  drop zone and file input stay visibly disabled rather than pretending an
 *  upload would go anywhere. */
export function UploadDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <UploadCloud className="size-4" aria-hidden />
          อัปโหลดไฟล์
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>อัปโหลดไฟล์ใหม่</DialogTitle>
          <DialogDescription className="leading-6 text-pretty">
            ต้นแบบนี้ยังไม่เชื่อมต่อพื้นที่จัดเก็บไฟล์จริง ไฟล์ทุกรายการในคลังสื่อตอนนี้เป็นข้อมูลจำลองเพื่อสาธิตรูปแบบการทำงานเท่านั้น
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="media-upload-input">เลือกไฟล์</Label>
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
            <UploadCloud className="size-6 text-[var(--ink-subtle)]" aria-hidden />
            <p className="text-sm text-[var(--ink-muted)]">ลากไฟล์มาวาง หรือกดเพื่อเลือกไฟล์</p>
            <input id="media-upload-input" type="file" disabled className="text-xs text-[var(--ink-subtle)]" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ปิด</Button>
          </DialogClose>
          <Button disabled>อัปโหลด</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
