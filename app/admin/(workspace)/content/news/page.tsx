"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Archive, Copy, MoreHorizontal, Newspaper, Plus, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStaffName, TODAY } from "@/lib/admin/mock-data";
import {
  contentCategoryLabel,
  newsArticles as initialArticles,
  publishStateLabel,
  publishStateTone,
} from "@/lib/admin/mock-content";
import type { NewsArticle, PublishState } from "@/lib/admin/types";
import { formatThaiDate } from "@/lib/admin/format";

export default function NewsListPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_FILTER_VALUE);
  const [state, setState] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return articles.filter((a) => {
      if (term && !a.title.toLowerCase().includes(term)) return false;
      if (category !== ALL_FILTER_VALUE && a.category !== category) return false;
      if (state !== ALL_FILTER_VALUE && a.state !== state) return false;
      return true;
    });
  }, [articles, search, category, state]);

  const isFiltered = search.trim() !== "" || category !== ALL_FILTER_VALUE || state !== ALL_FILTER_VALUE;

  function duplicateArticle(article: NewsArticle) {
    const copy: NewsArticle = {
      ...article,
      id: `news-copy-${articles.length + 1}`,
      slug: `${article.slug}-copy`,
      title: `${article.title} (สำเนา)`,
      state: "draft",
      publishAt: undefined,
      updatedAt: TODAY,
    };
    setArticles((prev) => [copy, ...prev]);
    toast.success("ทำสำเนาเป็นแบบร่างใหม่แล้ว", { description: copy.title });
  }

  function setArticleState(article: NewsArticle, next: PublishState) {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === article.id
          ? { ...a, state: next, publishAt: next === "published" ? (a.publishAt ?? TODAY) : a.publishAt, updatedAt: TODAY }
          : a,
      ),
    );
    toast.success(`เปลี่ยนสถานะ "${article.title}" เป็น "${publishStateLabel[next]}" แล้ว`);
  }

  const columns: Column<NewsArticle>[] = [
    {
      key: "title",
      header: "ชื่อเรื่อง",
      truncate: "max-w-[34ch]",
      cell: (a) => <span className="font-medium">{a.title}</span>,
    },
    {
      key: "category",
      header: "หมวดหมู่",
      cell: (a) => contentCategoryLabel[a.category],
      width: "w-24",
    },
    {
      key: "state",
      header: "สถานะ",
      cell: (a) => <StatusBadge label={publishStateLabel[a.state]} tone={publishStateTone[a.state]} />,
      width: "w-36",
    },
    {
      key: "publishAt",
      header: "วันที่เผยแพร่",
      cell: (a) => (a.publishAt ? formatThaiDate(a.publishAt) : "—"),
      align: "end",
      hideOnMobile: true,
      width: "w-32",
    },
    {
      key: "eventDate",
      header: "วันที่จัดกิจกรรม",
      cell: (a) => (a.category === "activity" && a.eventDate ? formatThaiDate(a.eventDate) : "—"),
      align: "end",
      hideOnMobile: true,
      width: "w-32",
    },
    {
      key: "author",
      header: "ผู้เขียน",
      cell: (a) => getStaffName(a.authorStaffId),
      hideOnMobile: true,
      truncate: "max-w-[18ch]",
    },
    {
      key: "actions",
      header: "จัดการ",
      align: "end",
      stickyEnd: true,
      cell: (a) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`จัดการ ${a.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => duplicateArticle(a)}>
              <Copy className="size-4" aria-hidden />
              ทำสำเนาเป็นแบบร่างใหม่
            </DropdownMenuItem>
            {a.state !== "archived" ? (
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                    <Archive className="size-4" aria-hidden />
                    เก็บถาวร
                  </DropdownMenuItem>
                }
                title={`เก็บถาวร: ${a.title}`}
                description="ผู้เรียนจะไม่เห็นรายการนี้อีกต่อไปในเว็บไซต์ ข้อมูลยังถูกเก็บไว้ในระบบและนำกลับมาเผยแพร่ได้ภายหลัง"
                confirmLabel="เก็บถาวร"
                tone="destructive"
                onConfirm={() => setArticleState(a, "archived")}
              />
            ) : (
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <RotateCcw className="size-4" aria-hidden />
                    เผยแพร่อีกครั้ง
                  </DropdownMenuItem>
                }
                title={`เผยแพร่อีกครั้ง: ${a.title}`}
                description={`ผู้เรียนจะเห็นรายการนี้ในหน้าข่าวสารทันที โดยใช้วันที่เผยแพร่เป็นวันนี้ (${formatThaiDate(TODAY)})`}
                confirmLabel="เผยแพร่อีกครั้ง"
                onConfirm={() => setArticleState(a, "published")}
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="ข่าวและกิจกรรม"
        description="ข่าวสารและกิจกรรมทั้งหมดของ Credit Bank เป็นรายการเดียวกัน จัดหมวดหมู่ด้วยฟิลด์หมวดหมู่ ไม่ใช่หน้าจอแยก"
        actions={
          <Button asChild size="sm">
            <Link href="/admin/content/news/new">
              <Plus className="size-4" aria-hidden />
              เขียนข่าว/กิจกรรมใหม่
            </Link>
          </Button>
        }
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาจากชื่อเรื่อง"
        searchPlaceholder="ค้นหาข่าวหรือกิจกรรม"
        filters={[
          {
            id: "category",
            label: "หมวดหมู่",
            value: category,
            onChange: setCategory,
            options: [
              { value: ALL_FILTER_VALUE, label: "ทุกหมวดหมู่" },
              { value: "news", label: contentCategoryLabel.news },
              { value: "activity", label: contentCategoryLabel.activity },
            ],
          },
          {
            id: "state",
            label: "สถานะ",
            value: state,
            onChange: setState,
            options: [
              { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
              ...(Object.keys(publishStateLabel) as PublishState[]).map((s) => ({ value: s, label: publishStateLabel[s] })),
            ],
          },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${articles.length} รายการ`}
        onReset={
          isFiltered
            ? () => {
                setSearch("");
                setCategory(ALL_FILTER_VALUE);
                setState(ALL_FILTER_VALUE);
              }
            : undefined
        }
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(a) => a.id}
        rowHref={(a) => `/admin/content/news/${a.id}`}
        caption="รายการข่าวและกิจกรรม"
        empty={
          <EmptyState
            icon={Newspaper}
            title="ไม่พบข่าวหรือกิจกรรมที่ตรงกับตัวกรอง"
            description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูรายการทั้งหมด"
          />
        }
      />
    </>
  );
}
