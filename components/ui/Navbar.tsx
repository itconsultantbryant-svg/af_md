"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
              <>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-brand-gold hover:text-brand-gold-light">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-sm text-brand-muted hover:text-white">
                  Dashboard
                </Link>
              </>
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
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
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
