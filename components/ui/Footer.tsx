"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import {
  LinkedInIcon,
  TwitterIcon,
  YouTubeIcon,
  WhatsAppIcon,
  FacebookIcon,
} from "@/components/ui/SocialIcons";
import { Logo } from "./Logo";
import {
  COMPANY_NAME,
  COMPANY_TAGLINE,
  COMPANY_LOCATION,
  COMPANY_EMAIL,
  COMPANY_PHONE_DISPLAY,
  COMPANY_WHATSAPP,
} from "@/lib/brand";
import { serviceDetails } from "@/lib/data/services";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/training", label: "Training" },
];

const legalLinks = [
  { href: "/contact", label: "Privacy Policy" },
  { href: "/contact", label: "Terms of Service" },
  { href: "/contact", label: "Cookie Policy" },
];

const socialLinks = [
  { icon: LinkedInIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
  { icon: YouTubeIcon, href: "https://youtube.com", label: "YouTube" },
  { icon: WhatsAppIcon, href: "https://wa.me", label: "WhatsApp" },
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "ok" | "err">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubStatus(res.ok ? "ok" : "err");
      if (res.ok) setEmail("");
    } catch {
      setSubStatus("err");
    }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-brand-darker overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-navy/30 rounded-full blur-3xl" />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <Logo href="/" size="lg" />
            <p className="text-brand-muted text-sm mt-4 leading-relaxed max-w-sm">
              {COMPANY_TAGLINE} We build enterprise AI, data systems, and training programs
              for organizations across Africa and globally.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 hover:bg-brand-gold/10 transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-muted hover:text-brand-gold text-sm transition-all hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceDetails.slice(0, 6).map((svc) => (
                <li key={svc.title}>
                  <Link
                    href="/services"
                    className="text-brand-muted hover:text-brand-gold text-sm transition-all hover:translate-x-1 inline-block line-clamp-1"
                  >
                    {svc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Stay Connected
            </h3>
            <ul className="space-y-3 text-sm text-brand-muted mb-5">
              <li className="flex items-center gap-2 group">
                <Mail size={14} className="text-brand-gold shrink-0" />
                <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-brand-gold transition-colors">
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-gold shrink-0" />
                {COMPANY_LOCATION}
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-gold shrink-0" />
                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                >
                  {COMPANY_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Subscribe to AI insights"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2.5 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium hover:bg-brand-gold-light transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
            {subStatus === "ok" && <p className="text-green-400 text-xs mt-2">Subscribed!</p>}
            {subStatus === "err" && <p className="text-red-400 text-xs mt-2">Try again.</p>}
          </motion.div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-xs text-center sm:text-left">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-brand-muted hover:text-brand-gold text-xs transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <motion.button
              onClick={scrollTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-brand-gold text-xs font-medium hover:text-brand-gold-light transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp size={14} />
              Top
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
