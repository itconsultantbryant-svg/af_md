"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/training", label: "Training" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isAdmin = user?.role === "ADMIN";
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase()
    : "";

  return (
    <>
      <header
        className={cn(
          "fixed top-0.5 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-brand-dark/95 backdrop-blur-md border-b border-brand-gold/30"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo href="/" size="md" priority className="group-hover:opacity-90 transition-opacity" />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-sm transition-colors cursor-hover",
                  pathname === link.href
                    ? "text-brand-gold"
                    : "text-brand-muted hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!loading && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm text-brand-muted hover:text-white transition-colors cursor-hover"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-xs font-semibold">
                    {initials}
                  </span>
                  <span className="max-w-[7rem] truncate">{user.firstName || "Account"}</span>
                  <ChevronDown size={14} className={cn("transition-transform", menuOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-52 glass-card p-2 shadow-xl"
                      role="menu"
                    >
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-white hover:bg-white/5">
                          <Shield size={16} /> Admin Panel
                        </Link>
                      )}
                      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-white hover:bg-white/5">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link
                        href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-white hover:bg-white/5"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-red-400 hover:bg-white/5 w-full"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              !loading && (
                <Link href="/login" className="text-sm text-brand-muted hover:text-white">
                  Log In
                </Link>
              )
            )}
            <Button variant="gold" href="/contact" className="text-sm py-2 px-5">
              Get a Free Consultation
            </Button>
          </div>

          <button
            className="md:hidden text-white cursor-hover p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-dark/98 backdrop-blur-lg md:hidden flex flex-col items-center justify-center"
          >
            <div className="absolute top-6 left-6">
              <Logo href="/" size="sm" />
            </div>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "font-display text-2xl cursor-hover",
                      pathname === link.href
                        ? "text-brand-gold"
                        : "text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {!loading && user && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08 }}
                  className="flex flex-col items-center gap-6 pt-4 border-t border-white/10 w-48"
                >
                  {isAdmin && (
                    <Link href="/admin" className="text-brand-muted hover:text-brand-gold text-lg">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="text-brand-muted hover:text-brand-gold text-lg">
                    Dashboard
                  </Link>
                  <Link
                    href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                    className="text-brand-muted hover:text-brand-gold text-lg"
                  >
                    My Profile
                  </Link>
                  <button onClick={logout} className="text-red-400 text-lg">
                    Log Out
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.08 }}
              >
                <Button variant="gold" href="/contact">
                  Get a Free Consultation
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
