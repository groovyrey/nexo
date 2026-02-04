"use client";

import { createContext, useContext } from "react";
import { useAuth } from "./hooks";
import { ReactNode } from "react";

const AuthContext = createContext<{ user: User | null } | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
