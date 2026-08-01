"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Ban,
  CheckCircle2,
  KeyRound,
  LinkIcon,
  Pencil,
  Plus,
  ShieldAlert,
  TriangleAlert,
  UserRoundCog,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStaffSession } from "@/lib/admin/staff-session";
import { staffUsers as initialStaffUsers, TODAY } from "@/lib/admin/mock-data";
import { formatThaiDate } from "@/lib/admin/format";
import { staffRoleInfo, type StaffRole, type StaffUser } from "@/lib/admin/types";
import { STAFF_STATUS_LABEL, staffStatusTone } from "@/lib/admin/mock-settings";
import { teachers } from "@/lib/data/teachers";
import { StaffSheet, type StaffFormValues } from "./staff-sheet";

const ROLE_OPTIONS: StaffRole[] = ["super-admin", "officer", "teacher"];

type SheetState = { mode: "add" | "edit"; staff?: StaffUser };

/** Only Super Admin can be the last one standing — suspending or demoting the
 *  final active account in this role would leave nobody able to reach this
 *  screen again. */
function isLastActiveSuperAdmin(person: StaffUser, all: StaffUser[]): boolean {
  if (person.role !== "super-admin" || person.status !== "active") return false;
  return all.filter((s) => s.role === "super-admin" && s.status === "active").length <= 1;
}

function roleChangeDescription(person: StaffUser, nextRole: StaffRole): string {
  const current = staffRoleInfo[person.role];
  const next = staffRoleInfo[nextRole];
  let text = `เปลี่ยนบทบาทของ ${person.name} จาก "${current.label}" เป็น "${next.label}" — สิทธิ์ใหม่คือ ${next.description} และจะไม่มีสิทธิ์ของ "${current.label}" อีกต่อไป มีผลทันทีหลังยืนยัน`;
  if (nextRole === "teacher") {
    text += " หลังยืนยันแล้ว อย่าลืมผูกบัญชีนี้กับรายชื่ออาจารย์ผ่านเมนู “แก้ไขข้อมูล” มิฉะนั้นบัญชีจะยังไม่เห็นรายวิชาใด ๆ";
  } else if (person.role === "teacher") {
    text += " บัญชีนี้จะไม่ผูกกับอาจารย์ท่านใดอีกต่อไป";
  }
  return text;
}

