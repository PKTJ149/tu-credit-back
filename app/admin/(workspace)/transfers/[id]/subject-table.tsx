"use client";

import { Check, X } from "lucide-react";

import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { subjects } from "@/lib/data/subjects";
import type { TransferSubjectLine } from "@/lib/admin/types";

type SubjectTableProps = {
  lines: TransferSubjectLine[];
  readOnly: boolean;
  onMapSubject: (lineId: string, tuSubjectId: string) => void;
  onCreditsChange: (lineId: string, tuCredits: number) => void;
  onDecisionChange: (lineId: string, decision: "accepted" | "rejected" | "pending") => void;
};

/**
 * The core academic judgement of the screen: one row per external subject,
 * mapped by the officer to a TU subject and a credit count. Read-only once
 * the case has a decision recorded — the mapping was made at that point and
 * does not change retroactively.
 */
export function SubjectTable({ lines, readOnly, onMapSubject, onCreditsChange, onDecisionChange }: SubjectTableProps) {
  const columns: Column<TransferSubjectLine>[] = [
    {
      key: "external",
      header: "รายวิชาต้นทาง",
      cell: (line) => (
        <div className="min-w-0">
          <p className="font-mono text-xs text-[var(--ink-subtle)]">{line.externalCode}</p>
          <p className="text-sm font-medium">{line.externalName}</p>
        </div>
      ),
      width: "w-56",
    },
    {
      key: "externalCredits",
      header: "หน่วยกิตต้นทาง",
      cell: (line) => line.externalCredits,
      align: "end",
      width: "w-24",
    },
    {
      key: "externalGrade",
      header: "เกรด",
      cell: (line) => <span className="font-mono">{line.externalGrade}</span>,
      align: "end",
      width: "w-16",
    },
    {
      key: "tuSubject",
      header: "วิชา TU ที่เทียบให้",
      cell: (line) =>
        readOnly ? (
          <span className="text-sm">
            {line.tuSubjectId ? subjectLabel(line.tuSubjectId) : <NoMapping />}
          </span>
        ) : (
          <div className="space-y-1">
            <Label htmlFor={`tu-subject-${line.id}`} className="sr-only">
              วิชา TU ที่เทียบให้สำหรับ {line.externalName}
            </Label>
            <Select value={line.tuSubjectId ?? undefined} onValueChange={(value) => onMapSubject(line.id, value)}>
              <SelectTrigger id={`tu-subject-${line.id}`} size="sm" className="h-8 w-64">
                <SelectValue placeholder="เลือกวิชา TU" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.code ? `${subject.code} · ` : ""}
                    {subject.name} ({subject.credits} นก.)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ),
      width: "w-72",
    },
    {
      key: "tuCredits",
      header: "หน่วยกิตที่ให้",
      cell: (line) =>
        readOnly ? (
          <span className="font-medium">{line.tuCredits ?? "—"}</span>
        ) : (
          <div className="space-y-1">
            <Label htmlFor={`tu-credits-${line.id}`} className="sr-only">
              หน่วยกิตที่ให้สำหรับ {line.externalName}
            </Label>
            <Input
              id={`tu-credits-${line.id}`}
              type="number"
              min={0}
              max={12}
              step={1}
              value={line.tuCredits ?? ""}
              onChange={(e) => onCreditsChange(line.id, e.target.value === "" ? 0 : Number(e.target.value))}
              disabled={!line.tuSubjectId}
              className="h-8 w-20"
            />
          </div>
        ),
      align: "end",
      width: "w-28",
    },
    {
      key: "decision",
      header: "ผลการพิจารณา",
      cell: (line) =>
        readOnly ? (
          <DecisionLabel decision={line.decision} />
        ) : (
          <div className="flex items-center gap-1.5" role="group" aria-label={`ผลการพิจารณา ${line.externalName}`}>
            <Button
              type="button"
              size="xs"
              variant={line.decision === "accepted" ? "default" : "outline"}
              onClick={() => onDecisionChange(line.id, line.decision === "accepted" ? "pending" : "accepted")}
            >
              <Check className="size-3" aria-hidden />
              รับเทียบโอน
            </Button>
            <Button
              type="button"
              size="xs"
              variant={line.decision === "rejected" ? "destructive" : "outline"}
              onClick={() => onDecisionChange(line.id, line.decision === "rejected" ? "pending" : "rejected")}
            >
              <X className="size-3" aria-hidden />
              ไม่รับ
            </Button>
          </div>
        ),
      width: "w-56",
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={lines}
      rowKey={(line) => line.id}
      caption="ตารางเทียบรายวิชาของคำขอนี้"
      empty={
        <p className="px-5 py-8 text-center text-sm text-[var(--ink-muted)]">
          คำขอนี้ไม่มีรายวิชาที่ขอเทียบโอน
        </p>
      }
    />
  );
}

function subjectLabel(tuSubjectId: string): string {
  const subject = subjects.find((s) => s.id === tuSubjectId);
  if (!subject) return "—";
  return `${subject.code ? `${subject.code} · ` : ""}${subject.name}`;
}

function NoMapping() {
  return <span className="text-[var(--ink-subtle)]">ยังไม่ระบุ</span>;
}

function DecisionLabel({ decision }: { decision?: "accepted" | "rejected" | "pending" }) {
  if (decision === "accepted") {
    return <span className="font-medium text-[var(--success-ink)]">รับเทียบโอน</span>;
  }
  if (decision === "rejected") {
    return <span className="font-medium text-[var(--destructive)]">ไม่รับเทียบโอน</span>;
  }
  return <span className={cn("text-[var(--ink-subtle)]")}>ยังไม่ระบุ</span>;
}
