import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Star,
  MapPin,
  Calendar,
  ShieldCheck,
  Cpu,
  ArrowLeft,
  Clock,
  Check,
  User,
  AlertTriangle,
  Layers,
  CreditCard,
} from "lucide-react";
import { Gadget } from "../types";

interface DetailsViewProps {
  itemId: string;
  user: any;
  onNavigate: (view: string, itemId?: string) => void;
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  itemId,
  user,
  onNavigate,
  onShowToast,
}) => {
  const [gadget, setGadget] = useState<Gadget | null>(null);
  const [related, setRelated] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking states
  const [rentalDays, setRentalDays] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Mock historical logs specifically matching this item type
  const [pastLogs, setPastLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        // Fetch item details
        const res = await fetch(`/api/items/${itemId}`);
        if (!res.ok) {
          throw new Error(
            "Specified gadget could not be found in active inventory.",
          );
        }
        const itemData: Gadget = await res.json();
        setGadget(itemData);

        // Fetch related items of same category
        const relRes = await fetch(`/api/items?category=${itemData.category}`);
        if (relRes.ok) {
          const relData: Gadget[] = await relRes.json();
          setRelated(relData.filter((g) => g.id !== itemData.id).slice(0, 3));
        }

        // Create some clean simulated historical logs
        const emails = [
          "cinematic-ops@vimeo.com",
          "flight-director@skyline.org",
          "workstation-rentals@nvidia.com",
        ];
        const logs = [
          {
            id: "R-8094",
            user: emails[0],
            date: "2026-06-18",
            days: 4,
            amount: itemData.pricePerDay * 4,
          },
          {
            id: "R-7128",
            user: emails[1],
            date: "2026-07-02",
            days: 2,
            amount: itemData.pricePerDay * 2,
          },
          {
            id: "R-9011",
            user: emails[2],
            date: "2026-07-11",
            days: 7,
            amount: itemData.pricePerDay * 7,
          },
        ];
        setPastLogs(logs);

        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load device telemetry.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onShowToast(
        "Authentication required. Please sign in to book equipment.",
        "info",
      );
      onNavigate("auth");
      return;
    }

    if (!gadget || gadget.status === "Rented Out") {
      onShowToast(
        "This gadget is currently not available for booking.",
        "error",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/items/${itemId}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: rentalDays,
          userEmail: user.email,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Booking transaction failed.");
      }

      setBookingSuccess(responseData.transaction);
      onShowToast(
        `Equipment reserved successfully! ID: ${responseData.transaction.id}`,
        "success",
      );

      // Refresh gadget status locally
      setGadget((prev) => (prev ? { ...prev, status: "Rented Out" } : null));
    } catch (err: any) {
      onShowToast(err.message || "Checkout failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-6 bg-surface-card rounded w-24" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-card h-[400px] rounded-xl w-full" />
            <div className="h-6 bg-surface-card rounded w-1/3" />
            <div className="h-4 bg-surface-card rounded w-full" />
          </div>
          <div className="lg:col-span-5 bg-surface-card h-[350px] rounded-xl w-full" />
        </div>
      </div>
    );
  }

  if (error || !gadget) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-card rounded-2xl border border-border-main text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="font-display text-lg font-bold text-text-main">
          Telemetry Error
        </h2>
        <p className="text-xs text-text-muted leading-relaxed">
          {error ||
            "The requested gadget telemetry coordinate was offline or retired."}
        </p>
        <button
          onClick={() => onNavigate("explore")}
          className="px-5 py-2.5 rounded-lg bg-brand-primary text-text-main text-xs font-bold"
        >
          Return to Fleet Catalog
        </button>
      </div>
    );
  }

  const totalCost = gadget.pricePerDay * rentalDays;

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12"
      id="details-view-container"
    >
      {/* Back CTA Button */}
      <button
        onClick={() => onNavigate("explore")}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-card border border-border-main hover:border-brand-secondary text-xs text-text-muted hover:text-text-main transition-all cursor-pointer font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Fleet List
      </button>

      {/* Main Asset Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Hand: Asymmetric Gallery & Core Telemetry details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Visual Image Banner */}
          <div className="rounded-xl border border-border-bright overflow-hidden bg-[#151515] h-[440px] relative shadow-lg">
            <img
              src={gadget.imageUrl}
              alt={gadget.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Category tag */}
            <div className="absolute top-4 left-4 bg-bg-dark/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-border-main text-xs font-mono uppercase tracking-widest text-brand-secondary font-semibold">
              {gadget.category}
            </div>

            {/* Exact serial display overlay */}
            <div className="absolute bottom-4 left-4 bg-bg-dark/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-border-main text-xs font-mono text-text-dim">
              Serial ID:{" "}
              <strong className="text-brand-accent tracking-wider font-semibold">
                {gadget.serialNumber}
              </strong>
            </div>
          </div>

          {/* Title, ratings and geographical logistics */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main leading-tight">
                {gadget.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted font-mono">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-text-main text-sm">
                  {gadget.rating.toFixed(2)}
                </span>
                <span className="text-text-dim">/ 5.0 (Calibrated)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-secondary" />
                <span>{gadget.location}</span>
              </div>
            </div>

            <p className="text-sm text-text-muted leading-relaxed pt-2 border-t border-border-main/50">
              {gadget.description}
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4 pt-6 border-t border-border-main/50">
            <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider">
              High-Fidelity Integration Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gadget.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-text-muted bg-surface-card p-3 rounded-lg border border-border-main/50"
                >
                  <Check className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exact Telemetry Specifications Box */}
          <div className="p-6 bg-surface-card rounded-xl border border-border-main space-y-4">
            <h3 className="font-display text-sm font-bold text-text-main flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-accent" />
              Surgically Certified Calibration Specs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(gadget.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 border-b border-border-main/40 text-xs"
                >
                  <span className="font-mono text-text-dim text-[11px] uppercase tracking-wide">
                    {key}
                  </span>
                  <span className="font-medium text-text-main text-right ml-2">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand: Interactive Booking Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Booking Widget Card */}
          <div className="bg-surface-card rounded-xl border border-border-bright p-6 space-y-6 shadow-xl relative overflow-hidden">
            {/* Top border colored accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary" />

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display text-base font-bold text-text-main">
                  Configure Rental Terms
                </h3>
                <p className="text-[11px] text-text-dim font-mono mt-0.5">
                  Automated KYC dispatch holds apply
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-dim block">Day Rate</span>
                <span className="text-xl font-display font-extrabold text-brand-secondary">
                  ${gadget.pricePerDay}
                </span>
                <span className="text-xs text-text-dim">/day</span>
              </div>
            </div>

            {/* If successfully booked already */}
            {bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-4 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">
                    Rental Reserved!
                  </h4>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    Order Code:{" "}
                    <strong className="font-mono font-bold">
                      {bookingSuccess.id}
                    </strong>
                  </p>
                </div>
                <div className="border-t border-emerald-500/10 pt-3 text-left text-xs space-y-1.5 font-mono text-text-muted">
                  <div className="flex justify-between">
                    <span>Gadget:</span>
                    <span
                      className="text-text-main truncate max-w-[150px]"
                      title={bookingSuccess.gadgetTitle}
                    >
                      {bookingSuccess.gadgetTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days Term:</span>
                    <span className="text-text-main">
                      {bookingSuccess.days} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="text-brand-secondary font-bold">
                      ${bookingSuccess.totalCost}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Serial Code:</span>
                    <span className="text-brand-accent">
                      {bookingSuccess.serialNumber}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-text-dim leading-relaxed">
                  Head to HQ Stage 4B with your dynamic Order QR code to
                  complete physical pick-up. A prepaid returning label is
                  included inside the flight kit.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Availability banner */}
                {gadget.status === "Rented Out" ? (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      This asset is currently rented out to another crew until
                      next week.
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>
                      Unit verified available in central logistics dispatch.
                    </span>
                  </div>
                )}

                {/* Days selection slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
                      Rental Duration
                    </label>
                    <span className="font-mono text-brand-secondary font-bold">
                      {rentalDays} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={rentalDays}
                    disabled={gadget.status === "Rented Out"}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    className="w-full accent-brand-primary cursor-pointer bg-bg-dark h-1.5 rounded-lg appearance-none disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-text-dim">
                    <span>1 Day</span>
                    <span>15 Days</span>
                    <span>30 Days</span>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="p-4 bg-bg-dark rounded-lg border border-border-main space-y-2.5">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Day Rate:</span>
                    <span>
                      ${gadget.pricePerDay} &times; {rentalDays}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Pre-Rental Inspection hold:</span>
                    <span>$0 (Free)</span>
                  </div>
                  <div className="border-t border-border-main/50 pt-2.5 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-text-main">
                      Calculated Total:
                    </span>
                    <div className="flex items-baseline">
                      <span className="text-lg font-display font-extrabold text-brand-secondary">
                        ${totalCost}
                      </span>
                      <span className="text-[10px] text-text-dim ml-0.5">
                        {" "}
                        USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Action */}
                <button
                  type="submit"
                  disabled={submitting || gadget.status === "Rented Out"}
                  className="w-full py-3.5 font-bold rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main text-xs uppercase tracking-wider shadow-lg hover:shadow-brand-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  id="checkout-book-btn"
                >
                  <CreditCard className="w-4 h-4" />
                  {submitting
                    ? "Securing Dispatch hold..."
                    : user
                      ? "Confirm Rental Hold"
                      : "Sign In & Reserve Asset"}
                </button>
              </form>
            )}

            {/* Safe Policy Note */}
            <div className="text-[10px] text-text-dim leading-relaxed border-t border-border-main/50 pt-4 flex gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
              <span>
                Full compliance with part 107 rules and proper stage handling
                guidelines required. Damages fully protected up to selected
                equipment insurance structures.
              </span>
            </div>
          </div>

          {/* Asset Logs / History Track */}
          <div className="bg-surface-card rounded-xl border border-border-main p-6 space-y-4">
            <h4 className="font-display text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-secondary" />
              Asset Rent Track Logs (Serial ID Telemetry)
            </h4>

            <div className="space-y-3">
              {pastLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs p-3 bg-bg-dark rounded-lg border border-border-main/40 font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-text-main text-[11px] font-semibold">
                      <User className="w-3 h-3 text-brand-accent" />
                      {log.user}
                    </div>
                    <div className="text-[10px] text-text-dim flex items-center gap-1">
                      <span>Term ID: {log.id}</span>
                      <span>&bull;</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-secondary font-bold text-xs block">
                      ${log.amount}
                    </span>
                    <span className="text-[9px] text-text-dim">
                      {log.days} days rented
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested assets section */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-border-main/60 space-y-6">
          <h3 className="font-display text-xl font-bold text-text-main">
            Related Category Suggests
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((g) => (
              <div
                key={g.id}
                onClick={() => onNavigate("item-details", g.id)}
                className="p-4 bg-surface-card rounded-xl border border-border-main hover:border-brand-secondary/40 transition-all cursor-pointer group flex items-center gap-4"
              >
                <img
                  src={g.imageUrl}
                  alt={g.title}
                  className="w-16 h-16 object-cover rounded-lg bg-bg-dark shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text-main group-hover:text-brand-secondary transition-colors truncate">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-text-dim font-mono mt-1">
                    ${g.pricePerDay}/day
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
