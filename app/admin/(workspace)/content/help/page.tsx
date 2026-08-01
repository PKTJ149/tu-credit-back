"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LifeBuoy, MoreHorizontal, Pencil, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatThaiDate } from "@/lib/admin/format";
import { TODAY } from "@/lib/admin/mock-data";
import {
  helpArticles as initialHelpArticles,
  helpCategoryDescription,
  helpCategoryLabel,
  helpCategoryOrder,
  nextHelpArticleId,
  publishStateLabel,
  publishStateTone,
  topViewedArticleId,
} from "@/lib/admin/mock-pages";
import type { HelpArticle } from "@/lib/admin/types";
import { HelpArticleSheet, type HelpArticleFormValues } from "./help-article-sheet";
import { ReorderControls } from "@/components/admin/reorder-controls";

/** Re-index one category's `order` field to a contiguous 1..n after any
 *  reorder, add, or cross-category move — so a gap left behind by an article
 *  that moved out never has to be reasoned about anywhere else. */
function renumberCategory(articles: HelpArticle[], categoryId: string): HelpArticle[] {
  const inCategory = [...articles].filter((a) => a.categoryId === categoryId).sort((a, b) => a.order - b.order);
  const rest = articles.filter((a) => a.categoryId !== categoryId);
  const renumbered = inCategory.map((a, i) => ({ ...a, order: i + 1 }));
  return [...rest, ...renumbered];
}

function nextOrderIn(articles: HelpArticle[], categoryId: string): number {
  const inCategory = articles.filter((a) => a.categoryId === categoryId);
  return inCategory.length === 0 ? 1 : Math.max(...inCategory.map((a) => a.order)) + 1;
}

type SheetState = { mode: "add" | "edit"; article?: HelpArticle; defaultCategoryId?: string };

