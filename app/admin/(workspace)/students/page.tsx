"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { getRegistrationsByStudent, students } from "@/lib/admin/mock-data";
import { STUDENT_STATUS_LABEL, studentStatusTone } from "@/lib/admin/mock-registrations";
import type { AdminStudent } from "@/lib/admin/types";

const FACULTY_OPTIONS = Array.from(new Set(students.map((s) => s.faculty))).map((faculty) => ({
  value: faculty,
  label: faculty,
}));

const EDUCATION_LEVEL_OPTIONS = Array.from(new Set(students.map((s) => s.educationLevel))).map((level) => ({
  value: level,
  label: level,
}));

const STATUS_OPTIONS = (Object.keys(STUDENT_STATUS_LABEL) as AdminStudent["status"][]).map((status) => ({
  value: status,
  label: STUDENT_STATUS_LABEL[status],
}));

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState(ALL_FILTER_VALUE);
  const [levelFilter, setLevelFilter] = useState(ALL_FILTER_VALUE);
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      if (facultyFilter !== ALL_FILTER_VALUE && student.faculty !== facultyFilter) return false;
      if (levelFilter !== ALL_FILTER_VALUE && student.educationLevel !== levelFilter) return false;
      if (statusFilter !== ALL_FILTER_VALUE && student.status !== statusFilter) return false;
      if (!query) return true;
      return (
        student.studentCode.toLowerCase().includes(query) ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    });
  }, [search, facultyFilter, levelFilter, statusFilter]);

  const filters: ToolbarFilter[] = [
    {
      id: "faculty",
      label: "คณะ",
      value: facultyFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกคณะ" }, ...FACULTY_OPTIONS],
      onChange: setFacultyFilter,
    },
    {
      id: "education-level",
      label: "ระดับการศึกษา",
      value: levelFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกระดับ" }, ...EDUCATION_LEVEL_OPTIONS],
      onChange: setLevelFilter,
    },
    {
      id: "status",
      label: "สถานะ",
      value: statusFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกสถานะ" }, ...STATUS_OPTIONS],
      onChange: setStatusFilter,
    },
  ];

  function resetFilters() {
    setSearch("");
    setFacultyFilter(ALL_FILTER_VALUE);
    setLevelFilter(ALL_FILTER_VALUE);
    setStatusFilter(ALL_FILTER_VALUE);
  }

  const columns: Column<AdminStudent>[] = [
    {
      key: "studentCode",
      header: "รหัสผู้เรียน",
      width: "w-32",
      cell: (row) => <span className="font-mono text-xs">{row.studentCode}</span>,
    },
    {
      key: "name",
      truncate: "max-w-[22ch]",
      header: "ชื่อ-นามสกุล",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "email",
      header: "อีเมล",
      hideOnMobile: true,
      cell: (row) => <span className="text-[var(--ink-muted)]">{row.email}</span>,
    },
    {
      key: "faculty",
      header: "คณะ",
      truncate: "max-w-[20ch]",
      hideOnMobile: true,
      cell: (row) => row.faculty,
    },
    {
      key: "educationLevel",
      header: "ระดับการศึกษา",
      hideOnMobile: true,
      cell: (row) => row.educationLevel,
    },
    {
      key: "accumulatedCredits",
      header: "หน่วยกิตสะสม",
      align: "end",
      width: "w-28",
      cell: (row) => <span className="font-mono">{row.accumulatedCredits}</span>,
    },
    {
      key: "registrationCount",
      header: "จำนวนการลงทะเบียน",
      align: "end",
      width: "w-32",
      cell: (row) => <span className="font-mono">{getRegistrationsByStudent(row.id).length}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (row) => <StatusBadge label={STUDENT_STATUS_LABEL[row.status]} tone={studentStatusTone[row.status]} />,
    },
  ];

  return (
    <>
      <PageHeader title="รายชื่อผู้เรียน" description="ผู้เรียนทั้งหมดในระบบ Credit Bank พร้อมหน่วยกิตสะสมและสถานะการใช้งาน" />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาผู้เรียน"
        searchPlaceholder="ค้นหารหัส ชื่อ หรืออีเมล"
        filters={filters}
        onReset={resetFilters}
        resultSummary={`แสดง ${filtered.length} จาก ${students.length} รายการ`}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        rowHref={(row) => `/admin/students/${row.id}`}
        caption="รายชื่อผู้เรียนทั้งหมด"
        empty={
          <EmptyState
            icon={Users}
            title="ไม่พบผู้เรียน"
            description="ไม่มีผู้เรียนที่ตรงกับตัวกรองนี้ ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
          />
        }
      />
    </>
  );
}
