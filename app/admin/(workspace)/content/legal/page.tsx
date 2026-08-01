"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatThaiDate } from "@/lib/admin/format";
import { getStaffName } from "@/lib/admin/mock-data";
import { useStaffSession } from "@/lib/admin/staff-session";
import {
  currentLegalVersion,
  legalDocuments as initialLegalDocuments,
  legalKindLabel,
  legalKindOrder,
  legalVersionsOf,
  nextLegalDocumentId,
  publishStateLabel,
  publishStateTone,
} from "@/lib/admin/mock-pages";
import type { LegalDocument } from "@/lib/admin/types";
import { LegalVersionSheet, type LegalVersionFormValues } from "./legal-version-sheet";

export default function LegalDocumentsPage() {
  const { role, staff } = useStaffSession();
  const [docs, setDocs] = useState<LegalDocument[]>(initialLegalDocuments);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeKind, setActiveKind] = useState<LegalDocument["kind"] | undefined>(undefined);

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="นโยบายและข้อตกลง" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด เนื่องจากเป็นเอกสารที่มีผลผูกพันทางกฎหมายกับผู้เรียน หากต้องการแก้ไข กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  function openEdit(kind: LegalDocument["kind"]) {
    setActiveKind(kind);
    setSheetOpen(true);
  }

  const activeCurrent = activeKind ? currentLegalVersion(activeKind, docs) : undefined;

  function handleSubmit(values: LegalVersionFormValues) {
    if (!activeKind) return;
    const kind = activeKind;
    const newDoc: LegalDocument = {
      id: nextLegalDocumentId(),
      kind,
      title: legalKindLabel[kind],
      version: values.version.trim(),
      effectiveAt: values.effectiveAt,
      body: values.body.trim(),
      state: values.publishNow ? "published" : "draft",
      updatedByStaffId: staff?.id ?? "st1",
    };

    setDocs((prev) => {
      const withArchivedPrevious = values.publishNow
        ? prev.map((d) => (d.kind === kind && d.state === "published" ? { ...d, state: "archived" as const } : d))
        : prev;
      return [...withArchivedPrevious, newDoc];
    });

    toast.success(
      values.publishNow
        ? `เผยแพร่ ${legalKindLabel[kind]} เวอร์ชัน ${newDoc.version} แล้ว — ฉบับก่อนหน้าย้ายเป็นเก็บถาวรอัตโนมัติ`
        : `บันทึก ${legalKindLabel[kind]} เวอร์ชัน ${newDoc.version} เป็นฉบับร่างแล้ว`,
    );
    setSheetOpen(false);
  }

  return (
    <>
      <PageHeader
        title="นโยบายและข้อตกลง"
        description="เอกสารที่มีผลผูกพันกับผู้เรียน มีการควบคุมเวอร์ชัน — แก้ไขแล้วสร้างเวอร์ชันใหม่เสมอ ไม่ทับฉบับที่ใช้อยู่"
      />

      <Alert>
        <ShieldAlert aria-hidden />
        <AlertTitle>ช่องว่างด้านการปฏิบัติตามข้อกำหนดที่หน้านี้ปิดให้</AlertTitle>
        <AlertDescription>
          ช่องยืนยันความยินยอมในหน้าสมัครสมาชิก (คอมโพเนนต์ <code>RegisterForm</code>) ปัจจุบันลิงก์ไปยัง{" "}
          <code>#terms</code> และ <code>#privacy</code> ซึ่งไม่มีหน้าจริงอยู่เลย — ผู้เรียนกดยอมรับเงื่อนไขที่ไม่มีเนื้อหาให้อ่านจริง
          เอกสาร &quot;{legalKindLabel.terms}&quot; และ &quot;{legalKindLabel.privacy}&quot; ด้านล่างนี้คือเนื้อหาที่จะมาแทนที่จุดเชื่อมทั้งสองจุดนั้น
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {legalKindOrder.map((kind) => {
          const versions = legalVersionsOf(kind, docs);
          const current = currentLegalVersion(kind, docs);

          const versionColumns: Column<LegalDocument>[] = [
            { key: "version", header: "เวอร์ชัน", width: "w-24", cell: (d) => <span className="font-mono text-xs">{d.version}</span> },
            { key: "effectiveAt", header: "มีผลบังคับใช้", width: "w-32", cell: (d) => formatThaiDate(d.effectiveAt) },
            {
              key: "state",
              header: "สถานะ",
              width: "w-32",
              cell: (d) => <StatusBadge label={publishStateLabel[d.state]} tone={publishStateTone[d.state]} />,
            },
            { key: "updatedBy", header: "แก้ไขโดย", truncate: "max-w-[20ch]", cell: (d) => getStaffName(d.updatedByStaffId) },
          ];

          return (
            <Panel
              key={kind}
              title={legalKindLabel[kind]}
              description={current ? `เวอร์ชันปัจจุบัน ${current.version} · มีผลบังคับใช้ ${formatThaiDate(current.effectiveAt)}` : "ยังไม่มีเวอร์ชัน"}
              actions={
                <>
                  {current ? <StatusBadge label={publishStateLabel[current.state]} tone={publishStateTone[current.state]} /> : null}
                  <Button size="sm" onClick={() => openEdit(kind)}>
                    แก้ไข (สร้างเวอร์ชันใหม่)
                  </Button>
                </>
              }
              flush
            >
              {current ? (
                <div className="border-b border-[var(--border)] px-5 py-4">
                  <DetailList rows={[{ label: "เนื้อหาฉบับปัจจุบัน", value: current.body, full: true }]} />
                </div>
              ) : null}

              <div className="px-5 pt-3 text-xs font-semibold text-[var(--ink-muted)]">
                ประวัติเวอร์ชัน ({versions.length})
              </div>
              <DataTable
                columns={versionColumns}
                rows={versions}
                rowKey={(d) => d.id}
                caption={`ประวัติเวอร์ชันของ${legalKindLabel[kind]}`}
                className="mt-2 rounded-none border-x-0 border-b-0"
                empty={
                  <EmptyState
                    icon={ShieldAlert}
                    title="ยังไม่มีเวอร์ชันของเอกสารนี้"
                    description="สร้างเวอร์ชันแรกด้วยปุ่มแก้ไขด้านบน"
                  />
                }
              />
            </Panel>
          );
        })}
      </div>

      <LegalVersionSheet
        open={sheetOpen}
        basedOn={activeCurrent}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
