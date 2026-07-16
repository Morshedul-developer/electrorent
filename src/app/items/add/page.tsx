"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PlusCircle, ArrowLeft, Cpu, ShieldAlert, AlertTriangle, RefreshCw } from "lucide-react";

function AddItemContent() {
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Drones");
  const [pricePerDay, setPricePerDay] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [location, setLocation] = useState("Central Warehouse Stage 4B, Austin");
  
  // Custom specs and features
  const [spec1Name, setSpec1Name] = useState("Primary Sensor");
  const [spec1Val, setSpec1Val] = useState("");
  const [spec2Name, setSpec2Name] = useState("Calibration Spec");
  const [spec2Val, setSpec2Val] = useState("");
  const [feature1, setFeature1] = useState("");
  const [feature2, setFeature2] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    pricePerDay?: string;
    serialNumber?: string;
    imageUrl?: string;
    shortDescription?: string;
    description?: string;
  }>({});

  // Sync user session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("electrorent-session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed.user);
      } catch (err) {
        console.error("Corrupted local session cache", err);
      }
    }
    setAuthLoading(false);
  }, []);

  const validateField = (fieldName: string, val: string) => {
    setErrors((prev) => {
      const copy = { ...prev };
      switch (fieldName) {
        case "title":
          if (!val.trim()) {
            copy.title = "Asset Title is required.";
          } else if (val.trim().length < 3) {
            copy.title = "Asset Title must be at least 3 characters.";
          } else {
            delete copy.title;
          }
          break;
        case "pricePerDay":
          const rateNum = Number(val);
          if (!val) {
            copy.pricePerDay = "Daily Rate is required.";
          } else if (isNaN(rateNum) || rateNum <= 0) {
            copy.pricePerDay = "Daily Rate must be a positive number.";
          } else if (rateNum > 10000) {
            copy.pricePerDay = "Daily Rate is restricted to $10,000 maximum.";
          } else {
            delete copy.pricePerDay;
          }
          break;
        case "serialNumber":
          if (!val.trim()) {
            copy.serialNumber = "Unique Serial Number is required.";
          } else if (!val.startsWith("SN-")) {
            copy.serialNumber = "Serial number must start with prefix 'SN-' (e.g. SN-DJI-1234).";
          } else if (val.trim().length < 6) {
            copy.serialNumber = "Serial number must be at least 6 characters long.";
          } else {
            delete copy.serialNumber;
          }
          break;
        case "imageUrl":
          if (val && !/^https?:\/\/.+/i.test(val)) {
            copy.imageUrl = "Please input a valid URL starting with http:// or https://";
          } else {
            delete copy.imageUrl;
          }
          break;
        case "shortDescription":
          if (val && val.length < 10) {
            copy.shortDescription = "Short description must be at least 10 characters.";
          } else {
            delete copy.shortDescription;
          }
          break;
        case "description":
          if (val && val.length < 20) {
            copy.description = "Detailed technical summary must be at least 20 characters.";
          } else {
            delete copy.description;
          }
          break;
      }
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Cross-validation check
    const finalErrors: typeof errors = {};
    if (!title.trim() || title.trim().length < 3) {
      finalErrors.title = "Asset Title must be at least 3 characters.";
    }
    const rateNum = Number(pricePerDay);
    if (!pricePerDay || isNaN(rateNum) || rateNum <= 0) {
      finalErrors.pricePerDay = "Daily Rate must be a positive number.";
    }
    if (!serialNumber.trim()) {
      finalErrors.serialNumber = "Unique Serial Number is required.";
    } else if (!serialNumber.startsWith("SN-")) {
      finalErrors.serialNumber = "Serial number must start with prefix 'SN-' (e.g. SN-DJI-1234).";
    } else if (serialNumber.trim().length < 6) {
      finalErrors.serialNumber = "Serial number must be at least 6 characters.";
    }
    if (imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
      finalErrors.imageUrl = "Please input a valid URL starting with http:// or https://";
    }
    if (shortDescription && shortDescription.length < 10) {
      finalErrors.shortDescription = "Short description must be at least 10 characters.";
    }
    if (description && description.length < 20) {
      finalErrors.description = "Detailed technical summary must be at least 20 characters.";
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length > 0) {
      setFormError("Please correct all validation errors highlighted in the requisition form.");
      return;
    }

    setSubmitting(true);
    try {
      const specifications: { [key: string]: string } = {};
      if (spec1Name && spec1Val) specifications[spec1Name] = spec1Val;
      if (spec2Name && spec2Val) specifications[spec2Name] = spec2Val;

      const features: string[] = [];
      if (feature1) features.push(feature1);
      if (feature2) features.push(feature2);

      const payload = {
        title,
        category,
        pricePerDay: Number(pricePerDay),
        imageUrl: imageUrl || undefined,
        shortDescription,
        description,
        serialNumber,
        location,
        status: "Available",
        specifications,
        features
      };

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Inventory database rejection.");
      }

      router.push("/explore");
    } catch (err: any) {
      setFormError(err.message || "Failed to commit item.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto my-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary mx-auto mb-4" />
        <span className="text-xs font-mono text-text-muted">Verifying credentials hold...</span>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-card rounded-2xl border border-border-main text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
        <h2 className="font-display text-lg font-bold text-text-main animate-pulse">Access Denied</h2>
        <p className="text-xs text-text-muted leading-relaxed">
          Only authorized administrators with chief logistics clearance can add items to the ElectroRent fleet.
        </p>
        <button onClick={() => router.push("/")} className="px-5 py-2.5 bg-brand-primary rounded-lg text-xs font-bold text-text-main cursor-pointer border-none shadow-md">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8" id="next-add-item-container">
      
      {/* Return Navigation Row */}
      <button
        onClick={() => router.push("/explore")}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-card border border-border-main hover:border-brand-secondary text-xs text-text-muted hover:text-text-main transition-all font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Catalog Dashboard
      </button>

      {/* Main requisition canvas */}
      <div className="bg-surface-card border border-border-bright rounded-xl p-8 shadow-xl relative overflow-hidden">
        {/* Glow strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-secondary to-brand-accent" />

        <div className="flex items-center gap-3 border-b border-border-main pb-4 mb-6">
          <div className="p-2 bg-brand-secondary/15 rounded-lg text-brand-secondary">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-text-main">Requisition New Fleet Asset</h1>
            <p className="text-xs text-text-dim mt-0.5">Surgically register certified smart hardware in central database</p>
          </div>
        </div>

        {formError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2.5 mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Inputs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Device Asset Title *</label>
              <input
                type="text"
                placeholder="e.g. DJI Mavic 3 Cine Pro"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  validateField("title", e.target.value);
                }}
                onBlur={() => validateField("title", title)}
                className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                  errors.title 
                    ? "border-rose-500/50 focus:ring-rose-500/40" 
                    : "border-border-main focus:ring-brand-secondary"
                }`}
                required
              />
              {errors.title && (
                <p className="text-[10px] text-rose-400 font-mono mt-1">
                  ⚠ {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Category Allocation *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer"
              >
                <option value="Drones">Drones</option>
                <option value="Cameras">Cameras</option>
                <option value="Laptops">Laptops</option>
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Day Rental Rate (USD) *</label>
              <input
                type="number"
                placeholder="e.g. 150"
                value={pricePerDay}
                onChange={(e) => {
                  setPricePerDay(e.target.value);
                  validateField("pricePerDay", e.target.value);
                }}
                onBlur={() => validateField("pricePerDay", pricePerDay)}
                className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                  errors.pricePerDay 
                    ? "border-rose-500/50 focus:ring-rose-500/40" 
                    : "border-border-main focus:ring-brand-secondary"
                }`}
                required
              />
              {errors.pricePerDay && (
                <p className="text-[10px] text-rose-400 font-mono mt-1">
                  ⚠ {errors.pricePerDay}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Unique physical Serial Number *</label>
              <input
                type="text"
                placeholder="e.g. SN-DJI-5590-M3C"
                value={serialNumber}
                onChange={(e) => {
                  setSerialNumber(e.target.value);
                  validateField("serialNumber", e.target.value);
                }}
                onBlur={() => validateField("serialNumber", serialNumber)}
                className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                  errors.serialNumber 
                    ? "border-rose-500/50 focus:ring-rose-500/40" 
                    : "border-border-main focus:ring-brand-secondary"
                }`}
                required
              />
              {errors.serialNumber && (
                <p className="text-[10px] text-rose-400 font-mono mt-1">
                  ⚠ {errors.serialNumber}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Visual Asset Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  validateField("imageUrl", e.target.value);
                }}
                onBlur={() => validateField("imageUrl", imageUrl)}
                className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                  errors.imageUrl 
                    ? "border-rose-500/50 focus:ring-rose-500/40" 
                    : "border-border-main focus:ring-brand-secondary"
                }`}
              />
              {errors.imageUrl && (
                <p className="text-[10px] text-rose-400 font-mono mt-1">
                  ⚠ {errors.imageUrl}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Short Description (Catalog Preview)</label>
              <input
                type="text"
                placeholder="High-performance foldable cinema drone with ProRes recording capacity..."
                value={shortDescription}
                onChange={(e) => {
                  setShortDescription(e.target.value);
                  validateField("shortDescription", e.target.value);
                }}
                onBlur={() => validateField("shortDescription", shortDescription)}
                className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim ${
                  errors.shortDescription 
                    ? "border-rose-500/50 focus:ring-rose-500/40" 
                    : "border-border-main focus:ring-brand-secondary"
                }`}
              />
              {errors.shortDescription && (
                <p className="text-[10px] text-rose-400 font-mono mt-1">
                  ⚠ {errors.shortDescription}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Detailed Description</label>
              <textarea
                placeholder="Provide a comprehensive technical summary detailing sensor capabilities, recommended use cases, dynamic limits, and lens packages."
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  validateField("description", e.target.value);
                }}
                onBlur={() => validateField("description", description)}
                className={`w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border text-text-main text-xs focus:outline-none focus:ring-1 placeholder-text-dim resize-none ${
                  errors.description 
                    ? "border-rose-500/50 focus:ring-rose-500/40" 
                    : "border-border-main focus:ring-brand-secondary"
                }`}
              />
              {errors.description && (
                <p className="text-[10px] text-rose-400 font-mono mt-1">
                  ⚠ {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">Physical Logistics Location</label>
              <input
                type="text"
                placeholder="e.g. Central Warehouse Stage 4B, Austin"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary placeholder-text-dim"
              />
            </div>

          </div>

          {/* Calibration Panel */}
          <div className="border-t border-border-main/50 pt-6 space-y-4">
            <h3 className="font-display text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-secondary" />
              Surgically Certified Calibration Specs (Key-Value)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input
                  type="text"
                  value={spec1Name}
                  onChange={(e) => setSpec1Name(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-bright rounded text-xs text-text-main border border-border-main/50 font-mono"
                  placeholder="Spec 1 Title"
                />
                <input
                  type="text"
                  value={spec1Val}
                  onChange={(e) => setSpec1Val(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-dark rounded text-xs text-text-muted border border-border-main focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                  placeholder="Spec 1 Measurement Value (e.g. Full-Frame CMOS)"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={spec2Name}
                  onChange={(e) => setSpec2Name(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-bright rounded text-xs text-text-main border border-border-main/50 font-mono"
                  placeholder="Spec 2 Title"
                />
                <input
                  type="text"
                  value={spec2Val}
                  onChange={(e) => setSpec2Val(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-dark rounded text-xs text-text-muted border border-border-main focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                  placeholder="Spec 2 Measurement Value (e.g. 5-Axis active stabilization)"
                />
              </div>
            </div>
          </div>

          {/* Integration Features Panel */}
          <div className="border-t border-border-main/50 pt-6 space-y-4">
            <h3 className="font-display text-xs font-bold text-text-main uppercase tracking-wider">
              Integration Features Checklist (Bullets)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Bullet Point 1 (e.g. Centimeter-level RTK Flight precision)"
                value={feature1}
                onChange={(e) => setFeature1(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary placeholder-text-dim"
              />
              <input
                type="text"
                placeholder="Bullet Point 2 (e.g. Integrated cinema ProRes RAW support)"
                value={feature2}
                onChange={(e) => setFeature2(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary placeholder-text-dim"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-border-main/50 pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/explore")}
              className="px-6 py-2.5 rounded-lg bg-surface-bright text-text-main text-xs font-bold transition-colors border-none cursor-pointer"
            >
              Cancel Setup
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main text-xs font-bold transition-colors cursor-pointer border-none shadow-md"
            >
              {submitting ? "Writing telemetry payload..." : "Commit Fleet Requisition"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

export default function AddItemPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary mx-auto mb-4" />
        <span className="text-xs font-mono text-text-muted font-bold">Mounting requisition catalog...</span>
      </div>
    }>
      <AddItemContent />
    </Suspense>
  );
}
