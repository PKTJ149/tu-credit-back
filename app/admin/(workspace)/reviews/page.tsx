"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, MessageSquareWarning, MoreHorizontal, Star, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge, type StatusTone } from "@/components/admin/status-badge";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStaffSession } from "@/lib/admin/staff-session";
import { formatThaiDate } from "@/lib/admin/format";
import { getStudentName, TODAY } from "@/lib/admin/mock-data";
import type { Review, ReviewState } from "@/lib/admin/types";
import { getItemRatingAggregates, itemTypeLabel, reviews as initialReviews } from "@/lib/admin/mock-reports";
import { cn } from "@/lib/utils";

const STATE_LABEL: Record<ReviewState, string> = { pending: "รอตรวจ", published: "เผยแพร่แล้ว", hidden: "ซ่อนอยู่", removed: "ลบแล้ว" };
const STATE_TONE: Record<ReviewState, StatusTone> = { pending: "action", published: "positive", hidden: "neutral", removed: "critical" };

const STATE_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
  { value: "pending", label: STATE_LABEL.pending },
  { value: "published", label: STATE_LABEL.published },
  { value: "hidden", label: STATE_LABEL.hidden },
  { value: "removed", label: STATE_LABEL.removed },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`ให้คะแนน ${rating} จาก 5 ดาว`}>
      <span className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={cn("size-3.5", n <= rating ? "fill-[var(--primary)] text-[var(--primary)]" : "text-[var(--border)]")} />
        ))}
      </span>
      <span className="font-mono text-xs tabular-nums text-[var(--ink-muted)]">{rating}/5</span>
    </span>
  );
}

function reviewSortRank(state: ReviewState): number {
  return state === "pending" ? 0 : state === "published" ? 1 : state === "hidden" ? 2 : 3;
}

