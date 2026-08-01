"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Megaphone, Send } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge, type StatusTone } from "@/components/admin/status-badge";
import { FormErrorSummary } from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatThaiDate } from "@/lib/admin/format";
import { academicTerms, TODAY } from "@/lib/admin/mock-data";
import { useStaffSession } from "@/lib/admin/staff-session";
import type { Announcement, AnnouncementAudience } from "@/lib/admin/types";
import {
  announcementAudienceLabel,
  announcementChannelLabel,
  announcements as initialAnnouncements,
  nextAnnouncementId,
  resolveAnnouncementRecipients,
} from "@/lib/admin/mock-reports";
import { programs } from "@/lib/data/programs";
import { subjects } from "@/lib/data/subjects";

type Channel = "in-app" | "email";

const AUDIENCES: AnnouncementAudience[] = ["all", "program", "subject", "term"];
const CHANNELS: Channel[] = ["in-app", "email"];

const STATE_LABEL: Record<Announcement["state"], string> = { draft: "ฉบับร่าง", scheduled: "ตั้งเวลาส่ง", sent: "ส่งแล้ว" };
const STATE_TONE: Record<Announcement["state"], StatusTone> = { draft: "neutral", scheduled: "pending", sent: "positive" };

function emptyForm() {
  return { title: "", body: "", audience: "all" as AnnouncementAudience, targetId: "", channels: ["in-app"] as Channel[] };
}

