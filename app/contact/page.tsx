"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Check } from "lucide-react";
import {
  LinkedInIcon,
  TwitterIcon,
  YouTubeIcon,
  FacebookIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  service: string;
  budget: string;
  description: string;
  source: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  service: "",
  budget: "",
  description: "",
  source: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.description.trim())
      newErrors.description = "Please describe your project";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

    try {
      if (formspreeId && formspreeId !== "your_formspree_form_id") {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Submission failed");
      }
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const inputClass = (field: string) =>
    cn(
      "w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-white placeholder:text-brand-muted focus:outline-none transition-colors",
      errors[field]
        ? "border-red-500"
        : "border-white/10 focus:border-brand-gold/50"
    );

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "231XXXXXXXXX";

  return (
    <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Contact Us" />

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-8">
              Let&apos;s Build Something Intelligent Together
            </h2>

            <div className="space-y-6 mb-8">
              <a
                href="mailto:hello@afrimindai.com"
                className="flex items-center gap-3 text-brand-muted hover:text-brand-gold transition-colors cursor-hover"
              >
                <Mail className="w-5 h-5 text-brand-gold" />
                hello@afrimindai.com
              </a>
              <div className="flex items-start gap-3 text-brand-muted">
                <MapPin className="w-5 h-5 text-brand-gold mt-0.5" />
                <span>
                  Monrovia, Montserrado County
                  <br />
                  Liberia
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors mb-8 cursor-hover"
            >
              <WhatsAppIcon size={20} />
              Chat on WhatsApp →
            </a>

            <div className="flex gap-4 mb-8">
              {[
                { icon: LinkedInIcon, href: "https://linkedin.com" },
                { icon: TwitterIcon, href: "https://twitter.com" },
                { icon: YouTubeIcon, href: "https://youtube.com" },
                { icon: FacebookIcon, href: "https://facebook.com" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-gold transition-colors cursor-hover"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127584.09787654321!2d-10.7969!3d6.3156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf96652e8a8b5b8b%3A0x8b5b8b8b8b8b8b8b!2sMonrovia%2C%20Liberia!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AfriMind Tech&AI Consulting Agency Office Location"
              />
            </div>

            <p className="text-brand-muted text-sm">
              Office Hours: Monday – Friday, 8:00 AM – 6:00 PM GMT
            </p>
          </div>

          <div className="glass-card p-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-brand-muted">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {status === "error" && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                      Something went wrong. Please try again or email us
                      directly.
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-brand-muted mb-1.5">
                      Full Name *
                    </label>
                    <input
                      className={inputClass("name")}
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-brand-muted mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className={inputClass("email")}
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@organization.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-brand-muted mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      className={inputClass("phone")}
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+231 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-brand-muted mb-1.5">
                      Organization Name
                    </label>
                    <input
                      className={inputClass("organization")}
                      value={form.organization}
                      onChange={(e) => update("organization", e.target.value)}
                      placeholder="Your organization"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-muted mb-1.5">
                        Service Interested In
                      </label>
                      <select
                        className={inputClass("service")}
                        value={form.service}
                        onChange={(e) => update("service", e.target.value)}
                      >
                        <option value="">Select a service</option>
                        <option value="AI Development">AI Development</option>
                        <option value="AI Consulting">
                          AI Consulting / Strategy
                        </option>
                        <option value="AI Training">
                          AI Training & Workshops
                        </option>
                        <option value="Healthcare Gov">
                          Healthcare / Gov AI
                        </option>
                        <option value="SaaS Product">SaaS Product</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-brand-muted mb-1.5">
                        Budget Range
                      </label>
                      <select
                        className={inputClass("budget")}
                        value={form.budget}
                        onChange={(e) => update("budget", e.target.value)}
                      >
                        <option value="">Select budget</option>
                        <option value="Under $1,000">Under $1,000</option>
                        <option value="$1,000 – $5,000">$1,000 – $5,000</option>
                        <option value="$5,000 – $20,000">
                          $5,000 – $20,000
                        </option>
                        <option value="$20,000+">$20,000+</option>
                        <option value="Let's discuss">Let&apos;s discuss</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-brand-muted mb-1.5">
                      Project Description *
                    </label>
                    <textarea
                      rows={5}
                      className={inputClass("description")}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Tell us about your project, goals, and timeline..."
                    />
                    {errors.description && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-brand-muted mb-1.5">
                      How did you hear about us?
                    </label>
                    <select
                      className={inputClass("source")}
                      value={form.source}
                      onChange={(e) => update("source", e.target.value)}
                    >
                      <option value="">Select an option</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Referral">Referral</option>
                      <option value="Event">Event / Conference</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