export default function ReviewsPage() {
  const { staff } = useStaffSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState(ALL_FILTER_VALUE);

  const ratingAggregates = useMemo(() => getItemRatingAggregates(reviews), [reviews]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews
      .filter((r) => stateFilter === ALL_FILTER_VALUE || r.state === stateFilter)
      .filter((r) => {
        if (!q) return true;
        const learner = getStudentName(r.studentId).toLowerCase();
        return learner.includes(q) || r.itemName.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const rankDiff = reviewSortRank(a.state) - reviewSortRank(b.state);
        if (rankDiff !== 0) return rankDiff;
        return a.submittedAt.localeCompare(b.submittedAt);
      });
  }, [reviews, search, stateFilter]);

  const pendingCount = reviews.filter((r) => r.state === "pending").length;

  function moderate(id: string, state: ReviewState, reason?: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, state, moderatedByStaffId: staff?.id, moderatedAt: TODAY, moderationNote: reason ?? r.moderationNote }
          : r,
      ),
    );
  }

  function handlePublish(review: Review) {
    moderate(review.id, "published");
    toast.success("เผยแพร่รีวิวแล้ว", { description: `${getStudentName(review.studentId)} · ${review.itemName}` });
  }

  function handleHide(review: Review, reason?: string) {
    if (!reason) return;
    moderate(review.id, "hidden", reason);
    toast("ซ่อนรีวิวแล้ว", { description: `${getStudentName(review.studentId)} · ${review.itemName}` });
  }

  function handleRemove(review: Review, reason?: string) {
    if (!reason) return;
    moderate(review.id, "removed", reason);
    toast.error("ลบรีวิวแล้ว", { description: `${getStudentName(review.studentId)} · ${review.itemName}` });
  }

  const columns: Column<Review>[] = [
    {
      key: "learner",
      header: "ผู้เรียน",
      width: "w-40",
      cell: (r) => getStudentName(r.studentId),
    },
    {
      key: "item",
      header: "รายการ",
      truncate: "max-w-[24ch]",
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate">{r.itemName}</p>
          <p className="text-xs text-[var(--ink-subtle)]">{itemTypeLabel[r.itemType]}</p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "คะแนน",
      width: "w-32",
      cell: (r) => <RatingStars rating={r.rating} />,
    },
    {
      key: "comment",
      header: "ความคิดเห็น",
      wrap: true,
      cell: (r) => <p className="max-w-[46ch] leading-6 text-pretty">{r.comment}</p>,
    },
    {
      key: "submittedAt",
      header: "วันที่ส่ง",
      width: "w-28",
      hideOnMobile: true,
      cell: (r) => formatThaiDate(r.submittedAt),
    },
    {
      key: "state",
      header: "สถานะ",
      width: "w-28",
      cell: (r) => <StatusBadge label={STATE_LABEL[r.state]} tone={STATE_TONE[r.state]} />,
    },
    {
      key: "actions",
      header: <span className="sr-only">การดำเนินการ</span>,
      align: "end",
      width: "w-12",
      stickyEnd: true,
      cell: (r) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label={`การดำเนินการสำหรับรีวิวของ ${getStudentName(r.studentId)}`}>
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {r.state !== "published" ? (
                <DropdownMenuItem onSelect={() => handlePublish(r)}>
                  <Eye aria-hidden />
                  เผยแพร่
                </DropdownMenuItem>
              ) : null}

              {r.state !== "hidden" ? (
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                      <EyeOff aria-hidden />
                      ซ่อน
                    </DropdownMenuItem>
                  }
                  title="ยืนยันการซ่อนรีวิว"
                  description={`รีวิวนี้จะไม่แสดงบนหน้าเว็บฝั่งผู้เรียนอีกจนกว่าจะถูกเผยแพร่ใหม่ ระบุเหตุผลเพื่อบันทึกไว้ในประวัติการตรวจสอบ`}
                  confirmLabel="ซ่อนรีวิว"
                  reason={{
                    label: "เหตุผลที่ซ่อน",
                    placeholder: "เช่น รอตรวจสอบข้อเท็จจริงเพิ่มเติมกับผู้สอน",
                    required: true,
                  }}
                  onConfirm={(reason) => handleHide(r, reason)}
                />
              ) : null}

              {r.state !== "removed" ? (
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()}>
                      <Trash2 aria-hidden />
                      ลบ
                    </DropdownMenuItem>
                  }
                  title="ยืนยันการลบรีวิว"
                  description="รีวิวนี้จะถูกลบออกจากระบบอย่างถาวรและจะไม่แสดงบนหน้าเว็บฝั่งผู้เรียนอีก ระบุเหตุผลเพื่อบันทึกไว้ในประวัติการตรวจสอบ"
                  confirmLabel="ลบรีวิว"
                  tone="destructive"
                  reason={{
                    label: "เหตุผลที่ลบ",
                    placeholder: "เช่น เนื้อหาไม่เกี่ยวข้องกับรายวิชาหรือเป็นการโฆษณาแอบแฝง",
                    required: true,
                  }}
                  onConfirm={(reason) => handleRemove(r, reason)}
                />
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="คิวตรวจรีวิว"
        description={
          pendingCount > 0
            ? `มี ${pendingCount} รีวิวรอการตรวจสอบ จัดเรียงไว้บนสุด`
            : "ไม่มีรีวิวค้างตรวจสอบ — รีวิวใหม่จากผู้เรียนที่เคยลงทะเบียนจริงเท่านั้นจะปรากฏที่นี่"
        }
      />

      <Panel title="คะแนนเฉลี่ยต่อรายการ" description="คำนวณจากรีวิวที่เผยแพร่แล้วเท่านั้น — เป็นค่าเดียวกับที่หน้าเว็บฝั่งผู้เรียนจะแสดง" flush>
        <div className="p-5">
          <DataTable
            columns={[
              {
                key: "item",
                header: "รายการ",
                truncate: "max-w-[32ch]",
                cell: (a) => (
                  <div className="min-w-0">
                    <p className="truncate">{a.itemName}</p>
                    <p className="text-xs text-[var(--ink-subtle)]">{itemTypeLabel[a.itemType]}</p>
                  </div>
                ),
              },
              { key: "rating", header: "คะแนนเฉลี่ย", width: "w-40", cell: (a) => <RatingStars rating={Math.round(a.average * 10) / 10} /> },
              { key: "count", header: "จำนวนรีวิว", align: "end", width: "w-28", cell: (a) => <span className="font-mono tabular-nums">{a.count}</span> },
            ]}
            rows={ratingAggregates}
            rowKey={(a) => `${a.itemType}-${a.itemId}`}
            caption="คะแนนเฉลี่ยต่อรายการ"
            empty={
              <EmptyState icon={MessageSquareWarning} title="ยังไม่มีรีวิวที่เผยแพร่" description="เมื่อเผยแพร่รีวิวอย่างน้อยหนึ่งรายการ คะแนนเฉลี่ยจะปรากฏที่นี่" />
            }
          />
        </div>
      </Panel>

      <Panel flush>
        <div className="border-b border-[var(--border)] px-5 py-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchLabel="ค้นหารีวิว"
            searchPlaceholder="ค้นหาชื่อผู้เรียน รายการ หรือข้อความ"
            filters={[{ id: "state", label: "สถานะ", value: stateFilter, onChange: setStateFilter, options: STATE_FILTER_OPTIONS }]}
            resultSummary={`แสดง ${filtered.length} จาก ${reviews.length} รายการ`}
            onReset={() => {
              setSearch("");
              setStateFilter(ALL_FILTER_VALUE);
            }}
          />
        </div>
        <div className="p-5 pt-4">
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={(r) => r.id}
            caption="คิวตรวจรีวิว"
            empty={<EmptyState icon={MessageSquareWarning} title="ไม่พบรีวิวที่ตรงกับตัวกรอง" description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง" />}
          />
        </div>
      </Panel>
    </>
  );
}
