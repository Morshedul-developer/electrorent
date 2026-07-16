"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IUser } from "../types";

interface AppContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("electrorent-session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUserState(parsed.user);
      } catch (err) {
        console.error("Corrupted local session cache", err);
        localStorage.removeItem("electrorent-session");
      }
    }
  }, []);

  const setUser = (newUser: IUser | null) => {
    setUserState(newUser);
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("electrorent-session");
    showToast("Signed out of logistics portal successfully.", "success");
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const dismissToast = () => {
    setToast(null);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <AppContext.Provider value={{ user, setUser, logout, toast, showToast, dismissToast }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
