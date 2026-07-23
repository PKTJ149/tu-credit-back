"use client";

/**
 * Fake learner data for the prototype demo.
 *
 * There is no backend or database yet. This context is the single source of
 * truth for everything a signed-in learner accumulates: registrations,
 * payables, learning goals, transfer requests, and academic records. Pages read
 * from here instead of hardcoding empty arrays, so the whole flow is connected:
 * click "register" on one page → it shows up on the registrations and finance
 * pages → pay → status changes everywhere.
 *
 * Data is kept in localStorage so it survives a refresh, and is cleared on
 * logout so the demo can be restarted as a brand-new user. When a real backend
 * arrives, only this file needs to change.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth/auth-context";
import type { PaymentState } from "@/lib/finance/payment-state";
import type {
  AcademicRecord,
  LearningItemType,
  RegistrationStatus,
} from "@/lib/learning/registration-status";
import type { TransferRequest } from "@/lib/credit-transfer/transfer-state";

const STORAGE_KEY = "cb.session.data";

/** The academic term used for anything registered during the demo. */
export const CURRENT_TERM = "ภาคเรียนที่ 1/2569";

/** Learning-goal categories, in display order. */
export const GOAL_CATEGORIES = [
  "หมวดวิชาศึกษาทั่วไป",
  "หมวดวิชาเฉพาะ",
  "หมวดวิชาเลือกเสรี",
] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export type LearnerRegistration = {
  id: string;
  itemName: string;
  itemType: LearningItemType;
  slug: string;
  term: string;
  amount: number;
  status: RegistrationStatus;
  payableId: string;
};

export type LearnerPayable = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  state: PaymentState;
  dueDate?: string;
  registrationId: string;
};

export type LearnerGoal = {
  id: string;
  name: string;
  nameEn?: string;
  itemType: LearningItemType;
  slug: string;
  credits: number;
  category: GoalCategory;
};

/** Everything a learner accumulates in the demo. */
type SessionData = {
  registrations: LearnerRegistration[];
  payables: LearnerPayable[];
  goals: LearnerGoal[];
  transfers: TransferRequest[];
  academicRecords: AcademicRecord[];
};

/** A brand-new learner: empty except for pre-seeded academic history. */
function makeEmptyData(): SessionData {
  return {
    registrations: [],
    payables: [],
    goals: [],
    transfers: [],
    academicRecords: seedAcademicRecords,
  };
}

/** Pre-seeded past grades so the academic-progress page has something to show. */
const seedAcademicRecords: AcademicRecord[] = [
  {
    id: "seed-001",
    term: "ภาคเรียนที่ 2/2568",
    itemName: "มนุษย์กับสังคม",
    credits: 3,
    grade: "A",
  },
  {
    id: "seed-002",
    term: "ภาคเรียนที่ 2/2568",
    itemName: "กฎหมายทั่วไป",
    credits: 3,
    grade: "B+",
  },
  {
    id: "seed-003",
    term: "ภาคเรียนที่ 2/2568",
    itemName: "คอมพิวเตอร์และเทคโนโลยีดิจิทัล",
    credits: 3,
    grade: "A",
  },
];

/** Input for registering — what the program/subject page hands us. */
export type RegisterInput = {
  itemName: string;
  itemType: LearningItemType;
  slug: string;
  amount: number;
};

/** Input for adding a learning goal. */
export type AddGoalInput = {
  name: string;
  nameEn?: string;
  itemType: LearningItemType;
  slug: string;
  credits: number;
  category?: GoalCategory;
};

/** Input for adding a submitted transfer request. */
export type AddTransferInput = {
  type: TransferRequest["type"];
  title: string;
};

type SessionDataContextValue = {
  isReady: boolean;
  data: SessionData;
  /** Register for a program/subject; creates a registration + a payable. */
  registerForItem: (input: RegisterInput) => void;
  /** Move a payable to "waiting for verification" (proof uploaded). */
  submitPayment: (payableId: string) => void;
  /** Approve a payment (demo shortcut); marks it confirmed + registration active. */
  confirmPayment: (payableId: string) => void;
  /** Add a program/subject as a learning goal. */
  addGoal: (input: AddGoalInput) => void;
  /** Remove a learning goal entirely. */
  removeGoal: (goalId: string) => void;
  /** Add a submitted transfer request to the history. */
  addTransfer: (input: AddTransferInput) => void;
  /** Reset everything back to a brand-new learner. */
  resetDemo: () => void;
  /** Is a given program/subject slug already a learning goal? */
  isGoal: (slug: string) => boolean;
};

const SessionDataContext = createContext<SessionDataContextValue | null>(null);

