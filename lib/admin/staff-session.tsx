"use client";

/**
 * Staff session for the back office prototype.
 *
 * Deliberately separate from `lib/auth/auth-context.tsx`, which models a
 * *student* session. Conflating the two is how a student ends up holding an
 * officer's permissions, so the two contexts never touch.
 *
 * This is a prototype: there is no password check and no server. The role
 * switcher exists so a reviewer can see all three permission levels without
 * signing in three times — it is a demo affordance, not a feature.
 */

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { DEFAULT_STAFF_ID, getStaffById, staffUsers } from "./mock-data";
import type { StaffRole, StaffUser } from "./types";

type StaffSessionValue = {
  staff: StaffUser | null;
  role: StaffRole | null;
  isSignedIn: boolean;
  signIn: (staffId?: string) => void;
  signOut: () => void;
  /** Prototype-only: view the workspace as another role. */
  switchRole: (role: StaffRole) => void;
};

const StaffSessionContext = createContext<StaffSessionValue | null>(null);

export function StaffSessionProvider({ children }: { children: ReactNode }) {
  const [staffId, setStaffId] = useState<string | null>(DEFAULT_STAFF_ID);

  const signIn = useCallback((id: string = DEFAULT_STAFF_ID) => setStaffId(id), []);
  const signOut = useCallback(() => setStaffId(null), []);

  const switchRole = useCallback((role: StaffRole) => {
    const next = staffUsers.find((s) => s.role === role && s.status === "active");
    if (next) setStaffId(next.id);
  }, []);

  const value = useMemo<StaffSessionValue>(() => {
    const staff = staffId ? getStaffById(staffId) ?? null : null;
    return {
      staff,
      role: staff?.role ?? null,
      isSignedIn: staff !== null,
      signIn,
      signOut,
      switchRole,
    };
  }, [staffId, signIn, signOut, switchRole]);

  return <StaffSessionContext.Provider value={value}>{children}</StaffSessionContext.Provider>;
}

export function useStaffSession(): StaffSessionValue {
  const ctx = useContext(StaffSessionContext);
  if (!ctx) throw new Error("useStaffSession must be used inside <StaffSessionProvider>");
  return ctx;
}
