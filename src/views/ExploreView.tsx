import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  X,
} from "lucide-react";
import { Gadget } from "../types";
import { GadgetCard } from "../components/GadgetCard";

interface ExploreViewProps {
  onNavigate: (view: string, itemId?: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onNavigate }) => {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(700);
  const [sortBy, setSortBy] = useState("rating");

  // Sidebar visibility for mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoriesList = [
    "All",
    "Drones",
    "Cameras",
    "Laptops",
    "Audio",
    "Wearables",
  ];

  // Fetch from Express Server API
  const fetchFilteredGadgets = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (selectedCategory && selectedCategory !== "All")
        queryParams.append("category", selectedCategory);
      queryParams.append("maxPrice", maxPrice.toString());
      queryParams.append("sortBy", sortBy);

      const res = await fetch(`/api/items?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load inventory assets.");
      }
      const data = await res.json();
      setGadgets(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredGadgets();
    }, 150); // slight debounce for search input typing smoothness

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMaxPrice(700);
    setSortBy("rating");
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      id="explore-view-container"
    >
      {/* Title & Metadata */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-brand-secondary font-semibold">
            Asset Catalog
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main mt-1">
            Studio Fleet Inventory
          </h1>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Real-time telemetry and specifications of available cinema rigs,
            drones, and extreme portable rendering machines.
          </p>
        </div>

        {/* Active counter */}
        <div className="px-4 py-2 bg-surface-card border border-border-main rounded-lg text-xs font-mono text-text-muted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
          <span>
            Showing{" "}
            <strong className="text-text-main font-bold">
              {gadgets.length}
            </strong>{" "}
            authenticated units
          </span>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 1. FILTER CONTROLS SIDEBAR (Desktop) */}
        <aside
          className="hidden lg:block space-y-6 self-start bg-surface-card p-6 rounded-xl border border-border-main"
          id="desktop-filter-sidebar"
        >
          <div className="flex items-center justify-between border-b border-border-main pb-4">
            <h2 className="font-display text-sm font-bold text-text-main flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-secondary" />
              Telemetry Filters
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-mono text-brand-accent hover:text-text-main transition-colors uppercase tracking-wider"
            >
              Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-dim" />
              <input
                type="text"
                placeholder="Title, specs, serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary placeholder-text-dim"
              />
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
              Device Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary appearance-none cursor-pointer"
                id="category-filter-dropdown"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-dim">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
                Max Daily Rate
              </label>
              <span className="text-xs font-mono font-bold text-brand-secondary">
                ${maxPrice}/day
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="700"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-secondary cursor-pointer h-1 bg-bg-dark rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[9px] font-mono text-text-dim">
              <span>$40</span>
              <span>$700</span>
            </div>
          </div>

          {/* Sort selection */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
              Telemetry Sorting
            </label>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-2.5 h-4 w-4 text-text-dim" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary appearance-none cursor-pointer"
              >
                <option value="rating">Top Rated Gear</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Alphabetical Title</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Mobile Filters Toggle Button */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex-1 py-3 bg-surface-card border border-border-main rounded-xl text-xs font-bold text-text-main flex items-center justify-center gap-2 hover:border-brand-secondary transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-secondary" />
            Configure Filters
          </button>
        </div>

        {/* 2. CATALOG GRID */}
        <section className="lg:col-span-3 space-y-6">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              {error}
            </div>
          )}

          {loading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              id="skeleton-grid"
            >
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-surface-card rounded-xl border border-border-main h-[460px] animate-pulse p-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="bg-surface-bright h-44 rounded-lg w-full" />
                    <div className="h-4 bg-surface-bright rounded w-2/3" />
                    <div className="space-y-2">
                      <div className="h-3 bg-surface-bright rounded w-full" />
                      <div className="h-3 bg-surface-bright rounded w-5/6" />
                      <div className="h-3 bg-surface-bright rounded w-4/5" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border-main flex items-center justify-between">
                    <div className="h-8 bg-surface-bright rounded w-1/3" />
                    <div className="h-8 bg-surface-bright rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : gadgets.length === 0 ? (
            <div className="text-center py-24 bg-surface-card rounded-2xl border border-border-main space-y-4">
              <SlidersHorizontal className="w-12 h-12 text-text-dim mx-auto animate-bounce" />
              <h3 className="font-display text-lg font-bold text-text-main">
                No Match Found in Fleet
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                We couldn't locate any active devices matching your current
                filtering credentials. Try widening your price ranges or search
                query.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-lg bg-brand-primary text-text-main text-xs font-bold hover:bg-brand-primary/95 transition-all shadow-lg hover:shadow-brand-primary/10"
              >
                Clear All Filter Options
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              id="catalog-grid"
            >
              {gadgets.map((gadget) => (
                <GadgetCard
                  key={gadget.id}
                  gadget={gadget}
                  onInspect={(id) => onNavigate("item-details", id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-bg-dark/80 backdrop-blur-md flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="w-full max-w-sm bg-surface-card p-6 border-l border-border-main flex flex-col justify-between h-full"
          >
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="flex items-center justify-between border-b border-border-main pb-4">
                <h3 className="font-display text-base font-bold text-text-main">
                  Telemetry Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 text-text-dim hover:text-text-main rounded-lg bg-surface-bright"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Box */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
                  Search Keywords
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-dim" />
                  <input
                    type="text"
                    placeholder="Title, specs, serial..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
                  Device Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors border ${
                        selectedCategory === cat
                          ? "bg-brand-primary/10 border-brand-primary text-brand-accent"
                          : "bg-bg-dark border-border-main text-text-muted hover:text-text-main"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
                    Max Daily Rate
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-secondary">
                    ${maxPrice}/day
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="700"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-secondary cursor-pointer h-1 bg-bg-dark rounded-lg"
                />
              </div>

              {/* Sort selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-text-dim">
                  Telemetry Sorting
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-dark rounded-lg border border-border-main text-text-main text-xs focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                >
                  <option value="rating">Top Rated Gear</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Alphabetical Title</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-border-main flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-3 bg-surface-bright rounded-lg text-xs font-bold text-text-muted"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-brand-primary rounded-lg text-xs font-bold text-text-main"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