function StaffManager() {
  const [staff, setStaff] = useState<StaffUser[]>(initialStaffUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(ALL_FILTER_VALUE);
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({ mode: "add" });
  const nextIdRef = useRef(staff.length + 1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staff.filter((person) => {
      if (roleFilter !== ALL_FILTER_VALUE && person.role !== roleFilter) return false;
      if (statusFilter !== ALL_FILTER_VALUE && person.status !== statusFilter) return false;
      if (!query) return true;
      return (
        person.name.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query) ||
        person.department.toLowerCase().includes(query)
      );
    });
  }, [staff, search, roleFilter, statusFilter]);

  function resetFilters() {
    setSearch("");
    setRoleFilter(ALL_FILTER_VALUE);
    setStatusFilter(ALL_FILTER_VALUE);
  }

  function openAdd() {
    setSheetState({ mode: "add" });
    setSheetOpen(true);
  }

  function openEdit(person: StaffUser) {
    setSheetState({ mode: "edit", staff: person });
    setSheetOpen(true);
  }

  function handleSubmit(values: StaffFormValues) {
    if (sheetState.mode === "edit" && sheetState.staff) {
      const target = sheetState.staff;
      setStaff((prev) =>
        prev.map((s) =>
          s.id === target.id
            ? {
                ...s,
                name: values.name.trim(),
                email: values.email.trim(),
                department: values.department.trim(),
                teacherId: s.role === "teacher" ? values.teacherId : undefined,
              }
            : s,
        ),
      );
      toast.success(`บันทึกข้อมูลของ ${values.name.trim()} แล้ว`);
    } else {
      const newStaff: StaffUser = {
        id: `st-new-${nextIdRef.current++}`,
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
        teacherId: values.role === "teacher" ? values.teacherId : undefined,
        department: values.department.trim(),
        status: "active",
        lastActiveAt: TODAY,
      };
      setStaff((prev) => [...prev, newStaff]);
      toast.success(`สร้างบัญชีของ ${newStaff.name} แล้ว`, {
        description: `ระบบได้ส่งอีเมลเชิญตั้งรหัสผ่านไปยัง ${newStaff.email}`,
      });
    }
    setSheetOpen(false);
  }

  function handleRoleChange(person: StaffUser, nextRole: StaffRole) {
    setStaff((prev) =>
      prev.map((s) => (s.id === person.id ? { ...s, role: nextRole, teacherId: nextRole === "teacher" ? s.teacherId : undefined } : s)),
    );
    toast.success(`เปลี่ยนบทบาทของ ${person.name} เป็น ${staffRoleInfo[nextRole].label} แล้ว`);
  }

  function handleSuspend(person: StaffUser) {
    setStaff((prev) => prev.map((s) => (s.id === person.id ? { ...s, status: "suspended" } : s)));
    toast.success(`ระงับบัญชีของ ${person.name} แล้ว`, { description: "บัญชีนี้จะเข้าสู่ระบบไม่ได้จนกว่าจะเปิดใช้งานอีกครั้ง" });
  }

  function handleReactivate(person: StaffUser) {
    setStaff((prev) => prev.map((s) => (s.id === person.id ? { ...s, status: "active" } : s)));
    toast.success(`เปิดใช้งานบัญชีของ ${person.name} อีกครั้งแล้ว`);
  }

  function handleResetPassword(person: StaffUser) {
    toast.success(`ส่งอีเมลรีเซ็ตรหัสผ่านให้ ${person.name} แล้ว`, { description: person.email });
  }

  // A teacher record already linked to another staff account cannot be
  // handed to a second one — that would make "whose subjects show up here"
  // ambiguous for both logins.
  function availableTeachersFor(currentTeacherId?: string) {
    const assigned = new Set(
      staff.filter((s) => s.role === "teacher" && s.teacherId && s.teacherId !== currentTeacherId).map((s) => s.teacherId),
    );
    return teachers.filter((t) => !assigned.has(t.id));
  }

  const filters: ToolbarFilter[] = [
    {
      id: "role",
      label: "บทบาท",
      value: roleFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกบทบาท" }, ...ROLE_OPTIONS.map((r) => ({ value: r, label: staffRoleInfo[r].label }))],
      onChange: setRoleFilter,
    },
    {
      id: "status",
      label: "สถานะ",
      value: statusFilter,
      options: [
        { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
        { value: "active", label: STAFF_STATUS_LABEL.active },
        { value: "suspended", label: STAFF_STATUS_LABEL.suspended },
      ],
      onChange: setStatusFilter,
    },
  ];

  const columns: Column<StaffUser>[] = [
    {
      key: "name",
      header: "ชื่อ-นามสกุล",
      cell: (row) => (
        <span className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="truncate text-xs text-[var(--ink-subtle)]">{row.email}</span>
        </span>
      ),
    },
    {
      key: "role",
      header: "บทบาท",
      cell: (row) => (
        <Badge variant="outline" className="text-[var(--ink-muted)]">
          {staffRoleInfo[row.role].shortLabel}
        </Badge>
      ),
    },
    {
      key: "department",
      header: "หน่วยงาน",
      truncate: "max-w-[22ch]",
      hideOnMobile: true,
      cell: (row) => row.department,
    },
    {
      key: "teacher",
      header: "ผูกกับอาจารย์",
      cell: (row) => {
        if (row.role !== "teacher") return <span className="text-xs text-[var(--ink-subtle)]">—</span>;
        const teacher = row.teacherId ? teachers.find((t) => t.id === row.teacherId) : undefined;
        if (teacher) {
          return (
            <span className="flex items-center gap-1.5 text-sm">
              <LinkIcon className="size-3.5 shrink-0 text-[var(--ink-subtle)]" aria-hidden />
              <span className="truncate max-w-[18ch]">{teacher.name}</span>
            </span>
          );
        }
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--destructive)]">
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
            ยังไม่ผูกกับอาจารย์
          </span>
        );
      },
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (row) => <StatusBadge label={STAFF_STATUS_LABEL[row.status]} tone={staffStatusTone[row.status]} />,
    },
    {
      key: "lastActiveAt",
      header: "ใช้งานล่าสุด",
      hideOnMobile: true,
      cell: (row) => formatThaiDate(row.lastActiveAt),
    },
    {
      key: "actions",
      header: <span className="sr-only">การดำเนินการ</span>,
      align: "end",
      width: "w-12",
      stickyEnd: true,
      cell: (row) => {
        const locked = isLastActiveSuperAdmin(row, staff);
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost" aria-label={`การดำเนินการสำหรับ ${row.name}`}>
                  <UserRoundCog aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuItem onSelect={() => openEdit(row)}>
                  <Pencil aria-hidden />
                  แก้ไขข้อมูล
                </DropdownMenuItem>

                {ROLE_OPTIONS.filter((r) => r !== row.role).map((r) =>
                  locked ? (
                    <DropdownMenuItem key={r} disabled>
                      <ShieldAlert aria-hidden />
                      เปลี่ยนบทบาทเป็น{staffRoleInfo[r].shortLabel}
                    </DropdownMenuItem>
                  ) : (
                    <ConfirmDialog
                      key={r}
                      trigger={
                        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                          <ShieldAlert aria-hidden />
                          เปลี่ยนบทบาทเป็น{staffRoleInfo[r].shortLabel}
                        </DropdownMenuItem>
                      }
                      title={`เปลี่ยนบทบาท: ${row.name}`}
                      description={roleChangeDescription(row, r)}
                      confirmLabel="ยืนยันการเปลี่ยนบทบาท"
                      onConfirm={() => handleRoleChange(row, r)}
                    />
                  ),
                )}

                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                      <KeyRound aria-hidden />
                      รีเซ็ตรหัสผ่าน
                    </DropdownMenuItem>
                  }
                  title={`รีเซ็ตรหัสผ่าน: ${row.name}`}
                  description={`ระบบจะส่งอีเมลลิงก์ตั้งรหัสผ่านใหม่ไปยัง ${row.email} ลิงก์รีเซ็ตเดิม (ถ้ามี) จะใช้งานไม่ได้ทันที`}
                  confirmLabel="ส่งอีเมลรีเซ็ตรหัสผ่าน"
                  onConfirm={() => handleResetPassword(row)}
                />

                {row.status === "active" ? (
                  locked ? (
                    <DropdownMenuItem disabled variant="destructive">
                      <Ban aria-hidden />
                      ระงับบัญชี
                    </DropdownMenuItem>
                  ) : (
                    <ConfirmDialog
                      trigger={
                        <DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()}>
                          <Ban aria-hidden />
                          ระงับบัญชี
                        </DropdownMenuItem>
                      }
                      title={`ระงับบัญชี: ${row.name}`}
                      description={`บัญชีนี้จะเข้าสู่ระบบไม่ได้จนกว่าจะเปิดใช้งานอีกครั้ง${row.role === "teacher" ? " ผู้เรียนในรายวิชาที่อาจารย์ท่านนี้ดูแลจะไม่ได้รับผลกระทบ แต่ตัวอาจารย์เองจะเข้าระบบไม่ได้จนกว่าจะเปิดใช้งาน" : ""}`}
                      confirmLabel="ยืนยันการระงับ"
                      tone="destructive"
                      onConfirm={() => handleSuspend(row)}
                    />
                  )
                ) : (
                  <ConfirmDialog
                    trigger={
                      <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                        <CheckCircle2 aria-hidden />
                        เปิดใช้งานอีกครั้ง
                      </DropdownMenuItem>
                    }
                    title={`เปิดใช้งานบัญชีอีกครั้ง: ${row.name}`}
                    description={`บัญชีนี้จะกลับมาเข้าสู่ระบบได้ทันทีด้วยบทบาทเดิม (${staffRoleInfo[row.role].label})`}
                    confirmLabel="ยืนยันการเปิดใช้งาน"
                    onConfirm={() => handleReactivate(row)}
                  />
                )}

                {locked ? (
                  <div className="mt-1 border-t border-[var(--border)] px-2 pt-1.5">
                    <p className="py-1 text-xs leading-5 text-[var(--ink-muted)]">
                      เป็นผู้ดูแลระบบสูงสุดคนสุดท้ายที่ใช้งานอยู่ ระงับหรือเปลี่ยนบทบาทไม่ได้ เพื่อไม่ให้ไม่มีใครเข้าถึงหน้านี้อีก
                    </p>
                  </div>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="บัญชีเจ้าหน้าที่"
        description="สร้างบัญชี กำหนดบทบาท และผูกบัญชีอาจารย์กับรายวิชาที่รับผิดชอบ ทุกการเปลี่ยนบทบาทและการระงับบัญชีต้องยืนยันก่อนมีผล"
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="size-4" aria-hidden />
            เพิ่มบัญชีเจ้าหน้าที่
          </Button>
        }
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาบัญชีเจ้าหน้าที่"
        searchPlaceholder="ค้นหาชื่อ อีเมล หรือหน่วยงาน"
        filters={filters}
        onReset={resetFilters}
        resultSummary={`แสดง ${filtered.length} จาก ${staff.length} รายการ`}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        caption="บัญชีเจ้าหน้าที่ทั้งหมด"
        empty={
          <EmptyState
            icon={Users}
            title="ไม่พบบัญชีเจ้าหน้าที่"
            description="ไม่มีบัญชีที่ตรงกับตัวกรองนี้ ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
          />
        }
      />

      <StaffSheet
        open={sheetOpen}
        mode={sheetState.mode}
        staff={sheetState.staff}
        availableTeachers={availableTeachersFor(sheetState.staff?.teacherId)}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}

/** Staff accounts are the whole permission model's foundation — only Super
 *  Admin may create or change one. Everyone else gets a plain explanation. */
export default function StaffPage() {
  const { role } = useStaffSession();

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="บัญชีเจ้าหน้าที่" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการจัดการบัญชีเจ้าหน้าที่ กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  return <StaffManager />;
}
