"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, MoreHorizontal, Pencil, Plus, ShieldAlert, Tags, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStaffSession } from "@/lib/admin/staff-session";
import { TAXONOMY_KIND_HINT, TAXONOMY_KIND_LABEL, taxonomyTerms as initialTaxonomyTerms } from "@/lib/admin/mock-settings";
import type { TaxonomyKind, TaxonomyTerm } from "@/lib/admin/types";
import { TaxonomyTermSheet, type TaxonomyTermFormValues } from "./taxonomy-term-sheet";
import { ReorderControls } from "@/components/admin/reorder-controls";

const KIND_ORDER: TaxonomyKind[] = ["faculty", "education-level", "subject-category", "grade-scale"];

function nextOrderIn(terms: TaxonomyTerm[], kind: TaxonomyKind): number {
  const inKind = terms.filter((t) => t.kind === kind);
  return inKind.length === 0 ? 1 : Math.max(...inKind.map((t) => t.order)) + 1;
}

type SheetState = { mode: "add" | "edit"; kind: TaxonomyKind; term?: TaxonomyTerm };

function TaxonomyManager() {
  const [terms, setTerms] = useState<TaxonomyTerm[]>(initialTaxonomyTerms);
  const [activeKind, setActiveKind] = useState<TaxonomyKind>("faculty");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({ mode: "add", kind: "faculty" });
  const nextIdRef = useRef(1);

  function openAdd(kind: TaxonomyKind) {
    setSheetState({ mode: "add", kind });
    setSheetOpen(true);
  }

  function openEdit(term: TaxonomyTerm) {
    setSheetState({ mode: "edit", kind: term.kind, term });
    setSheetOpen(true);
  }

  /** Order only ever changes one step at a time by swapping with the
   *  neighbour within the same kind — the same pattern the help-center
   *  screen uses for its categories. */
  function moveTerm(kind: TaxonomyKind, id: string, direction: "up" | "down") {
    setTerms((prev) => {
      const inKind = [...prev].filter((t) => t.kind === kind).sort((a, b) => a.order - b.order);
      const index = inKind.findIndex((t) => t.id === id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || swapWith < 0 || swapWith >= inKind.length) return prev;
      const a = inKind[index];
      const b = inKind[swapWith];
      return prev.map((t) => {
        if (t.id === a.id) return { ...t, order: b.order };
        if (t.id === b.id) return { ...t, order: a.order };
        return t;
      });
    });
  }

  function handleSubmit(values: TaxonomyTermFormValues) {
    if (sheetState.mode === "edit" && sheetState.term) {
      const target = sheetState.term;
      setTerms((prev) =>
        prev.map((t) =>
          t.id === target.id ? { ...t, value: values.value.trim(), valueEn: values.valueEn.trim() || undefined } : t,
        ),
      );
      toast.success(`บันทึกการแก้ไข "${values.value.trim()}" แล้ว`);
    } else {
      setTerms((prev) => {
        const newTerm: TaxonomyTerm = {
          id: `tax-${sheetState.kind}-new-${nextIdRef.current++}`,
          kind: sheetState.kind,
          value: values.value.trim(),
          valueEn: values.valueEn.trim() || undefined,
          order: nextOrderIn(prev, sheetState.kind),
          active: true,
          usageCount: 0,
        };
        return [...prev, newTerm];
      });
      toast.success(`เพิ่มรายการ "${values.value.trim()}" แล้ว`);
    }
    setSheetOpen(false);
  }

  function handleToggleActive(term: TaxonomyTerm) {
    setTerms((prev) => prev.map((t) => (t.id === term.id ? { ...t, active: !t.active } : t)));
    toast.success(term.active ? `ปิดใช้งาน "${term.value}" แล้ว` : `เปิดใช้งาน "${term.value}" อีกครั้งแล้ว`);
  }

  function handleDelete(term: TaxonomyTerm) {
    setTerms((prev) => prev.filter((t) => t.id !== term.id));
    toast.success(`ลบ "${term.value}" แล้ว`);
  }

  return (
    <>
      <PageHeader
        title="ข้อมูลหลัก"
        description="ชุดข้อมูลกลางที่ทุกแบบฟอร์มในระบบควรอ้างอิง จัดการคณะ ระดับการศึกษา หมวดวิชา และระดับคะแนน"
      />

      <Panel title="ทำไมต้องมีหน้านี้">
        <p className="max-w-[70ch] text-sm leading-6 text-pretty">
          ขณะนี้แบบฟอร์มสมัครสมาชิกของผู้เรียนยังใช้รายชื่อคณะที่เขียนตายตัวไว้ในโค้ด และแบบฟอร์มแก้ไขข้อมูลส่วนตัวอีกสามจุดต่างก็เก็บ &ldquo;คณะ&rdquo;
          และ &ldquo;ระดับการศึกษา&rdquo; กันคนละแบบ — บางจุดพิมพ์เองได้อิสระ บางจุดอ้างอิงคนละชุด ผลคือตัวเลขในรายงานจำนวนผู้เรียนแยกตามคณะไม่ตรงกัน
          ระหว่างหน้าจอ รายการด้านล่างนี้คือชุดข้อมูลกลางชุดเดียวที่ทุกฟอร์มควรอ้างอิงต่อจากนี้
        </p>
      </Panel>

      <Tabs value={activeKind} onValueChange={(v) => setActiveKind(v as TaxonomyKind)}>
        <TabsList>
          {KIND_ORDER.map((kind) => (
            <TabsTrigger key={kind} value={kind}>
              {TAXONOMY_KIND_LABEL[kind]}
            </TabsTrigger>
          ))}
        </TabsList>

        {KIND_ORDER.map((kind) => {
          const rows = terms.filter((t) => t.kind === kind).sort((a, b) => a.order - b.order);

          const columns: Column<TaxonomyTerm>[] = [
            {
              key: "order",
              header: "ลำดับ",
              width: "w-24",
              cell: (row) => (
                <ReorderControls
                  position={row.order}
                  itemLabel={row.value}
                  canMoveUp={row.order > 1}
                  canMoveDown={row.order < rows.length}
                  onMoveUp={() => moveTerm(kind, row.id, "up")}
                  onMoveDown={() => moveTerm(kind, row.id, "down")}
                />
              ),
            },
            {
              key: "value",
              header: "ชื่อภาษาไทย",
              truncate: "max-w-[32ch]",
              cell: (row) => <span className="font-medium">{row.value}</span>,
            },
            {
              key: "valueEn",
              header: "ชื่อภาษาอังกฤษ",
              hideOnMobile: true,
              truncate: "max-w-[26ch]",
              cell: (row) => row.valueEn ?? <span className="text-[var(--ink-subtle)]">—</span>,
            },
            {
              key: "usageCount",
              header: "จำนวนการใช้งาน",
              align: "end",
              width: "w-32",
              cell: (row) => <span className="font-mono">{row.usageCount.toLocaleString("th-TH")}</span>,
            },
            {
              key: "active",
              header: "สถานะ",
              width: "w-28",
              cell: (row) => (
                <StatusBadge label={row.active ? "ใช้งาน" : "ปิดใช้งาน"} tone={row.active ? "positive" : "neutral"} />
              ),
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
                      <Button size="icon-sm" variant="ghost" aria-label={`การดำเนินการสำหรับ ${row.value}`}>
                        <MoreHorizontal aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <DropdownMenuItem onSelect={() => openEdit(row)}>
                        <Pencil aria-hidden />
                        แก้ไข
                      </DropdownMenuItem>

                      <ConfirmDialog
                        trigger={
                          <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                            {row.active ? <Ban aria-hidden /> : <CheckCircle2 aria-hidden />}
                            {row.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                          </DropdownMenuItem>
                        }
                        title={`${row.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}: ${row.value}`}
                        description={
                          row.active
                            ? row.usageCount > 0
                              ? `รายการนี้ถูกอ้างอิงอยู่ใน ${row.usageCount} รายการ (เช่น ข้อมูลหลักสูตร รายวิชา หรือผู้เรียน) การปิดใช้งานจะไม่ลบหรือเปลี่ยนแปลงข้อมูลที่มีอยู่ แต่จะซ่อนรายการนี้จากตัวเลือกในฟอร์มใหม่ทันที`
                              : `รายการนี้ยังไม่มีการใช้งานอ้างอิง การปิดใช้งานจะซ่อนออกจากตัวเลือกในฟอร์มทันที`
                            : `รายการนี้จะกลับมาเป็นตัวเลือกในทุกแบบฟอร์มที่อ้างอิงชุดข้อมูล "${TAXONOMY_KIND_LABEL[kind]}" ทันที`
                        }
                        confirmLabel={row.active ? "ยืนยันการปิดใช้งาน" : "ยืนยันการเปิดใช้งาน"}
                        onConfirm={() => handleToggleActive(row)}
                      />

                      {row.usageCount > 0 ? (
                        <>
                          <DropdownMenuItem disabled variant="destructive">
                            <Trash2 aria-hidden />
                            ลบ
                          </DropdownMenuItem>
                          <div className="mt-1 border-t border-[var(--border)] px-2 pt-1.5">
                            <p className="py-1 text-xs leading-5 text-[var(--ink-muted)]">
                              ลบไม่ได้เพราะถูกใช้งานอยู่ {row.usageCount} รายการ ใช้ปิดใช้งานแทน
                            </p>
                          </div>
                        </>
                      ) : (
                        <ConfirmDialog
                          trigger={
                            <DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()}>
                              <Trash2 aria-hidden />
                              ลบ
                            </DropdownMenuItem>
                          }
                          title={`ลบ: ${row.value}`}
                          description={`ลบ "${row.value}" ออกจากระบบถาวร การลบไม่สามารถย้อนกลับได้ (รายการนี้ยังไม่มีการใช้งานอ้างอิงใด ๆ จึงลบได้อย่างปลอดภัย)`}
                          confirmLabel="ยืนยันการลบ"
                          tone="destructive"
                          onConfirm={() => handleDelete(row)}
                        />
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ),
            },
          ];

          return (
            <TabsContent key={kind} value={kind} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="max-w-[60ch] text-sm leading-6 text-[var(--ink-muted)]">{TAXONOMY_KIND_HINT[kind]}</p>
                <Button size="sm" onClick={() => openAdd(kind)}>
                  <Plus className="size-4" aria-hidden />
                  เพิ่มรายการ
                </Button>
              </div>

              <DataTable
                columns={columns}
                rows={rows}
                rowKey={(row) => row.id}
                caption={`รายการ${TAXONOMY_KIND_LABEL[kind]}ทั้งหมด`}
                empty={
                  <EmptyState
                    icon={Tags}
                    title={`ยังไม่มีรายการใน${TAXONOMY_KIND_LABEL[kind]}`}
                    description="เพิ่มรายการแรกเพื่อให้แบบฟอร์มที่อ้างอิงชุดข้อมูลนี้มีตัวเลือกให้เลือก"
                  />
                }
              />
            </TabsContent>
          );
        })}
      </Tabs>

      <TaxonomyTermSheet
        open={sheetOpen}
        mode={sheetState.mode}
        kind={sheetState.kind}
        term={sheetState.term}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}

/** Faculty, education level, subject category, and grade scale feed the
 *  registration form, profile forms, and academic reports across the whole
 *  product — only Super Admin may change the canonical list. */
export default function TaxonomyPage() {
  const { role } = useStaffSession();

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="ข้อมูลหลัก" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการแก้ไขข้อมูลหลัก กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  return <TaxonomyManager />;
}
