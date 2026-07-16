import React from "react";
import {
  BookOpen,
  ShieldCheck,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface InfoViewProps {
  type: "about" | "contact";
}

export const InfoView: React.FC<InfoViewProps> = ({ type }) => {
  if (type === "about") {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-12 space-y-8"
        id="about-info-view"
      >
        <div className="border-b border-border-main pb-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-brand-secondary font-semibold">
            Regulatory Protocol
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text-main mt-1">
            Rental Fleet Policies
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Surgically detailed handling rules and insurance covenants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-surface-card rounded-xl border border-border-main space-y-3">
            <ShieldCheck className="w-6 h-6 text-brand-secondary" />
            <h3 className="font-display text-sm font-bold text-text-main uppercase">
              Calibration Verification
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Every DJI Drone and Sony Cinema body undergoes full pre-flight
              sensor diagnostics and calibration sweeps before leaving our cage.
            </p>
          </div>

          <div className="p-5 bg-surface-card rounded-xl border border-border-main space-y-3">
            <FileText className="w-6 h-6 text-brand-accent" />
            <h3 className="font-display text-sm font-bold text-text-main uppercase">
              Part 107 Compliance
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Renters of drones must provide a current FAA Part 107 Commercial
              Remote Pilot License. Simulated operators bypass this hold.
            </p>
          </div>

          <div className="p-5 bg-surface-card rounded-xl border border-border-main space-y-3">
            <BookOpen className="w-6 h-6 text-brand-secondary" />
            <h3 className="font-display text-sm font-bold text-text-main uppercase">
              Damage Protection
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              A standard damage waiver is pre-calculated inside the rental tier,
              ensuring peace of mind up to full device replacement value holds.
            </p>
          </div>
        </div>

        <div className="p-6 bg-surface-card rounded-xl border border-border-bright space-y-4">
          <h2 className="font-display text-base font-bold text-text-main">
            Frequently Questioned Operations
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-brand-accent font-sans">
                Q: Can I schedule a same-day courier dispatch?
              </h4>
              <p className="text-text-muted leading-relaxed">
                A: Yes. All bookings submitted before 10:00 AM CST are eligible
                for lightning local studio courier delivery within Austin, SF,
                or NY metro coordinates.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-accent font-sans">
                Q: Are batteries and custom hard travel cases included?
              </h4>
              <p className="text-text-muted leading-relaxed">
                A: Absolutely. Every high-tier rental is housed inside custom
                airtight, waterproof Pelican flight travel cases with at least
                two high-capacity batteries and dual fast-chargers.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-xl mx-auto px-4 py-12 space-y-8"
      id="contact-info-view"
    >
      <div className="border-b border-border-main pb-4 text-center">
        <span className="text-[10px] uppercase font-mono tracking-widest text-brand-secondary font-semibold">
          HQ Logistics Coordinate
        </span>
        <h1 className="font-display text-3xl font-extrabold text-text-main mt-1">
          Dispatch Desk
        </h1>
        <p className="text-xs text-text-muted mt-1">
          24/7 technical logistics hotline and coordinates
        </p>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-bright p-6 space-y-6">
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-4 p-4 bg-bg-dark rounded-lg border border-border-main">
            <Phone className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-text-main uppercase text-[10px] tracking-wider font-mono">
                Central Hotline
              </h4>
              <p className="text-text-muted mt-1 font-semibold text-sm">
                +1 (512) 555-TECH
              </p>
              <p className="text-[10px] text-text-dim mt-0.5">
                Available for direct telemetry emergency sweeps 24 hours a day.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-bg-dark rounded-lg border border-border-main">
            <Mail className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-text-main uppercase text-[10px] tracking-wider font-mono">
                Operations Email
              </h4>
              <p className="text-text-muted mt-1 font-semibold text-sm">
                logistics@electrorent.com
              </p>
              <p className="text-[10px] text-text-dim mt-0.5">
                Submit custom fleet requisitions and commercial tax exemptions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-bg-dark rounded-lg border border-border-main">
            <HelpCircle className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-text-main uppercase text-[10px] tracking-wider font-mono">
                Main Stage Logistics Base
              </h4>
              <p className="text-text-muted mt-1 leading-relaxed">
                Central Warehouse Vault, Stage 4B
                <br />
                500 Studio Highway, Austin, TX 78701
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-[11px] text-brand-accent leading-relaxed text-center">
          For physical pick-ups, please ensure your digital Order Code is ready
          on screen. Verification completes via immediate QR telemetry scan.
        </div>
      </div>
    </div>
  );
};