/** Pick a category for a new goal when the caller didn't specify one. */
function defaultCategory(itemType: LearningItemType): GoalCategory {
  // A whole program is the learner's focus → "specific"; a single subject
  // defaults to general studies.
  return itemType === "program" ? "หมวดวิชาเฉพาะ" : "หมวดวิชาศึกษาทั่วไป";
}

/** Create a reasonably unique id without needing a backend. */
function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(
    Math.random() * 1_000_000,
  ).toString(36)}`;
}

export function SessionDataProvider({ children }: { children: ReactNode }) {
  const { isReady: authReady, isAuthenticated } = useAuth();
  const [data, setData] = useState<SessionData>(makeEmptyData);
  const [isReady, setIsReady] = useState(false);
  const wasAuthenticated = useRef(false);

  // Load saved data once, on the client only.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(JSON.parse(raw) as SessionData);
      }
    } catch {
      // Corrupt/blocked storage — start fresh.
    }
    setIsReady(true);
  }, []);

  // Persist on every change (once loaded).
  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors.
    }
  }, [data, isReady]);

  // Clear data when the learner logs out (authenticated → not authenticated).
  useEffect(() => {
    if (!authReady) return;
    if (wasAuthenticated.current && !isAuthenticated) {
      setData(makeEmptyData());
    }
    wasAuthenticated.current = isAuthenticated;
  }, [authReady, isAuthenticated]);

  const registerForItem = useCallback((input: RegisterInput) => {
    setData((prev) => {
      const registrationId = makeId("reg");
      const payableId = makeId("pay");
      const registration: LearnerRegistration = {
        id: registrationId,
        itemName: input.itemName,
        itemType: input.itemType,
        slug: input.slug,
        term: CURRENT_TERM,
        amount: input.amount,
        status: "awaiting-payment",
        payableId,
      };
      const payable: LearnerPayable = {
        id: payableId,
        name: input.itemName,
        amount: input.amount,
        currency: "THB",
        state: "payment-required",
        registrationId,
      };
      return {
        ...prev,
        registrations: [registration, ...prev.registrations],
        payables: [payable, ...prev.payables],
      };
    });
  }, []);

  const submitPayment = useCallback((payableId: string) => {
    setData((prev) => ({
      ...prev,
      payables: prev.payables.map((p) =>
        p.id === payableId ? { ...p, state: "pending-verification" } : p,
      ),
    }));
  }, []);

  const confirmPayment = useCallback((payableId: string) => {
    setData((prev) => {
      const payable = prev.payables.find((p) => p.id === payableId);
      return {
        ...prev,
        payables: prev.payables.map((p) =>
          p.id === payableId ? { ...p, state: "payment-confirmed" } : p,
        ),
        registrations: prev.registrations.map((r) =>
          payable && r.id === payable.registrationId
            ? { ...r, status: "active" }
            : r,
        ),
      };
    });
  }, []);

  const addGoal = useCallback((input: AddGoalInput) => {
    setData((prev) => {
      // Don't add the same program/subject twice.
      if (prev.goals.some((g) => g.slug === input.slug)) {
        return prev;
      }
      const goal: LearnerGoal = {
        id: makeId("goal"),
        name: input.name,
        nameEn: input.nameEn,
        itemType: input.itemType,
        slug: input.slug,
        credits: input.credits,
        category: input.category ?? defaultCategory(input.itemType),
      };
      return { ...prev, goals: [...prev.goals, goal] };
    });
  }, []);

  const removeGoal = useCallback((goalId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
  }, []);

  const addTransfer = useCallback((input: AddTransferInput) => {
    setData((prev) => {
      const transfer: TransferRequest = {
        id: makeId("tr"),
        type: input.type,
        title: input.title,
        submittedDate: CURRENT_TERM,
        state: "submitted",
      };
      return { ...prev, transfers: [transfer, ...prev.transfers] };
    });
  }, []);

  const resetDemo = useCallback(() => {
    setData(makeEmptyData());
  }, []);

  const isGoal = useCallback(
    (slug: string) => data.goals.some((g) => g.slug === slug),
    [data.goals],
  );

  const value = useMemo<SessionDataContextValue>(
    () => ({
      isReady,
      data,
      registerForItem,
      submitPayment,
      confirmPayment,
      addGoal,
      removeGoal,
      addTransfer,
      resetDemo,
      isGoal,
    }),
    [
      isReady,
      data,
      registerForItem,
      submitPayment,
      confirmPayment,
      addGoal,
      removeGoal,
      addTransfer,
      resetDemo,
      isGoal,
    ],
  );

  return (
    <SessionDataContext.Provider value={value}>
      {children}
    </SessionDataContext.Provider>
  );
}

export function useSessionData(): SessionDataContextValue {
  const ctx = useContext(SessionDataContext);
  if (!ctx) {
    throw new Error("useSessionData must be used within a <SessionDataProvider>");
  }
  return ctx;
}
