"use client";

/**
 * Fake auth state for the prototype.
 *
 * There is no backend or database yet. This keeps a single "am I logged in?"
 * flag in React context, backed by localStorage so it survives a refresh.
 * Every page/shell reads from here instead of hardcoding a logged-in/out header.
 * When a real backend arrives, only this file needs to change.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "cb.auth.user";

export type AuthUser = {
  /** Email or student id used to sign in */
  identifier: string;
  /** Display name shown in the header */
  name: string;
  /** Short initials for the avatar (e.g. "นศ") */
  initials: string;
};

type AuthContextValue = {
  /** True once we've read localStorage on the client (avoids UI flashing) */
  isReady: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (identifier: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Build a friendly display name + initials from whatever was typed at login. */
function makeUser(identifier: string): AuthUser {
  const trimmed = identifier.trim();
  const namePart = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;
  const name = namePart || "ผู้เรียน";
  const initials = name.slice(0, 2).toUpperCase() || "นศ";
  return { identifier: trimmed, name, initials };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Read the saved session once, on the client only.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(raw) as AuthUser);
      }
    } catch {
      // Corrupt/blocked storage — just start logged out.
    }
    setIsReady(true);
  }, []);

  const login = useCallback((identifier: string) => {
    const nextUser = makeUser(identifier);
    setUser(nextUser);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      // Ignore storage errors — the in-memory state still works.
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      isAuthenticated: user !== null,
      user,
      login,
      logout,
    }),
    [isReady, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
