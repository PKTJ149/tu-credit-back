"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Landmark, Pencil, ShieldAlert, Star } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bankAccounts } from "@/lib/admin/mock-data";
import type { BankAccount } from "@/lib/admin/types";
import { useStaffSession } from "@/lib/admin/staff-session";

type FormValues = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
};

const emptyForm: FormValues = { bankName: "", accountName: "", accountNumber: "", branch: "" };

function toFormValues(account: BankAccount): FormValues {
  return {
    bankName: account.bankName,
    accountName: account.accountName,
    accountNumber: account.accountNumber,
    branch: account.branch,
  };
}

/** Inline add/edit form. A dialog would hide the list this action changes —
 *  an officer editing an account benefits from seeing the other accounts
 *  right there, especially when deciding which one to leave as primary. */
function AccountForm({
  initialValues,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  initialValues: FormValues;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState(false);

  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (touched) {
    if (values.bankName.trim() === "") errors.bankName = "กรุณาระบุชื่อธนาคาร";
    if (values.accountName.trim() === "") errors.accountName = "กรุณาระบุชื่อบัญชี";
    if (values.accountNumber.trim() === "") errors.accountNumber = "กรุณาระบุเลขที่บัญชี";
    if (values.branch.trim() === "") errors.branch = "กรุณาระบุชื่อสาขา";
  }
  const hasErrors = Object.keys(errors).length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (
      values.bankName.trim() === "" ||
      values.accountName.trim() === "" ||
      values.accountNumber.trim() === "" ||
      values.branch.trim() === ""
    ) {
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="bankName">ชื่อธนาคาร</Label>
        <Input
          id="bankName"
          value={values.bankName}
          onChange={(e) => setValues((v) => ({ ...v, bankName: e.target.value }))}
          aria-invalid={Boolean(errors.bankName)}
          aria-describedby={errors.bankName ? "bankName-error" : undefined}
          placeholder="เช่น ธนาคารกรุงเทพ"
        />
        {errors.bankName ? (
          <p id="bankName-error" className="text-xs text-[var(--destructive)]">
            {errors.bankName}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="branch">สาขา</Label>
        <Input
          id="branch"
          value={values.branch}
          onChange={(e) => setValues((v) => ({ ...v, branch: e.target.value }))}
          aria-invalid={Boolean(errors.branch)}
          aria-describedby={errors.branch ? "branch-error" : undefined}
          placeholder="เช่น ท่าพระจันทร์"
        />
        {errors.branch ? (
          <p id="branch-error" className="text-xs text-[var(--destructive)]">
            {errors.branch}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="accountName">ชื่อบัญชี</Label>
        <Input
          id="accountName"
          value={values.accountName}
          onChange={(e) => setValues((v) => ({ ...v, accountName: e.target.value }))}
          aria-invalid={Boolean(errors.accountName)}
          aria-describedby={errors.accountName ? "accountName-error" : undefined}
          placeholder="เช่น มหาวิทยาลัยธรรมศาสตร์ (Credit Bank)"
        />
        {errors.accountName ? (
          <p id="accountName-error" className="text-xs text-[var(--destructive)]">
            {errors.accountName}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="accountNumber">เลขที่บัญชี</Label>
        <Input
          id="accountNumber"
          value={values.accountNumber}
          onChange={(e) => setValues((v) => ({ ...v, accountNumber: e.target.value }))}
          aria-invalid={Boolean(errors.accountNumber)}
          aria-describedby={errors.accountNumber ? "accountNumber-error" : undefined}
          placeholder="เช่น 091-3-45678-9"
          className="font-mono"
        />
        {errors.accountNumber ? (
          <p id="accountNumber-error" className="text-xs text-[var(--destructive)]">
            {errors.accountNumber}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" size="sm" disabled={touched && hasErrors}>
          {submitLabel}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          ยกเลิก
        </Button>
      </div>
    </form>
  );
}

function BankAccountsManager() {
  const [accounts, setAccounts] = useState<BankAccount[]>(bankAccounts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  /** Local id sequence for accounts added in this session. A prototype has
   *  no server to hand out real ids, and `Date.now()` would make the screen
   *  render differently on every machine — so this counts up instead. */
  const nextIdRef = useRef(accounts.length + 1);

  function handleSetPrimary(id: string) {
    setAccounts((prev) => prev.map((a) => ({ ...a, isPrimary: a.id === id })));
    const account = accounts.find((a) => a.id === id);
    toast.success("ตั้งบัญชีหลักแล้ว", {
      description: account ? `${account.bankName} · ${account.accountNumber}` : undefined,
    });
  }

  function handleSaveEdit(id: string, values: FormValues) {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...values } : a)));
    setEditingId(null);
    toast.success("บันทึกข้อมูลบัญชีแล้ว");
  }

  function handleAddAccount(values: FormValues) {
    const newAccount: BankAccount = {
      id: `bank${nextIdRef.current++}`,
      ...values,
      isPrimary: accounts.length === 0,
    };
    setAccounts((prev) => [...prev, newAccount]);
    setIsAdding(false);
    toast.success("เพิ่มบัญชีธนาคารแล้ว", { description: `${values.bankName} · ${values.accountNumber}` });
  }

  return (
    <>
      <PageHeader
        title="ตั้งค่าบัญชีธนาคาร"
        description="รายละเอียดบัญชีเหล่านี้จะแสดงให้ผู้เรียนเห็นในหน้าคำแนะนำการชำระเงินโดยตรง ตรวจสอบให้ถูกต้องก่อนบันทึกทุกครั้ง"
        actions={
          !isAdding ? (
            <Button size="sm" onClick={() => setIsAdding(true)}>
              เพิ่มบัญชีธนาคาร
            </Button>
          ) : null
        }
      />

      <Panel flush>
        {accounts.length === 0 && !isAdding ? (
          <EmptyState
            icon={Landmark}
            title="ยังไม่มีบัญชีธนาคาร"
            description="เพิ่มบัญชีอย่างน้อยหนึ่งบัญชีเพื่อให้ผู้เรียนเห็นช่องทางการโอนเงินในหน้าคำแนะนำการชำระเงิน"
          />
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {accounts.map((account) =>
              editingId === account.id ? (
                <li key={account.id} className="p-4">
                  <AccountForm
                    initialValues={toFormValues(account)}
                    submitLabel="บันทึกการแก้ไข"
                    onCancel={() => setEditingId(null)}
                    onSubmit={(values) => handleSaveEdit(account.id, values)}
                  />
                </li>
              ) : (
                <li key={account.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{account.bankName}</p>
                      {account.isPrimary ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_oklch,var(--primary)_11%,white)] px-2 py-0.5 text-xs font-medium text-[var(--primary)] ring-1 ring-inset ring-[color:color-mix(in_oklch,var(--primary)_26%,white)]">
                          <Star className="size-3" aria-hidden />
                          บัญชีหลัก
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-[var(--ink-muted)]">{account.accountName}</p>
                    <p className="font-mono text-sm">{account.accountNumber}</p>
                    <p className="text-xs text-[var(--ink-subtle)]">สาขา{account.branch}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!account.isPrimary ? (
                      <Button size="sm" variant="outline" onClick={() => handleSetPrimary(account.id)}>
                        ตั้งเป็นบัญชีหลัก
                      </Button>
                    ) : null}
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(account.id)}>
                      <Pencil className="size-4" aria-hidden />
                      แก้ไข
                    </Button>
                  </div>
                </li>
              ),
            )}
            {isAdding ? (
              <li className="p-4">
                <AccountForm
                  initialValues={emptyForm}
                  submitLabel="บันทึกบัญชีใหม่"
                  onCancel={() => setIsAdding(false)}
                  onSubmit={handleAddAccount}
                />
              </li>
            ) : null}
          </ul>
        )}
      </Panel>
    </>
  );
}

/** Bank details are what a student's payment instructions screen reads
 *  directly from — a mistake here misdirects real money, so only Super
 *  Admin may reach this route. Officers get a plain explanation instead of
 *  a blank page or a crash. */
export default function BankAccountsPage() {
  const { role } = useStaffSession();

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="ตั้งค่าบัญชีธนาคาร" />
        <Panel>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--ink-subtle)]">
              <ShieldAlert className="size-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
              <p className="mx-auto max-w-[46ch] text-sm leading-6 text-[var(--ink-muted)]">
                การตั้งค่าบัญชีธนาคารเปิดให้เฉพาะผู้ดูแลระบบสูงสุดเท่านั้น หากต้องการแก้ไขบัญชีรับชำระเงิน กรุณาติดต่อผู้ดูแลระบบ
              </p>
            </div>
          </div>
        </Panel>
      </>
    );
  }

  return <BankAccountsManager />;
}
