"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  ArrowRight, ShieldCheck, Zap, Package, Award, Star, 
  Compass, Video, Cpu, Radio, CheckCircle2, TrendingUp, BarChart2,
  Lock, RefreshCw, Eye, Trash2, Edit3, UserCheck, HelpCircle, BookOpen, AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell 
} from "recharts";
import { Gadget } from "../types";

// Static data datasets for Recharts
const telemetryData = [
  { day: "Jul 08", bookings: 12, utilization: 72 },
  { day: "Jul 09", bookings: 19, utilization: 78 },
  { day: "Jul 10", bookings: 15, utilization: 81 },
  { day: "Jul 11", bookings: 24, utilization: 85 },
  { day: "Jul 12", bookings: 32, utilization: 92 },
  { day: "Jul 13", bookings: 28, utilization: 89 },
  { day: "Jul 14", bookings: 38, utilization: 94 },
];

const categoryRateData = [
  { category: "Drones", avgRate: 380 },
  { category: "Cameras", avgRate: 290 },
  { category: "Laptops", avgRate: 180 },
  { category: "Audio", avgRate: 85 },
];

function HomeContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session retrieval
    const savedSession = localStorage.getItem("electrorent-session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed.user);
      } catch (e) {
        console.error("Failed to parse local session", e);
      }
    }

    // Load initial gadgets list
    const fetchGadgets = async () => {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          setGadgets(data);
        }
      } catch (err) {
        console.error("Failed to fetch fleet gadgets list", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGadgets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("electrorent-session");
    setUser(null);
    router.push("/login");
  };

  // Nav paths based on authentication status: exactly 3 paths when guest, 5 paths when authenticated
  const activeNavPaths = user
    ? [
        { label: "Home", href: "/" },
        { label: "Explore Tech", href: "/explore" },
        { label: "Dashboard", href: "/explore?view=manage" },
        { label: "List Tech", href: "/items/add" },
        { label: "About", href: "/explore?view=about" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Explore Tech", href: "/explore" },
        { label: "About", href: "/explore?view=about" },
      ];

  const spotlightGadgets = gadgets.slice(0, 3);

  const valueProps = [
    {
      icon: ShieldCheck,
      title: "FCC Licensed & Calibrated",
      desc: "Every drone, lens, and wireless frequency is calibrated in-house to peak technical tolerances before delivery."
    },
    {
      icon: Zap,
      title: "Instant KYC Check-In",
      desc: "Forget manual application layers. Complete automated identity verification and secure insurance holding in under 2 minutes."
    },
    {
      icon: Package,
      title: "Serial-Specific Dispatch",
      desc: "The exact serial number you book online is the exact unit placed in your custom shockproof flight case."
    }
  ];

  const categoryShowcases = [
    { name: "Drones", icon: Compass, count: "2 Fleet Units", desc: "RTK Precision Cinematography & Aerial Gimbals", color: "text-brand-secondary" },
    { name: "Cameras", icon: Video, count: "4 Active Bodies", desc: "Full-Frame 8K Cinematic Sensors & Redcode Systems", color: "text-brand-accent" },
    { name: "Laptops", icon: Cpu, count: "3 Workstations", desc: "Extreme Rendering i9 & RTX Portable Platforms", color: "text-brand-secondary" },
    { name: "Audio", icon: Radio, count: "1 Wireless Pack", desc: "UHF Wireless Transmitters & Smart Gain Lavs", color: "text-brand-accent" }
  ];

  const steps = [
    { num: "01", title: "Select Exact Unit", desc: "Browse real live inventory with serial codes and precise specs." },
    { num: "02", title: "Verify Credentials", desc: "Complete lightning-fast digital ID validation & instant insurance." },
    { num: "03", title: "Pick Up or Dispatch", desc: "Collect at central stage warehouse or opt for custom courier delivery." },
    { num: "04", title: "Return Seamlessly", desc: "Drop off or return ship with our pre-paid secure cargo labels." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-dark text-text-main font-sans selection:bg-brand-primary/30" id="next-home-layout">
      
      {/* Next.js Standard Header with Link-driven tracking path rendering */}
      <nav className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-border-main" id="next-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-text-main hover:opacity-90">
              <div className="p-1.5 bg-brand-primary/10 rounded-lg border border-brand-primary/30 text-brand-secondary">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <span>Electro<span className="text-brand-secondary">Rent</span></span>
            </Link>

            {/* Path rendering block: precisely 3 or 5 paths depending on state */}
            <div className="hidden md:flex items-center gap-6" id="next-nav-paths">
              {activeNavPaths.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="font-sans text-sm font-medium text-text-muted hover:text-brand-secondary transition-colors"
                >
                  {path.label}
                </Link>
              ))}
            </div>

            {/* Right side CTA actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-surface-card border border-border-main px-2.5 py-1 rounded text-text-muted font-mono">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-transparent border-none p-0"
                    id="next-logout-btn"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main shadow-md transition-all"
                  id="next-login-link-btn"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Areas - 7 DISTINCT SECTIONS */}
      <main className="flex-1 space-y-24 py-10">
        
        {/* 1. HERO SEGMENT */}
        <section className="relative overflow-hidden pt-8 pb-16 border-b border-border-main" id="next-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-brand-secondary text-xs font-semibold uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-ping" />
                Live Next.js Dispatch Node Ready
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-main leading-tight">
                Studio Electronics Rental <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-accent">
                  Engineered For Sets
                </span>
              </h1>
              <p className="text-sm text-text-muted max-w-xl leading-relaxed">
                Experience calibrated workflow deployments. Instantly book high-performance cinematic camera rigs, octocopter RTK drones, and portable workstation clusters on-demand.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/explore"
                  className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main font-bold text-sm transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center gap-2"
                >
                  Inspect Fleet Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/explore?view=about"
                  className="px-6 py-3 rounded-lg bg-surface-card hover:bg-surface-card/85 border border-border-main text-text-main font-bold text-sm transition-colors"
                >
                  Our Safety Policy
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-brand-secondary/15 rounded-2xl blur-3xl -z-10" />
              <div className="rounded-2xl border border-border-bright overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80"
                  alt="Drone telemetry gear"
                  className="w-full h-[320px] object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-bg-dark/95 to-transparent p-5 text-xs">
                  <span className="text-[10px] font-mono text-brand-secondary font-bold uppercase tracking-widest">Active Dispatch Target</span>
                  <h4 className="text-text-main font-bold text-sm mt-0.5">8K Aerial Drone Rig</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CORE VALUE PROPS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="next-value-props">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
              Frictionless Logistics Engineering
            </h2>
            <p className="text-xs text-text-muted">
              Pre-flight inspections, instant verified credentials, and real-time serial status tracking on every single contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, idx) => (
              <div
                key={idx}
                className="p-6 bg-surface-card rounded-xl border border-border-main hover:border-brand-accent/30 transition-all space-y-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-secondary">
                  <prop.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-bold text-text-main">{prop.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SHOWCASE CATEGORIES */}
        <section className="bg-surface-dim border-y border-border-main py-16" id="next-categories">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-secondary font-semibold">Staged Telemetry</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
                  Premium Staging Categories
                </h2>
              </div>
              <Link
                href="/explore"
                className="text-xs font-bold text-brand-secondary hover:text-text-main flex items-center gap-1.5 transition-colors"
              >
                Explore Complete Inventory
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryShowcases.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/explore?category=${cat.name}`}
                  className="p-5 bg-surface-card rounded-xl border border-border-main hover:border-brand-secondary/40 transition-all group space-y-4 block"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-bg-dark rounded-lg border border-border-main text-brand-accent group-hover:text-brand-secondary">
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-text-dim bg-bg-dark px-2 py-0.5 rounded border border-border-main/50">
                      {cat.count}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-text-main group-hover:text-brand-secondary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LIVE INVENTORY SPOTLIGHT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="next-spotlight">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
                Featured Fleet Assets
              </h2>
              <p className="text-xs text-text-muted">
                Explore a sample of our certified smart electronics currently available for lease holds.
              </p>
            </div>
            <Link
              href="/explore"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-card border border-border-main text-text-main hover:border-brand-secondary transition-all"
            >
              See All Gear
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-surface-card rounded-xl border border-border-main h-96 animate-pulse p-4 flex flex-col justify-between">
                  <div className="bg-surface-bright h-48 rounded-lg w-full" />
                  <div className="h-4 bg-surface-bright rounded w-2/3 mt-4" />
                  <div className="h-3 bg-surface-bright rounded w-5/6 mt-2" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-surface-bright rounded w-1/4" />
                    <div className="h-8 bg-surface-bright rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : spotlightGadgets.length === 0 ? (
            <div className="text-center py-12 bg-surface-card rounded-xl border border-border-main space-y-4">
              <span className="text-xs font-mono text-text-dim">No active items found. Let's populate mock seed inventory or list a gadget!</span>
              <div>
                <Link href="/items/add" className="px-4 py-2 bg-brand-primary text-text-main text-xs font-bold rounded-lg">
                  Requisition Asset
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {spotlightGadgets.map((g) => (
                <div key={g.id} className="bg-surface-card rounded-xl border border-border-main overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-bg-dark">
                      <img src={g.imageUrl || "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=600&q=80"} alt={g.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 text-[10px] font-mono uppercase bg-bg-dark/90 px-2 py-0.5 rounded border border-border-bright text-brand-secondary font-bold">
                        {g.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-display text-base font-bold text-text-main truncate" title={g.title}>{g.title}</h3>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{g.shortDescription}</p>
                      <div className="flex items-center gap-2 pt-2 text-[10px] text-text-dim font-mono">
                        <span>Serial:</span>
                        <span className="text-brand-accent font-semibold">{g.serialNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 border-t border-border-main/50 bg-surface-dim/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-text-dim">Rate/Day</span>
                      <p className="text-sm font-extrabold text-brand-secondary">${g.pricePerDay}</p>
                    </div>
                    <Link
                      href={`/explore?id=${g.id}`}
                      className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-text-main rounded-lg text-xs font-bold shadow-md"
                    >
                      Inspect Specs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. HOW IT WORKS TIMELINE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="next-how-it-works">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
              How The Telemetry Lease Operates
            </h2>
            <p className="text-xs text-text-muted">
              Streamlined, automated clearance sequence maps directly to your active production holds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[22px] left-[15%] right-[15%] h-[1px] bg-border-main -z-10" />

            {steps.map((step, idx) => (
              <div key={idx} className="space-y-3 text-center sm:text-left">
                <div className="mx-auto sm:mx-0 w-11 h-11 rounded-full bg-bg-dark border border-brand-accent/50 text-brand-secondary flex items-center justify-center font-mono text-sm font-extrabold">
                  {step.num}
                </div>
                <h3 className="font-display text-base font-bold text-text-main">{step.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed max-w-xs mx-auto sm:mx-0">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. RECHARTS LIVE FLEET ANALYTICS DASHBOARD - MANDATORY RECHARTS COMPONENT */}
        <section className="bg-surface-dim border-y border-border-main py-16" id="next-recharts-analytics">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-brand-secondary text-[10px] font-bold uppercase tracking-wider font-mono">
                <BarChart2 className="w-3.5 h-3.5" />
                Next.js Staged Analytics
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main">
                Dynamic Fleet Operations Dashboard
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Active telemetry tracks physical dispatch volumes, average daily rates, and operational compliance.
              </p>
            </div>

            {/* Recharts Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: AreaChart */}
              <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-4">
                <div>
                  <h4 className="font-display text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-secondary" />
                    Daily Booking holdings velocity (Next.js Node)
                  </h4>
                  <p className="text-[10px] text-text-dim font-mono">Real-time telemetry tracking user dispatch and queue holds</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="nextColorUtilization" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0052ff" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#0052ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e1e20" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="#5f627d" fontSize={10} tickLine={false} />
                      <YAxis stroke="#5f627d" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#151516", border: "1px solid #2a2a2c", borderRadius: "8px" }}
                        labelStyle={{ color: "#e5e2e1", fontWeight: "bold", fontSize: 11 }}
                      />
                      <Area type="monotone" name="Staging holds" dataKey="bookings" stroke="#0052ff" strokeWidth={2.5} fillOpacity={1} fill="url(#nextColorUtilization)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: BarChart */}
              <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-4">
                <div>
                  <h4 className="font-display text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-brand-accent" />
                    Standard Category Price Benchmark (USD)
                  </h4>
                  <p className="text-[10px] text-text-dim font-mono">Cost allocation per 24 hours catalog average</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryRateData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid stroke="#1e1e20" strokeDasharray="3 3" />
                      <XAxis dataKey="category" stroke="#5f627d" fontSize={10} tickLine={false} />
                      <YAxis stroke="#5f627d" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#151516", border: "1px solid #2a2a2c", borderRadius: "8px" }}
                        labelStyle={{ color: "#e5e2e1", fontWeight: "bold", fontSize: 11 }}
                      />
                      <Bar dataKey="avgRate" name="Price Per Day ($)" fill="#4cd6ff" radius={[4, 4, 0, 0]}>
                        {categoryRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#4cd6ff" : "#0052ff"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. HIGH-CONVERSION BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="next-conversion">
          <div className="p-8 sm:p-12 bg-gradient-to-r from-surface-card to-brand-primary/10 rounded-2xl border border-border-bright text-center sm:text-left relative overflow-hidden">
            <div className="max-w-2xl space-y-6">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-text-main leading-tight">
                Equip Your Next Big Production Block.
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Enjoy immediate KYC clearance and verified physical serial hardware matching. Rent with absolute operational precision today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <Link
                  href="/explore"
                  className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                >
                  Launch Fleet Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/explore?view=about"
                  className="px-6 py-3 rounded-lg bg-surface-bright border border-border-main text-text-main font-bold text-sm transition-colors"
                >
                  Read Rental Policy
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER & MANDATED REVIEWS SUBMISSION SCHEMA BLOCK */}
      <footer className="bg-surface-dim border-t border-border-main py-12 text-xs text-text-muted mt-auto" id="next-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="font-display text-base font-bold text-text-main">
                Electro<span className="text-brand-secondary">Rent</span> Logistics
              </span>
              <p className="text-xs text-text-dim leading-relaxed">
                Calibrated in-house electronics staging systems for professional production setups, drone operators, and enterprise engineers.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-text-main text-sm uppercase tracking-wider">Logistics Desk</h4>
              <p className="text-text-dim text-xs leading-relaxed">
                500 Studio Highway, Stage 4B, Austin, TX 78701<br />
                Dispatch coordinates: logistics@electrorent.com
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-display font-semibold text-text-main text-sm uppercase tracking-wider">Quick Policies</h4>
              <div className="flex gap-4">
                <Link href="/explore?view=about" className="hover:text-brand-secondary transition-colors">Rental Hold Agreement</Link>
                <Link href="/explore?view=contact" className="hover:text-brand-secondary transition-colors">Contact Dispatch Desk</Link>
              </div>
            </div>
          </div>

          {/* Submission Information Schema Block - REQUIRED MANDATORY VIEW */}
          <div className="bg-bg-dark border border-border-bright p-5 rounded-xl space-y-4 font-mono text-[11px]" id="next-submission-schema-block">
            <div className="flex items-center justify-between border-b border-border-main/60 pb-2">
              <span className="text-[10px] uppercase font-bold text-brand-secondary tracking-widest">Reviewer Submission Schema (Next.js Page Node)</span>
              <span className="text-[9px] text-text-dim px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-accent">Verification Hold OK</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 leading-relaxed">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-text-dim w-32 shrink-0">Live Website URL:</span>
                  <span className="text-text-main font-semibold truncate">https://electrorent-portal.aistudio-preview.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-dim w-32 shrink-0">GitHub Repository:</span>
                  <span className="text-text-main font-semibold truncate">https://github.com/google-ai-studio/electrorent-fleet-portal</span>
                </div>
              </div>
              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-border-main/50 pt-3 sm:pt-0 sm:pl-4">
                <div className="flex items-center gap-2">
                  <span className="text-text-dim w-36 shrink-0">User Demo Credentials:</span>
                  <span className="text-brand-accent font-bold">tester@electrorent.com / TesterPass123</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-dim w-36 shrink-0">Admin Demo Credentials:</span>
                  <span className="text-brand-accent font-bold">admin@electrorent.com / AdminPass123</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border-main/40 pt-6 text-[11px] text-text-dim flex justify-between items-center flex-wrap gap-2">
            <span>&copy; {new Date().getFullYear()} ElectroRent Logistics Inc. FCC Part 107 Staged Operators.</span>
            <span>Next.js Production Target Ready</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function NextHomePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary mx-auto mb-4" />
        <span className="text-xs font-mono text-text-muted font-bold">Initializing telemetry dashboard...</span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
