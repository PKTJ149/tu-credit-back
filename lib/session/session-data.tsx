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
  selectedSubjectIds?: string[];
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

export type SavedLearningItem = {
  id: string;
  itemType: LearningItemType;
  slug: string;
  name: string;
  nameEn?: string;
  detail: string;
  credits?: number;
  amount?: number;
  image?: string;
  savedAt: string;
};

/** Everything a learner accumulates in the demo. */
type SessionData = {
  registrations: LearnerRegistration[];
  payables: LearnerPayable[];
  goals: LearnerGoal[];
  savedItems: SavedLearningItem[];
  transfers: TransferRequest[];
  academicRecords: AcademicRecord[];
};

/** A brand-new learner: empty except for pre-seeded academic history. */
function makeEmptyData(): SessionData {
  return {
    registrations: seedRegistrations,
    payables: seedPayables,
    goals: [],
    savedItems: [],
    transfers: [],
    academicRecords: seedAcademicRecords,
  };
}

const seedRegistrations: LearnerRegistration[] = [
  {
    id: "demo-reg-software",
    itemName: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    itemType: "program",
    slug: "software-development",
    selectedSubjectIds: ["s1", "s4", "s7"],
    term: CURRENT_TERM,
    amount: 4500,
    status: "awaiting-payment",
    payableId: "demo-pay-software",
  },
  {
    id: "demo-reg-data",
    itemName: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    itemType: "program",
    slug: "data-analytics",
    selectedSubjectIds: ["s2", "s10", "s12"],
    term: CURRENT_TERM,
    amount: 7500,
    status: "awaiting-payment",
    payableId: "demo-pay-data",
  },
  {
    id: "demo-reg-digital-marketing-subject",
    itemName: "หลักการตลาดดิจิทัล",
    itemType: "subject",
    slug: "digital-marketing-principles",
    term: CURRENT_TERM,
    amount: 1500,
    status: "awaiting-payment",
    payableId: "demo-pay-digital-marketing-subject",
  },
  {
    id: "demo-reg-public-speaking",
    itemName: "อบรมเชิงปฏิบัติการการพูดในที่สาธารณะ",
    itemType: "program",
    slug: "public-speaking-workshop",
    selectedSubjectIds: ["s13"],
    term: "ภาคเรียนที่ 2/2568",
    amount: 1500,
    status: "active",
    payableId: "demo-pay-public-speaking",
  },
  {
    id: "demo-reg-finance",
    itemName: "อบรมความรู้ทางการเงินเบื้องต้น",
    itemType: "program",
    slug: "financial-literacy-workshop",
    selectedSubjectIds: ["s18"],
    term: "ภาคเรียนที่ 2/2568",
    amount: 1500,
    status: "active",
    payableId: "demo-pay-finance",
  },
  {
    id: "demo-reg-statistics",
    itemName: "สถิติเบื้องต้นสำหรับนักวิจัย",
    itemType: "subject",
    slug: "intro-statistics",
    term: "ภาคเรียนที่ 1/2568",
    amount: 1500,
    status: "active",
    payableId: "demo-pay-statistics",
  },
];

const seedPayables: LearnerPayable[] = [
  {
    id: "demo-pay-software",
    name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    amount: 4500,
    currency: "THB",
    state: "payment-required",
    registrationId: "demo-reg-software",
  },
  {
    id: "demo-pay-data",
    name: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    amount: 7500,
    currency: "THB",
    state: "payment-required",
    registrationId: "demo-reg-data",
  },
  {
    id: "demo-pay-digital-marketing-subject",
    name: "หลักการตลาดดิจิทัล",
    amount: 1500,
    currency: "THB",
    state: "payment-required",
    registrationId: "demo-reg-digital-marketing-subject",
  },
  {
    id: "demo-pay-public-speaking",
    name: "อบรมเชิงปฏิบัติการการพูดในที่สาธารณะ",
    amount: 1500,
    currency: "THB",
    state: "payment-confirmed",
    registrationId: "demo-reg-public-speaking",
  },
  {
    id: "demo-pay-finance",
    name: "อบรมความรู้ทางการเงินเบื้องต้น",
    amount: 1500,
    currency: "THB",
    state: "payment-confirmed",
    registrationId: "demo-reg-finance",
  },
  {
    id: "demo-pay-statistics",
    name: "สถิติเบื้องต้นสำหรับนักวิจัย",
    amount: 1500,
    currency: "THB",
    state: "payment-confirmed",
    registrationId: "demo-reg-statistics",
  },
];

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

