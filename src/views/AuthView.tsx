import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  LogIn,
  UserCheck,
  Key,
  Mail,
  ShieldAlert as UserIcon,
} from "lucide-react";

interface AuthViewProps {
  onLoginSuccess: (session: any) => void;
  onNavigate: (view: string) => void;
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  onNavigate,
  onShowToast,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

  const validateField = (
    fieldName: "email" | "password" | "name",
    value: string,
  ) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors((prev) => {
      const copy = { ...prev };
      if (fieldName === "email") {
        if (!value) {
          copy.email = "Email address is required.";
        } else if (!emailRegex.test(value)) {
          copy.email =
            "Please input a valid email layout (e.g., operator@studio.com).";
        } else {
          delete copy.email;
        }
      } else if (fieldName === "password") {
        if (!value) {
          copy.password = "Access passcode is required.";
        } else if (value.length < 6) {
          copy.password = "Passcode must be at least 6 characters long.";
        } else {
          delete copy.password;
        }
      } else if (fieldName === "name") {
        if (!isLogin && !value) {
          copy.name = "Full studio name is required.";
        } else if (!isLogin && value.length < 3) {
          copy.name = "Studio name must be at least 3 characters.";
        } else {
          delete copy.name;
        }
      }
      return copy;
    });
  };

  // Quick Demo logins as mandated by spec sheet
  const handleAutofill = (role: "admin" | "tester") => {
    setErrors({});
    if (role === "admin") {
      setEmail("admin@electrorent.com");
      setPassword("AdminPass123");
      setName("Chief Admin (ElectroRent)");
      onShowToast("Autofilled Admin credentials successfully.", "success");
    } else {
      setEmail("tester@electrorent.com");
      setPassword("TesterPass123");
      setName("Elite Creator (Tester)");
      onShowToast("Autofilled Tester credentials successfully.", "success");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final verification run
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const finalErrors: typeof errors = {};

    if (!email) {
      finalErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      finalErrors.email = "Please input a valid email layout.";
    }

    if (!password) {
      finalErrors.password = "Access passcode is required.";
    } else if (password.length < 6) {
      finalErrors.password = "Passcode must be at least 6 characters long.";
    }

    if (!isLogin) {
      if (!name) {
        finalErrors.name = "Full studio name is required.";
      } else if (name.length < 3) {
        finalErrors.name = "Studio name must be at least 3 characters.";
      }
    }

    setErrors(finalErrors);
    if (Object.keys(finalErrors).length > 0) {
      onShowToast("Please correct validation errors on the form.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // If registering and user wants to set custom name, let's inject it
      if (!isLogin && name) {
        data.user.name = name;
      }

      onLoginSuccess(data);
      onShowToast(`Signed in successfully as ${data.user.name}!`, "success");
      onNavigate("home");
    } catch (err: any) {
      onShowToast(err.message || "Login authentication rejected.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12" id="auth-view-container">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card rounded-2xl border border-border-bright p-8 shadow-2xl relative overflow-hidden space-y-6"
      >
        {/* Top visual glow line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-primary" />

        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-text-main">
            {isLogin ? "Access Logistics Portal" : "Join ElectroRent Fleet"}
          </h1>
          <p className="text-xs text-text-muted">
            {isLogin
              ? "Access verified smart gadget inventories and reservations hold"
              : "Register dynamic studio profile to lock high-tier equipment holds"}
          </p>
        </div>

        {/* MANDATORY PRESET CREDENTIALS PANEL */}
        <div className="bg-bg-dark/80 rounded-xl border border-border-main p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-secondary">
            <ShieldAlert className="w-4 h-4 text-brand-accent shrink-0 animate-pulse" />
            <span>MANDATORY QUICK DEMO PRESETS</span>
          </div>
          <p className="text-[10px] text-text-dim leading-relaxed">
            Instantly bypass manual typing tests by selecting a verified demo
            account role profile below.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleAutofill("tester")}
              className="py-2.5 px-3 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-brand-accent hover:text-text-main rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              id="autofill-tester-btn"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Autofill Tester Account
            </button>
            <button
              type="button"
              onClick={() => handleAutofill("admin")}
              className="py-2.5 px-3 bg-brand-secondary/15 hover:bg-brand-secondary/25 border border-brand-secondary/30 text-brand-secondary hover:text-text-main rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              id="autofill-admin-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              Autofill Admin Account
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border-main text-xs font-semibold">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-2.5 text-center transition-colors ${
              isLogin
                ? "text-brand-secondary border-b-2 border-brand-secondary"
                : "text-text-dim hover:text-text-main"
            }`}
          >
            Sign In Account
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-2.5 text-center transition-colors ${
              !isLogin
                ? "text-brand-secondary border-b-2 border-brand-secondary"
                : "text-text-dim hover:text-text-main"
            }`}
          >
            Register Profile
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim flex items-center gap-1.5">
                Full Studio Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Apex Visuals LLC"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateField("name", e.target.value);
                  }}
                  onBlur={() => validateField("name", name)}
                  className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                    errors.name
                      ? "border-rose-500/50 focus:ring-rose-500/40"
                      : "border-border-main focus:ring-brand-secondary"
                  }`}
                  required={!isLogin}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-rose-400 font-mono tracking-wide mt-1">
                  ⚠ {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-accent" />
              Studio Email Coordinates
            </label>
            <input
              type="email"
              placeholder="operator@studio.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              onBlur={() => validateField("email", email)}
              className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                errors.email
                  ? "border-rose-500/50 focus:ring-rose-500/40"
                  : "border-border-main focus:ring-brand-secondary"
              }`}
              required
            />
            {errors.email && (
              <p className="text-[10px] text-rose-400 font-mono tracking-wide mt-1">
                ⚠ {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-brand-secondary" />
              Portal Access Passcode
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              onBlur={() => validateField("password", password)}
              className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                errors.password
                  ? "border-rose-500/50 focus:ring-rose-500/40"
                  : "border-border-main focus:ring-brand-secondary"
              }`}
              required
            />
            {errors.password && (
              <p className="text-[10px] text-rose-400 font-mono tracking-wide mt-1">
                ⚠ {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-text-main text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-brand-primary/20 transition-all cursor-pointer"
            id="auth-submit-btn"
          >
            {submitting
              ? "Processing Verification Check..."
              : isLogin
                ? "Secure Login Access"
                : "Create Fleet Account"}
          </button>
        </form>

        <p className="text-[10px] text-text-dim text-center leading-relaxed">
          Authorized logins fully comply with FAA Part 107 telemetry
          verification guidelines and general studio equipment liability
          insurance covenants.
        </p>
      </motion.div>
    </div>
  );
};
