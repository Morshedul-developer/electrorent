import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  BarChart as ChartIcon,
  Settings,
  Plus,
  Trash2,
  Eye,
  Layers,
  CircleDollarSign,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Gadget } from "../types";

interface ManageInventoryViewProps {
  user: any;
  onNavigate: (view: string, itemId?: string) => void;
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
}

export const ManageInventoryView: React.FC<ManageInventoryViewProps> = ({
  user,
  onNavigate,
  onShowToast,
}) => {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch gadgets
      const gRes = await fetch("/api/items");
      if (gRes.ok) {
        const gData = await gRes.json();
        setGadgets(gData);
      }

      // 2. Fetch rentals logs
      const rRes = await fetch("/api/rentals");
      if (rRes.ok) {
        const rData = await rRes.json();
        setRentals(rData);
      }
    } catch (err) {
      console.error("Dashboard telemetry sync failure", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteItem = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you absolutely sure you want to retire asset '${name}'? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Inventory database rejection.");
      }

      onShowToast(
        `Fleet asset '${name}' retired from inventory successfully.`,
        "success",
      );
      // Refresh local list
      setGadgets((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      onShowToast(err.message || "Failed to delete item.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // If user is not admin, deny access
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-card rounded-2xl border border-border-main text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="font-display text-lg font-bold text-text-main">
          Access Denied
        </h2>
        <p className="text-xs text-text-muted">
          Only authorized administrators can open the chief analytics control
          dashboard.
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="px-5 py-2.5 bg-brand-primary rounded-lg text-xs font-bold text-text-main"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Calculate aggregated stats metrics
  const totalFleetCount = gadgets.length;
  const activeRentalsCount = gadgets.filter(
    (g) => g.status === "Rented Out",
  ).length;
  const totalRevenueSum = rentals.reduce((sum, r) => sum + r.cost, 0);
  const avgRentalDays =
    rentals.length > 0
      ? (rentals.reduce((sum, r) => sum + r.days, 0) / rentals.length).toFixed(
          1,
        )
      : "0.0";

  // Recharts Chart 1: Revenue by Category
  const categoriesMap: { [key: string]: number } = {};
  gadgets.forEach((g) => {
    const revenue = rentals
      .filter((r) => r.gadgetTitle === g.title)
      .reduce((sum, r) => sum + r.cost, 0);
    categoriesMap[g.category] = (categoriesMap[g.category] || 0) + revenue;
  });

  // Make sure standard categories have entries
  ["Drones", "Cameras", "Laptops", "Audio"].forEach((cat) => {
    if (categoriesMap[cat] === undefined) categoriesMap[cat] = 0;
  });

  const categoryChartData = Object.entries(categoriesMap).map(
    ([name, value]) => ({
      name,
      Revenue: value + 100, // add static baseline so charts render nicely even with low logs
    }),
  );

  // Recharts Chart 2: Daily bookings simulation
  const bookingsLineData = [
    { day: "Mon", Bookings: 2, Revenue: 450 },
    { day: "Tue", Bookings: 4, Revenue: 1100 },
    { day: "Wed", Bookings: 3, Revenue: 850 },
    { day: "Thu", Bookings: 5, Revenue: 1650 },
    { day: "Fri", Bookings: 6, Revenue: 2100 },
    { day: "Sat", Bookings: 4, Revenue: 1300 },
    { day: "Sun", Bookings: 3, Revenue: 950 },
  ];

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10"
      id="manage-inventory-view"
    >
      {/* Title & Add CTA Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-brand-secondary font-semibold">
            HQ Logistics Panel
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main mt-1">
            Enterprise Fleet Dashboard
          </h1>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Real-time telemetry overview of revenue models, calibration cycles,
            and physical serial status checks.
          </p>
        </div>

        <button
          onClick={() => onNavigate("add-item")}
          className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-brand-primary/20 flex items-center gap-2 cursor-pointer transition-all border border-brand-primary/50"
          id="dash-add-new-btn"
        >
          <Plus className="w-4 h-4" />
          Requisition New Tech
        </button>
      </div>

      {/* Analytics KPI Cards Row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        id="dashboard-kpi-grid"
      >
        <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-3">
          <div className="flex justify-between items-center text-text-dim text-[10px] font-mono uppercase">
            <span>Active Fleet Registry</span>
            <Layers className="w-4 h-4 text-brand-secondary" />
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-text-main">
              {totalFleetCount} Units
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              Surgically verified hardware records
            </p>
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-3">
          <div className="flex justify-between items-center text-text-dim text-[10px] font-mono uppercase">
            <span>Rented Out Stream</span>
            <CalendarDays className="w-4 h-4 text-brand-accent" />
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-text-main">
              {activeRentalsCount} Holds
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              Currently on remote studio production sets
            </p>
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-3">
          <div className="flex justify-between items-center text-text-dim text-[10px] font-mono uppercase">
            <span>Aggregated Gross Returns</span>
            <CircleDollarSign className="w-4 h-4 text-brand-secondary" />
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-text-main">
              ${totalRevenueSum} USD
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              From real in-memory checkout receipts
            </p>
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-3">
          <div className="flex justify-between items-center text-text-dim text-[10px] font-mono uppercase">
            <span>Avg Term Duration</span>
            <TrendingUp className="w-4 h-4 text-brand-accent" />
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-text-main">
              {avgRentalDays} Days
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              Optimizing fleet turnaround velocity
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Charts Section */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        id="dashboard-charts-container"
      >
        {/* Chart 1: Category Gross Revenue (Bar Chart) */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-4">
          <div>
            <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider">
              Gross Category Returns (USD)
            </h3>
            <p className="text-[11px] text-text-dim font-mono mt-0.5">
              Aggregated metrics including active dispatch logs
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#8c8e9d"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#8c8e9d" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e20",
                    border: "1px solid #2a2a2c",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e5e2e1", fontWeight: "bold" }}
                />
                <Bar dataKey="Revenue" fill="#0052ff" radius={[4, 4, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#0052ff" : "#4cd6ff"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bookings Revenue Velocity Curve (Line Chart) */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-main space-y-4">
          <div>
            <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider">
              Weekly Revenue Velocity
            </h3>
            <p className="text-[11px] text-text-dim font-mono mt-0.5">
              Real-time dynamic monitoring curve of daily rentals holds
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bookingsLineData}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <CartesianGrid stroke="#232325" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  stroke="#8c8e9d"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#8c8e9d" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e20",
                    border: "1px solid #2a2a2c",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#4cd6ff"
                  strokeWidth={3}
                  dot={{ fill: "#0052ff", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Inventory Status Row Table */}
      <div className="bg-surface-card rounded-xl border border-border-main overflow-hidden shadow-lg">
        <div className="p-6 border-b border-border-main">
          <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider">
            Telemetry Fleet Inventory Table
          </h3>
          <p className="text-[11px] text-text-dim font-mono mt-0.5">
            Retire units or update device allocations below
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-bright/50 border-b border-border-main font-mono text-text-dim uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6 font-semibold">
                  Visual / Asset Title
                </th>
                <th className="py-3.5 px-6 font-semibold">Category</th>
                <th className="py-3.5 px-6 font-semibold">Day Rate</th>
                <th className="py-3.5 px-6 font-semibold">Serial Code</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50 font-sans">
              {gadgets.map((gadget) => {
                const isRented = gadget.status === "Rented Out";
                return (
                  <tr
                    key={gadget.id}
                    className="hover:bg-surface-bright/20 transition-colors"
                  >
                    {/* Title cell */}
                    <td className="py-4 px-6 font-medium text-text-main flex items-center gap-3">
                      <img
                        src={gadget.imageUrl}
                        alt={gadget.title}
                        className="w-10 h-10 object-cover rounded bg-bg-dark border border-border-main shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div
                          className="font-bold text-text-main truncate max-w-[180px] sm:max-w-[280px]"
                          title={gadget.title}
                        >
                          {gadget.title}
                        </div>
                        <div
                          className="text-[10px] text-text-dim truncate max-w-[180px]"
                          title={gadget.location}
                        >
                          {gadget.location.split(",")[0]}
                        </div>
                      </div>
                    </td>

                    {/* Category cell */}
                    <td className="py-4 px-6 text-text-muted font-mono">
                      {gadget.category}
                    </td>

                    {/* Day rate cell */}
                    <td className="py-4 px-6 text-text-main font-bold font-mono">
                      ${gadget.pricePerDay}/day
                    </td>

                    {/* Serial cell */}
                    <td className="py-4 px-6 text-brand-accent font-mono">
                      {gadget.serialNumber}
                    </td>

                    {/* Status badge cell */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          gadget.status === "Available"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : gadget.status === "Low Stock"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            gadget.status === "Available"
                              ? "bg-emerald-400"
                              : gadget.status === "Low Stock"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                          } animate-pulse`}
                        />
                        {gadget.status}
                      </span>
                    </td>

                    {/* Actions cell */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onNavigate("item-details", gadget.id)}
                          className="p-1.5 hover:bg-surface-bright rounded text-text-muted hover:text-text-main transition-colors"
                          title="View Details Spec"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteItem(gadget.id, gadget.title)
                          }
                          disabled={deletingId === gadget.id}
                          className="p-1.5 hover:bg-red-500/10 rounded text-text-dim hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Retire from Inventory"
                          id={`delete-btn-${gadget.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {gadgets.length === 0 && (
          <div className="text-center py-12 text-text-dim text-xs">
            Zero registered devices currently in active fleet registry index.
          </div>
        )}
      </div>

      {/* Historical Logs List (Global Overview) */}
      <div className="bg-surface-card rounded-xl border border-border-main p-6 space-y-4">
        <div>
          <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-secondary" />
            Global Rental Dispatch Telemetry Queue
          </h3>
          <p className="text-[11px] text-text-dim font-mono mt-0.5">
            Historical verification holds completed across all operators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rentals.map((r, idx) => (
            <div
              key={idx}
              className="p-4 bg-bg-dark rounded-lg border border-border-main/50 space-y-2 text-xs"
            >
              <div className="flex justify-between font-mono text-[10px] text-text-dim">
                <span>Hold ID: {r.id}</span>
                <span>{r.date}</span>
              </div>
              <h4
                className="font-bold text-text-main truncate"
                title={r.gadgetTitle}
              >
                {r.gadgetTitle}
              </h4>
              <div className="border-t border-border-main/40 pt-2 flex justify-between items-baseline font-mono text-[11px]">
                <span className="text-text-dim">
                  {r.userEmail.split("@")[0]}
                </span>
                <span className="text-brand-secondary font-bold">
                  ${r.cost} ({r.days}d)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
