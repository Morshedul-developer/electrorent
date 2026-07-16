import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Package,
  Award,
  Star,
  Compass,
  Video,
  Cpu,
  Radio,
  Eye,
  CheckCircle2,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Gadget } from "../types";
import { GadgetCard } from "../components/GadgetCard";

interface HomeViewProps {
  gadgets: Gadget[];
  onNavigate: (view: string, itemId?: string) => void;
}

// Telemetry datasets for the Home Page Recharts section
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

export const HomeView: React.FC<HomeViewProps> = ({ gadgets, onNavigate }) => {
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate("explore");
  };

  // Curated spotlight gadgets (top 3 highest rated or key gadgets)
  const spotlightGadgets = gadgets
    .filter((g) => g.status === "Available" || g.status === "Low Stock")
    .slice(0, 3);

  // Categories with matching icons and premium descriptors
  const categoryShowcases = [
    {
      name: "Drones",
      icon: Compass,
      count: "2 Fleet Units",
      desc: "RTK Precision Cinematography & Aerial Gimbals",
      color: "text-brand-secondary",
    },
    {
      name: "Cameras",
      icon: Video,
      count: "4 Active Bodies",
      desc: "Full-Frame 8K Cinematic Sensors & Redcode Systems",
      color: "text-brand-accent",
    },
    {
      name: "Laptops",
      icon: Cpu,
      count: "3 Workstations",
      desc: "Extreme Rendering i9 & RTX Portable Platforms",
      color: "text-brand-secondary",
    },
    {
      name: "Audio",
      icon: Radio,
      iconColor: "text-brand-accent",
      count: "1 Wireless Pack",
      desc: "UHF Wireless Transmitters & Smart Gain Lavs",
      color: "text-brand-accent",
    },
  ];

  const valueProps = [
    {
      icon: ShieldCheck,
      title: "FCC Licensed & Calibrated",
      desc: "Every drone, lens, and wireless frequency is calibrated in-house to peak technical tolerances before delivery.",
    },
    {
      icon: Zap,
      title: "Instant KYC Check-In",
      desc: "Forget manual application layers. Complete automated identity verification and secure insurance holding in under 2 minutes.",
    },
    {
      icon: Package,
      title: "Serial-Specific Dispatch",
      desc: "The exact serial number you book online is the exact unit placed in your custom shockproof flight case.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Select Exact Unit",
      desc: "Browse real live inventory with serial codes and precise specs.",
    },
    {
      num: "02",
      title: "Verify Credentials",
      desc: "Complete lightning-fast digital ID validation & instant insurance.",
    },
    {
      num: "03",
      title: "Pick Up or Dispatch",
      desc: "Collect at central stage warehouse or opt for custom courier delivery.",
    },
    {
      num: "04",
      title: "Return Seamlessly",
      desc: "Drop off or return ship with our pre-paid secure cargo labels.",
    },
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Director of Photography, Apex Labs",
      quote:
        "Renting the RED V-Raptor from ElectroRent was flawless. The gear arrived sealed in an airtight hard case, and the physical serial matching gives absolute peace of mind on big budget sets.",
      rating: 5,
    },
    {
      name: "Elena Rostova",
      role: "Lead Virtualization Engineer",
      quote:
        "We needed additional Apple Vision Pro headsets for an on-site client demonstration. ElectroRent delivered calibrated headsets ready to launch. Exceptional customer response and logistics.",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-24 pb-16" id="home-view-container">
      {/* 1. HERO SEGMENT */}
      <section
        className="relative overflow-hidden pt-12 md:pt-20 pb-16 border-b border-border-main"
        id="hero-segment"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/95 to-brand-primary/5 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-brand-secondary text-xs font-semibold uppercase tracking-wider font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-ping" />
              Live Inventory Dispatch Active
            </div>

            {/* Typography */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-main leading-tight">
              Rent Studio-Grade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-primary">
                Smart Electronics
              </span>{" "}
              <br />
              With Absolute Precision.
            </h1>

            <p className="text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
              Frictionless, certified access to enterprise drones, 8K cinema
              gear, and high-performance rendering rigs. Direct checkout,
              automated verification, and secure flight cases on every booking.
            </p>

            {/* Quick search input */}
            <form
              onSubmit={handleHeroSearchSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md pt-2"
            >
              <input
                type="text"
                placeholder="Search Drones, Cameras, Laptops..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="flex-1 px-4 py-3 bg-surface-card rounded-lg border border-border-main text-text-main focus:outline-none focus:ring-1 focus:ring-brand-secondary placeholder-text-dim text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main font-semibold text-sm transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Catalog
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-brand-secondary/10 rounded-2xl blur-3xl -z-10" />
            <div className="rounded-2xl border border-border-bright overflow-hidden shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80"
                alt="DJI Inspire Cinema Drone"
                className="w-full h-[380px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-bg-dark/90 to-transparent p-6 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-secondary font-mono uppercase tracking-widest font-semibold text-[10px]">
                      Featured Asset
                    </p>
                    <h4 className="text-text-main font-bold text-sm mt-0.5">
                      DJI Inspire 3 Cinema System
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-text-muted font-mono">Day Rate</p>
                    <p className="text-brand-accent font-extrabold text-sm">
                      $450/day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE PROPS SEGMENT */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="value-props-segment"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            Engineering a Frictionless Rental Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Designed for professional production houses and elite builders who
            demand perfect reliability, instant shipping, and secure compliance.
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
              <h3 className="font-display text-base font-bold text-text-main">
                {prop.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {prop.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED SHOWCASES CATEGORY SEGMENT */}
      <section
        className="bg-surface-dim border-y border-border-main py-16"
        id="category-showcase-segment"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-secondary font-semibold">
                Ready to Dispatch
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
                Curated High-Performance Categories
              </h2>
            </div>
            <button
              onClick={() => onNavigate("explore")}
              className="text-xs font-bold text-brand-secondary hover:text-text-main flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Inspect Complete Catalog
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryShowcases.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate("explore")}
                className="p-5 bg-surface-card rounded-xl border border-border-main hover:border-brand-secondary/40 transition-all cursor-pointer group space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`p-2.5 bg-bg-dark rounded-lg border border-border-main text-brand-accent group-hover:${cat.color}`}
                  >
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
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE INVENTORY SPOTLIGHT */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="spotlight-segment"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
              Available Spotlight Gear
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Live updates directly from our Central Warehouse Dispatch queue.
            </p>
          </div>
          <button
            onClick={() => onNavigate("explore")}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-card border border-border-main text-text-main hover:border-brand-secondary transition-all cursor-pointer"
          >
            Show All Gear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spotlightGadgets.map((gadget) => (
            <GadgetCard
              key={gadget.id}
              gadget={gadget}
              onInspect={(id) => onNavigate("item-details", id)}
            />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS TIMELINE */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="how-it-works-segment"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            How The Rental Verification Process Works
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Built from scratch to optimize security while maintaining speed.
            Here is how your gear leaves our dock.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Timeline Connector Line */}
          <div className="hidden lg:block absolute top-[44px] left-[15%] right-[15%] h-[1px] bg-border-main -z-10" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative space-y-4 text-center sm:text-left"
            >
              {/* Step number marker */}
              <div className="mx-auto sm:mx-0 w-11 h-11 rounded-full bg-bg-dark border border-brand-accent/50 text-brand-secondary flex items-center justify-center font-mono text-sm font-extrabold shadow-lg shadow-brand-secondary/5">
                {step.num}
              </div>
              <h3 className="font-display text-base font-bold text-text-main pt-1">
                {step.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed mx-auto sm:mx-0 max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INTERACTIVE TELEMETRY & LIVE FLEET ANALYTICS DASHBOARD */}
      <section
        className="bg-surface-dim border-y border-border-main py-16"
        id="recharts-analytics-segment"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-brand-secondary text-[10px] font-bold uppercase tracking-wider font-mono">
              <BarChart2 className="w-3.5 h-3.5" />
              Dynamic Live Telemetry Hub
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main">
              Interactive Fleet Operations Dashboard
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Monitoring active dispatch volumes, equipment booking velocity,
              and average rental rates across our physical staging units.
            </p>
          </div>

          {/* Quick KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4 bg-surface-card rounded-xl border border-border-main text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-text-dim">
                Fleet Utilization
              </span>
              <p className="text-2xl font-display font-extrabold text-brand-secondary">
                94.8%
              </p>
              <p className="text-[9px] text-text-muted font-mono">
                Peak stage occupancy logs
              </p>
            </div>
            <div className="p-4 bg-surface-card rounded-xl border border-border-main text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-text-dim">
                Avg Turnaround
              </span>
              <p className="text-2xl font-display font-extrabold text-brand-accent">
                1.8 hrs
              </p>
              <p className="text-[9px] text-text-muted font-mono">
                KYC validation to dispatch
              </p>
            </div>
            <div className="p-4 bg-surface-card rounded-xl border border-border-main text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-text-dim">
                Operational Accuracy
              </span>
              <p className="text-2xl font-display font-extrabold text-brand-secondary">
                99.98%
              </p>
              <p className="text-[9px] text-text-muted font-mono">
                Zero sensor calibration failures
              </p>
            </div>
          </div>

          {/* Recharts Analytics Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: AreaChart (Daily booking volume velocity) */}
            <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-4">
              <div>
                <h4 className="font-display text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-secondary" />
                  Daily Rental Holdings Velocity (Jul 8 - Jul 14)
                </h4>
                <p className="text-[10px] text-text-dim font-mono">
                  Real-time telemetry tracking user dispatch and queue holds
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={telemetryData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorUtilization"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0052ff"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0052ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e1e20" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      stroke="#5f627d"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis stroke="#5f627d" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#151516",
                        border: "1px solid #2a2a2c",
                        borderRadius: "8px",
                      }}
                      labelStyle={{
                        color: "#e5e2e1",
                        fontWeight: "bold",
                        fontSize: 11,
                      }}
                    />
                    <Area
                      type="monotone"
                      name="Staging holds"
                      dataKey="bookings"
                      stroke="#0052ff"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorUtilization)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: BarChart (Average category rental rates) */}
            <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-4">
              <div>
                <h4 className="font-display text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-brand-accent" />
                  Average Day Rate Benchmark (USD)
                </h4>
                <p className="text-[10px] text-text-dim font-mono">
                  Standard enterprise specifications cost per 24 hours
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryRateData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#1e1e20" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="category"
                      stroke="#5f627d"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis stroke="#5f627d" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#151516",
                        border: "1px solid #2a2a2c",
                        borderRadius: "8px",
                      }}
                      labelStyle={{
                        color: "#e5e2e1",
                        fontWeight: "bold",
                        fontSize: 11,
                      }}
                    />
                    <Bar
                      dataKey="avgRate"
                      name="Price Per Day ($)"
                      fill="#4cd6ff"
                      radius={[4, 4, 0, 0]}
                    >
                      {categoryRateData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#4cd6ff" : "#0052ff"}
                        />
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
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="conversion-segment"
      >
        <div className="p-8 sm:p-12 bg-gradient-to-r from-surface-card to-brand-primary/10 rounded-2xl border border-border-bright relative overflow-hidden text-center sm:text-left">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
            <Cpu className="w-full h-full text-brand-secondary" />
          </div>

          <div className="max-w-2xl space-y-6">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-text-main leading-tight">
              Ready to Equip Your Next Cinematic Production?
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Unlock instant verified booking with smart electronic gear.
              Standard shipping starts next day across the continental US, with
              dedicated hand-off pick-ups at central logistics points.
            </p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <button
                onClick={() => onNavigate("explore")}
                className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main font-bold text-sm transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center gap-2 cursor-pointer"
              >
                Launch High-Tech Catalog
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="px-6 py-3 rounded-lg bg-surface-bright hover:bg-surface-bright/80 border border-border-main text-text-main font-bold text-sm transition-colors cursor-pointer"
              >
                Inspect Rental Policy
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