export type SaveItemInput = Omit<SavedLearningItem, "id" | "savedAt">;

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
  /** Update a pending registration after choosing specific subjects. */
  updateRegistrationSelection: (
    registrationId: string,
    input: { amount: number; selectedSubjectIds?: string[] },
  ) => void;
  /** Cancel a pending registration and mark its payable as cancelled. */
  cancelRegistration: (registrationId: string) => void;
  /** Move a payable to "waiting for verification" (proof uploaded). */
  submitPayment: (payableId: string) => void;
  /** Approve a payment (demo shortcut); marks it confirmed + registration active. */
  confirmPayment: (payableId: string) => void;
  /** Add a program/subject as a learning goal. */
  addGoal: (input: AddGoalInput) => void;
  /** Remove a learning goal entirely. */
  removeGoal: (goalId: string) => void;
  /** Save a program/subject for later. */
  saveItem: (input: SaveItemInput) => void;
  /** Remove a saved program/subject. */
  removeSavedItem: (itemType: LearningItemType, slug: string) => void;
  /** Toggle a saved program/subject. */
  toggleSavedItem: (input: SaveItemInput) => void;
  /** Add a submitted transfer request to the history. */
  addTransfer: (input: AddTransferInput) => void;
  /** Reset everything back to a brand-new learner. */
  resetDemo: () => void;
  /** Is a given program/subject slug already a learning goal? */
  isGoal: (slug: string) => boolean;
  /** Is a given program/subject slug already saved? */
  isSavedItem: (itemType: LearningItemType, slug: string) => boolean;
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

function normalizeSessionData(raw: Partial<SessionData>): SessionData {
  const empty = makeEmptyData();
  return {
    registrations: Array.isArray(raw.registrations) ? raw.registrations : empty.registrations,
    payables: Array.isArray(raw.payables) ? raw.payables : empty.payables,
    goals: Array.isArray(raw.goals) ? raw.goals : empty.goals,
    savedItems: Array.isArray(raw.savedItems) ? raw.savedItems : empty.savedItems,
    transfers: Array.isArray(raw.transfers) ? raw.transfers : empty.transfers,
    academicRecords: Array.isArray(raw.academicRecords)
      ? raw.academicRecords
      : empty.academicRecords,
  };
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
        setData(normalizeSessionData(JSON.parse(raw) as Partial<SessionData>));
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

  const updateRegistrationSelection = useCallback(
    (registrationId: string, input: { amount: number; selectedSubjectIds?: string[] }) => {
      setData((prev) => ({
        ...prev,
        registrations: prev.registrations.map((registration) =>
          registration.id === registrationId
            ? {
                ...registration,
                amount: input.amount,
                selectedSubjectIds: input.selectedSubjectIds,
              }
            : registration,
        ),
        payables: prev.payables.map((payable) =>
          payable.registrationId === registrationId
            ? { ...payable, amount: input.amount }
            : payable,
        ),
      }));
    },
    [],
  );

  const cancelRegistration = useCallback((registrationId: string) => {
    setData((prev) => ({
      ...prev,
      registrations: prev.registrations.map((registration) =>
        registration.id === registrationId
          ? { ...registration, status: "cancelled" }
          : registration,
      ),
      payables: prev.payables.map((payable) =>
        payable.registrationId === registrationId
          ? { ...payable, state: "payment-cancelled" }
          : payable,
      ),
    }));
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

  const saveItem = useCallback((input: SaveItemInput) => {
    setData((prev) => {
      if (
        prev.savedItems.some(
          (item) => item.itemType === input.itemType && item.slug === input.slug,
        )
      ) {
        return prev;
      }

      return {
        ...prev,
        savedItems: [
          {
            id: makeId("saved"),
            ...input,
            savedAt: new Date().toISOString(),
          },
          ...prev.savedItems,
        ],
      };
    });
  }, []);

  const removeSavedItem = useCallback((itemType: LearningItemType, slug: string) => {
    setData((prev) => ({
      ...prev,
      savedItems: prev.savedItems.filter(
        (item) => item.itemType !== itemType || item.slug !== slug,
      ),
    }));
  }, []);

  const toggleSavedItem = useCallback(
    (input: SaveItemInput) => {
      setData((prev) => {
        const alreadySaved = prev.savedItems.some(
          (item) => item.itemType === input.itemType && item.slug === input.slug,
        );

        if (alreadySaved) {
          return {
            ...prev,
            savedItems: prev.savedItems.filter(
              (item) => item.itemType !== input.itemType || item.slug !== input.slug,
            ),
          };
        }

        return {
          ...prev,
          savedItems: [
            {
              id: makeId("saved"),
              ...input,
              savedAt: new Date().toISOString(),
            },
            ...prev.savedItems,
          ],
        };
      });
    },
    [],
  );

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

  const isSavedItem = useCallback(
    (itemType: LearningItemType, slug: string) =>
      data.savedItems.some((item) => item.itemType === itemType && item.slug === slug),
    [data.savedItems],
  );

  const value = useMemo<SessionDataContextValue>(
    () => ({
      isReady,
      data,
      registerForItem,
      updateRegistrationSelection,
      cancelRegistration,
      submitPayment,
      confirmPayment,
      addGoal,
      removeGoal,
      saveItem,
      removeSavedItem,
      toggleSavedItem,
      addTransfer,
      resetDemo,
      isGoal,
      isSavedItem,
    }),
    [
      isReady,
      data,
      registerForItem,
      updateRegistrationSelection,
      cancelRegistration,
      submitPayment,
      confirmPayment,
      addGoal,
      removeGoal,
      saveItem,
      removeSavedItem,
      toggleSavedItem,
      addTransfer,
      resetDemo,
      isGoal,
      isSavedItem,
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
