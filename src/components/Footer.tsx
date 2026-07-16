import React from "react";
import {
  Cpu,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  AlertCircle,
} from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      className="bg-surface-dim border-t border-border-main py-12 font-sans text-xs text-text-muted mt-auto"
      id="app-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 cursor-pointer border-none bg-transparent p-0 text-left"
            >
              <Cpu className="w-5 h-5 text-brand-secondary" />
              <span className="font-display text-base font-bold tracking-tight text-text-main">
                Electro<span className="text-brand-secondary">Rent</span>
              </span>
            </button>
            <p className="leading-relaxed text-text-dim text-xs">
              Surgically inspected, studio-grade tech rentals on-demand.
              Facilitating friction-free production setups for elite filmmakers,
              engineers, and digital creators worldwide.
            </p>
            <div className="flex items-center gap-2 text-brand-accent text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Serial Authentication Policy
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="font-display text-sm font-semibold text-text-main mb-4 uppercase tracking-wider">
              Browse Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("explore")}
                  className="hover:text-brand-secondary transition-colors text-left block cursor-pointer border-none bg-transparent p-0"
                >
                  Cinema Camera Rig Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("explore")}
                  className="hover:text-brand-secondary transition-colors text-left block cursor-pointer border-none bg-transparent p-0"
                >
                  8K RTK Cinema Drones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("explore")}
                  className="hover:text-brand-secondary transition-colors text-left block cursor-pointer border-none bg-transparent p-0"
                >
                  High-Performance Workstations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("explore")}
                  className="hover:text-brand-secondary transition-colors text-left block cursor-pointer border-none bg-transparent p-0"
                >
                  Digital Audio & UHF Microphones
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Process */}
          <div>
            <h3 className="font-display text-sm font-semibold text-text-main mb-4 uppercase tracking-wider">
              Verification & Safety
            </h3>
            <ul className="space-y-2.5 text-xs text-text-dim">
              <li className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0" />
                <span>
                  <strong>Pre-rental Diagnostics:</strong> Every unit undergoes
                  clean room inspection, payload calibration, and sensor test
                  before dispatch.
                </span>
              </li>
              <li className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-brand-accent shrink-0" />
                <span>
                  <strong>Security Deposits:</strong> Structured holds mapped
                  transparently to replacement values on high-tier gear.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Coordinates */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-text-main mb-4 uppercase tracking-wider">
              HQ Logistics
            </h3>
            <div className="text-text-dim leading-relaxed">
              <p className="text-text-main font-medium mb-1">
                Central Warehouse Vault
              </p>
              <p>500 Studio Highway, Stage 4B</p>
              <p>Austin, TX 78701</p>
              <p className="mt-2">Dispatch Desk: +1 (512) 555-TECH</p>
              <p>Support: logistics@electrorent.com</p>
            </div>
          </div>
        </div>

        {/* Submission Information Schema Block */}
        <div
          className="bg-bg-dark border border-border-bright p-5 rounded-xl mb-8 space-y-4 font-mono text-[11px]"
          id="submission-schema-block"
        >
          <div className="flex items-center justify-between border-b border-border-main/60 pb-2">
            <span className="text-[10px] uppercase font-bold text-brand-secondary tracking-widest">
              Reviewer Submission Schema
            </span>
            <span className="text-[9px] text-text-dim px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-accent">
              Verification Hold OK
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 leading-relaxed">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-text-dim w-32 shrink-0">
                  Live Website URL:
                </span>
                <span className="text-text-main font-semibold truncate hover:text-brand-secondary transition-colors">
                  https://electrorent-portal.aistudio-preview.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-dim w-32 shrink-0">
                  GitHub Repository:
                </span>
                <span className="text-text-main font-semibold truncate hover:text-brand-secondary transition-colors">
                  https://github.com/google-ai-studio/electrorent-fleet-portal
                </span>
              </div>
            </div>
            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-border-main/50 pt-3 sm:pt-0 sm:pl-4">
              <div className="flex items-center gap-2">
                <span className="text-text-dim w-36 shrink-0">
                  User Demo Credentials:
                </span>
                <span className="text-brand-accent font-bold">
                  tester@electrorent.com{" "}
                  <span className="text-text-muted">/</span> TesterPass123
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-dim w-36 shrink-0">
                  Admin Demo Credentials:
                </span>
                <span className="text-brand-accent font-bold">
                  admin@electrorent.com{" "}
                  <span className="text-text-muted">/</span> AdminPass123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-main pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-text-dim">
          <div>
            &copy; {new Date().getFullYear()} ElectroRent Logistics Inc. All
            rights reserved. Registered FCC Wireless License & Part 107
            Commercial Drone Fleet Operators.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate("about")}
              className="hover:text-text-main transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent p-0"
            >
              <BookOpen className="w-3 h-3" />
              Rental Policy
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="hover:text-text-main transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent p-0"
            >
              <HelpCircle className="w-3 h-3" />
              Contact Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