export default function HelpCenterPage() {
  const [articles, setArticles] = useState<HelpArticle[]>(initialHelpArticles);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState(ALL_FILTER_VALUE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({ mode: "add" });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((a) => {
      if (stateFilter !== ALL_FILTER_VALUE && a.state !== stateFilter) return false;
      if (!query) return true;
      return a.question.toLowerCase().includes(query) || a.answer.toLowerCase().includes(query);
    });
  }, [articles, search, stateFilter]);

  const filters: ToolbarFilter[] = [
    {
      id: "state",
      label: "สถานะ",
      value: stateFilter,
      options: [
        { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
        { value: "draft", label: publishStateLabel.draft },
        { value: "published", label: publishStateLabel.published },
        { value: "archived", label: publishStateLabel.archived },
      ],
      onChange: setStateFilter,
    },
  ];

  function resetFilters() {
    setSearch("");
    setStateFilter(ALL_FILTER_VALUE);
  }

  function openAdd(categoryId: string) {
    setSheetState({ mode: "add", defaultCategoryId: categoryId });
    setSheetOpen(true);
  }

  function openEdit(article: HelpArticle) {
    setSheetState({ mode: "edit", article });
    setSheetOpen(true);
  }

  function moveArticle(categoryId: string, articleId: string, direction: "up" | "down") {
    setArticles((prev) => {
      const inCategory = [...prev].filter((a) => a.categoryId === categoryId).sort((a, b) => a.order - b.order);
      const index = inCategory.findIndex((a) => a.id === articleId);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || swapWith < 0 || swapWith >= inCategory.length) return prev;

      const a = inCategory[index];
      const b = inCategory[swapWith];
      return prev.map((article) => {
        if (article.id === a.id) return { ...article, order: b.order };
        if (article.id === b.id) return { ...article, order: a.order };
        return article;
      });
    });
  }

  function handleSubmit(values: HelpArticleFormValues) {
    if (sheetState.mode === "edit" && sheetState.article) {
      const target = sheetState.article;
      const changingCategory = values.categoryId !== target.categoryId;

      setArticles((prev) => {
        let next = prev.map((a) =>
          a.id === target.id
            ? {
                ...a,
                categoryId: values.categoryId,
                question: values.question.trim(),
                answer: values.answer.trim(),
                state: values.state,
                order: changingCategory ? nextOrderIn(prev, values.categoryId) : a.order,
                updatedAt: TODAY,
              }
            : a,
        );
        if (changingCategory) next = renumberCategory(next, target.categoryId);
        return next;
      });

      toast.success(
        changingCategory
          ? `ย้ายบทความไปหมวด "${helpCategoryLabel[values.categoryId]}" แล้ว`
          : `บันทึกการแก้ไขบทความแล้ว`,
      );
    } else {
      setArticles((prev) => {
        const newArticle: HelpArticle = {
          id: nextHelpArticleId(),
          categoryId: values.categoryId,
          question: values.question.trim(),
          answer: values.answer.trim(),
          state: values.state,
          order: nextOrderIn(prev, values.categoryId),
          updatedAt: TODAY,
          viewCount: 0,
        };
        return [...prev, newArticle];
      });
      toast.success(`เพิ่มบทความในหมวด "${helpCategoryLabel[values.categoryId]}" แล้ว`);
    }
    setSheetOpen(false);
  }

  const visibleCategories = helpCategoryOrder.filter((id) => filtered.some((a) => a.categoryId === id));

  return (
    <>
      <PageHeader
        title="ศูนย์ช่วยเหลือ"
        description="จัดการคำถามที่พบบ่อยตามหมวดหมู่ที่ผู้เรียนเห็นในหน้าศูนย์ช่วยเหลือจริง"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาบทความ"
        searchPlaceholder="ค้นหาคำถามหรือคำตอบ"
        filters={filters}
        onReset={resetFilters}
        resultSummary={`แสดง ${filtered.length} จาก ${articles.length} บทความ`}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="ไม่พบบทความที่ตรงกับตัวกรองนี้"
          description="ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
        />
      ) : (
        <div className="space-y-4">
          {visibleCategories.map((categoryId) => {
            const rows = filtered.filter((a) => a.categoryId === categoryId).sort((a, b) => a.order - b.order);
            const topViewed = topViewedArticleId(categoryId, articles);

            const columns: Column<HelpArticle>[] = [
              {
                key: "order",
                header: "ลำดับ",
                width: "w-24",
                cell: (row) => (
                  <ReorderControls
                    position={row.order}
                    itemLabel={row.question}
                    canMoveUp={row.order > 1}
                    canMoveDown={row.order < rows.length}
                    onMoveUp={() => moveArticle(categoryId, row.id, "up")}
                    onMoveDown={() => moveArticle(categoryId, row.id, "down")}
                  />
                ),
              },
              {
                key: "question",
                header: "คำถาม",
                cell: (row) => (
                  <span className="flex max-w-[46ch] items-center gap-2">
                    <span className="truncate">{row.question}</span>
                    {topViewed === row.id && row.order !== 1 ? (
                      <StatusBadge label="เข้าชมสูงสุดในหมวดนี้" tone="action" className="shrink-0" />
                    ) : null}
                  </span>
                ),
              },
              {
                key: "viewCount",
                header: "ยอดเข้าชม",
                align: "end",
                width: "w-28",
                cell: (row) => <span className="font-mono">{row.viewCount.toLocaleString("th-TH")}</span>,
              },
              {
                key: "state",
                header: "สถานะ",
                width: "w-32",
                cell: (row) => <StatusBadge label={publishStateLabel[row.state]} tone={publishStateTone[row.state]} />,
              },
              {
                key: "updatedAt",
                header: "แก้ไขล่าสุด",
                hideOnMobile: true,
                width: "w-28",
                cell: (row) => formatThaiDate(row.updatedAt),
              },
              {
                key: "actions",
                header: <span className="sr-only">การดำเนินการ</span>,
                align: "end",
                width: "w-12",
                stickyEnd: true,
                cell: (row) => (
                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost" aria-label={`การดำเนินการสำหรับบทความ "${row.question}"`}>
                          <MoreHorizontal aria-hidden />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onSelect={() => openEdit(row)}>
                          <Pencil aria-hidden />
                          แก้ไข / ย้ายหมวด
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ),
              },
            ];

            return (
              <Panel
                key={categoryId}
                title={helpCategoryLabel[categoryId]}
                description={`${helpCategoryDescription[categoryId]} · ${rows.length} บทความ`}
                actions={
                  <Button size="sm" variant="outline" onClick={() => openAdd(categoryId)}>
                    เพิ่มบทความ
                  </Button>
                }
                flush
              >
                <DataTable
                  columns={columns}
                  rows={rows}
                  rowKey={(row) => row.id}
                  caption={`บทความในหมวด ${helpCategoryLabel[categoryId]}`}
                  empty={
                    <EmptyState
                      icon={LifeBuoy}
                      title="ไม่มีบทความในหมวดนี้"
                      description="เพิ่มบทความแรกของหมวดนี้ด้วยปุ่มด้านบน"
                    />
                  }
                />
              </Panel>
            );
          })}
        </div>
      )}

      <TrendingUpHint />

      <HelpArticleSheet
        open={sheetOpen}
        mode={sheetState.mode}
        article={sheetState.article}
        defaultCategoryId={sheetState.defaultCategoryId}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}

/** Sits below the category list, out of the way, so the meaning of the
 *  "เข้าชมสูงสุดในหมวดนี้" tag on a table row is one glance away instead of
 *  requiring the officer to already know the convention. */
function TrendingUpHint() {
  return (
    <p className="flex items-center gap-1.5 text-xs text-[var(--ink-subtle)]">
      <TrendingUp className="size-3.5 shrink-0" aria-hidden />
      แท็ก &quot;เข้าชมสูงสุดในหมวดนี้&quot; หมายถึงบทความที่ผู้เรียนเปิดดูมากที่สุดในหมวด แต่ยังไม่ได้อยู่ลำดับแรก — ควรพิจารณาเลื่อนขึ้น
    </p>
  );
}
