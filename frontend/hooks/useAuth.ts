"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, AuthState } from "@/types";
import { getSession, signOut as authSignOut } from "@/lib/auth";

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const checkSession = useCallback(async () => {
    try {
      const user = await getSession();
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signOut = useCallback(async () => {
    try {
      await authSignOut();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [router]);

  return {
    ...state,
    signOut,
    refreshSession: checkSession,
  };
}