export default function AnnouncementsPage() {
  const { staff } = useStaffSession();
  const [list, setList] = useState<Announcement[]>(initialAnnouncements);
  const [form, setForm] = useState(emptyForm());
  const [touched, setTouched] = useState(false);

  const needsTarget = form.audience !== "all";
  const targetOptions = useMemo(() => {
    if (form.audience === "program") return programs.map((p) => ({ value: p.id, label: p.name }));
    if (form.audience === "subject") return subjects.map((s) => ({ value: s.id, label: s.name }));
    if (form.audience === "term") return academicTerms.map((t) => ({ value: t.name, label: t.name }));
    return [];
  }, [form.audience]);

  const recipientCount = resolveAnnouncementRecipients(form.audience, form.audience === "all" ? undefined : form.targetId || undefined);

  const errors = {
    title: form.title.trim() === "" ? "กรุณาระบุหัวข้อประกาศ" : undefined,
    body: form.body.trim() === "" ? "กรุณาระบุเนื้อหาประกาศ" : undefined,
    target: needsTarget && form.targetId === "" ? "กรุณาเลือกเป้าหมายของประกาศ" : undefined,
    channels: form.channels.length === 0 ? "กรุณาเลือกช่องทางอย่างน้อยหนึ่งช่องทาง" : undefined,
  };
  const errorCount = Object.values(errors).filter(Boolean).length;

  function toggleChannel(channel: Channel, checked: boolean) {
    setForm((f) => ({ ...f, channels: checked ? [...f.channels, channel] : f.channels.filter((c) => c !== channel) }));
  }

  function resetForm() {
    setForm(emptyForm());
    setTouched(false);
  }

  function handleSaveDraft(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (errorCount > 0) return;
    const draft: Announcement = {
      id: nextAnnouncementId(),
      title: form.title.trim(),
      body: form.body.trim(),
      audience: form.audience,
      targetId: needsTarget ? form.targetId : undefined,
      channels: form.channels,
      state: "draft",
      createdByStaffId: staff?.id ?? "",
      recipientCount,
    };
    setList((prev) => [draft, ...prev]);
    toast.success("บันทึกฉบับร่างแล้ว", { description: draft.title });
    resetForm();
  }

  function handleSend() {
    if (errorCount > 0) {
      setTouched(true);
      return;
    }
    const sent: Announcement = {
      id: nextAnnouncementId(),
      title: form.title.trim(),
      body: form.body.trim(),
      audience: form.audience,
      targetId: needsTarget ? form.targetId : undefined,
      channels: form.channels,
      state: "sent",
      sentAt: TODAY,
      createdByStaffId: staff?.id ?? "",
      recipientCount,
    };
    setList((prev) => [sent, ...prev]);
    toast.success(`ส่งประกาศถึงผู้เรียน ${recipientCount} คนแล้ว`, { description: sent.title });
    resetForm();
  }

  const audienceDescription =
    form.audience === "all"
      ? targetSentence(recipientCount)
      : needsTarget && form.targetId
        ? targetSentence(recipientCount)
        : "เลือกเป้าหมายเพื่อดูจำนวนผู้เรียนที่จะได้รับประกาศนี้";

  function targetSentence(count: number) {
    return `ส่งถึงผู้เรียน ${count} คน`;
  }

  const columns: Column<Announcement>[] = [
    {
      key: "title",
      header: "หัวข้อประกาศ",
      truncate: "max-w-[32ch]",
      cell: (a) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{a.title}</p>
          <p className="truncate text-xs text-[var(--ink-subtle)]">{announcementAudienceLabel[a.audience]}</p>
        </div>
      ),
    },
    {
      key: "recipientCount",
      header: "ผู้รับ",
      align: "end",
      width: "w-24",
      cell: (a) => <span className="font-mono tabular-nums">{a.recipientCount}</span>,
    },
    {
      key: "channels",
      header: "ช่องทาง",
      width: "w-40",
      hideOnMobile: true,
      cell: (a) => a.channels.map((c) => announcementChannelLabel[c]).join(" · "),
    },
    { key: "state", header: "สถานะ", width: "w-32", cell: (a) => <StatusBadge label={STATE_LABEL[a.state]} tone={STATE_TONE[a.state]} /> },
    {
      key: "date",
      header: "วันที่ส่ง/ตั้งเวลา",
      width: "w-32",
      cell: (a) => (a.sentAt ? formatThaiDate(a.sentAt) : a.scheduledAt ? formatThaiDate(a.scheduledAt) : "—"),
    },
  ];

  return (
    <>
      <PageHeader title="ประกาศถึงผู้เรียน" description="เขียนประกาศส่งถึงผู้เรียนทั้งหมด หรือกลุ่มเป้าหมายเฉพาะหลักสูตร รายวิชา หรือภาคการศึกษา" />

      <Panel title="เขียนประกาศใหม่">
        <form onSubmit={handleSaveDraft} className="flex flex-col gap-4">
          <FormErrorSummary count={touched ? errorCount : 0} />

          <div className="space-y-1.5">
            <Label htmlFor="ann-title">
              หัวข้อประกาศ<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="ann-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="เช่น แจ้งเปลี่ยนแปลงตารางเรียน"
              aria-invalid={touched && Boolean(errors.title)}
              aria-describedby={touched && errors.title ? "ann-title-error" : undefined}
            />
            {touched && errors.title ? (
              <p id="ann-title-error" className="text-sm text-[var(--destructive)]">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ann-body">
              เนื้อหาประกาศ<span className="ms-1 text-[var(--destructive)]">*</span>
            </Label>
            <Textarea
              id="ann-body"
              rows={5}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="รายละเอียดที่ต้องการแจ้งผู้เรียน"
              aria-invalid={touched && Boolean(errors.body)}
              aria-describedby={touched && errors.body ? "ann-body-error" : undefined}
            />
            {touched && errors.body ? (
              <p id="ann-body-error" className="text-sm text-[var(--destructive)]">
                {errors.body}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ann-audience">กลุ่มเป้าหมาย</Label>
              <Select
                value={form.audience}
                onValueChange={(v) => setForm((f) => ({ ...f, audience: v as AnnouncementAudience, targetId: "" }))}
              >
                <SelectTrigger id="ann-audience" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {announcementAudienceLabel[a]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsTarget ? (
              <div className="space-y-1.5">
                <Label htmlFor="ann-target">
                  {form.audience === "program" ? "หลักสูตร" : form.audience === "subject" ? "รายวิชา" : "ภาคการศึกษา"}
                  <span className="ms-1 text-[var(--destructive)]">*</span>
                </Label>
                <Select value={form.targetId} onValueChange={(v) => setForm((f) => ({ ...f, targetId: v }))}>
                  <SelectTrigger id="ann-target" className="w-full" aria-invalid={touched && Boolean(errors.target)}>
                    <SelectValue placeholder="เลือกเป้าหมาย" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched && errors.target ? <p className="text-sm text-[var(--destructive)]">{errors.target}</p> : null}
              </div>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">ช่องทางการส่ง</Label>
            <div className="flex flex-wrap gap-4">
              {CHANNELS.map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={form.channels.includes(c)} onCheckedChange={(v) => toggleChannel(c, v === true)} />
                  {announcementChannelLabel[c]}
                </label>
              ))}
            </div>
            {touched && errors.channels ? <p className="text-sm text-[var(--destructive)]">{errors.channels}</p> : null}
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
            <p className="font-medium">{audienceDescription}</p>
            <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
              จำนวนนี้คำนวณจากรายการลงทะเบียนจริงในระบบ ณ ขณะนี้ อาจเปลี่ยนแปลงได้หากมีการลงทะเบียนเพิ่มก่อนส่งจริง
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
            <Button type="submit" variant="outline">
              บันทึกฉบับร่าง
            </Button>
            {errorCount === 0 ? (
              <ConfirmDialog
                trigger={
                  <Button type="button">
                    <Send className="size-4" aria-hidden />
                    ส่งประกาศทันที
                  </Button>
                }
                title="ยืนยันการส่งประกาศ"
                description={`ระบบจะส่งประกาศ "${form.title}" ถึง${announcementAudienceLabel[form.audience]} รวม ${recipientCount} คน ทันที และจะไม่สามารถแก้ไขหรือยกเลิกได้หลังส่ง`}
                confirmLabel="ส่งประกาศ"
                onConfirm={handleSend}
              />
            ) : (
              <Button type="button" onClick={() => setTouched(true)}>
                <Send className="size-4" aria-hidden />
                ส่งประกาศทันที
              </Button>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="ประกาศทั้งหมด" flush>
        <div className="p-5">
          <DataTable
            columns={columns}
            rows={list}
            rowKey={(a) => a.id}
            caption="ประกาศถึงผู้เรียนทั้งหมด"
            empty={<EmptyState icon={Megaphone} title="ยังไม่มีประกาศ" description="เมื่อบันทึกฉบับร่างหรือส่งประกาศ รายการจะปรากฏที่นี่" />}
          />
        </div>
      </Panel>
    </>
  );
}
