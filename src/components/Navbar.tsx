import React, { useState } from "react";
import { Cpu, LogOut, User, Menu, X } from "lucide-react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = user
    ? [
        { label: "Home", view: "home" },
        { label: "Explore Tech", view: "explore" },
        { label: "Dashboard", view: "manage-inventory" },
        { label: "List Tech", view: "add-item" },
        { label: "About", view: "about" },
      ]
    : [
        { label: "Home", view: "home" },
        { label: "Explore Tech", view: "explore" },
        { label: "About", view: "about" },
      ];

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-md border-b border-border-main"
      id="app-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 cursor-pointer border-none bg-transparent p-0 text-left"
            id="nav-logo-container"
          >
            <div className="p-2 bg-brand-primary/10 rounded-lg border border-brand-primary/30 text-brand-secondary">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-text-main">
              Electro<span className="text-brand-secondary">Rent</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center gap-6"
            id="desktop-nav-items"
          >
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`font-sans text-sm font-medium transition-colors hover:text-brand-secondary cursor-pointer border-none bg-transparent p-0 ${
                  currentView === item.view
                    ? "text-brand-secondary font-semibold"
                    : "text-text-muted"
                }`}
                id={`nav-item-${item.view}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop User Status & CTA Actions */}
          <div
            className="hidden md:flex items-center gap-4"
            id="desktop-auth-container"
          >
            {user ? (
              <div className="flex items-center gap-4" id="logged-in-actions">
                {/* User Info Capsule */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-card rounded-lg border border-border-main">
                  <User className="w-3.5 h-3.5 text-brand-secondary" />
                  <span
                    className="text-xs font-medium text-text-main truncate max-w-[120px]"
                    title={user.name}
                  >
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-accent font-mono">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-text-dim hover:text-red-400 hover:bg-surface-card rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  title="Sign Out"
                  id="nav-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate("auth")}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-text-main shadow-lg hover:shadow-brand-primary/20 transition-all border border-brand-primary/50 cursor-pointer"
                id="nav-login-btn"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-muted hover:text-text-main focus:outline-none cursor-pointer border-none bg-transparent"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pt-2 pb-4 bg-surface-dim border-b border-border-main space-y-3"
          id="mobile-nav-panel"
        >
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium border-none bg-transparent cursor-pointer ${
                  currentView === item.view
                    ? "bg-surface-card text-brand-secondary"
                    : "text-text-muted hover:bg-surface-card hover:text-text-main"
                }`}
                id={`mobile-nav-item-${item.view}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-border-main space-y-2">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-card rounded-md">
                  <User className="w-4 h-4 text-brand-secondary" />
                  <div className="text-sm font-medium text-text-main truncate">
                    {user.name} ({user.role})
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 cursor-pointer border-none bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate("auth");
                  setMobileMenuOpen(false);
                }}
                className="block w-full py-2 text-center text-sm font-semibold rounded-lg bg-brand-primary text-text-main cursor-pointer border-none"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
