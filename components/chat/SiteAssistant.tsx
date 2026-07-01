"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { COMPANY_SHORT } from "@/lib/brand";
import { trackSiteEvent } from "@/components/analytics/SiteTracker";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING_KEY = "afrimind_chat_greeted";
const GREETING_DELAY_MS = 10000;

const welcomeMessage = `Hi! I'm the ${COMPANY_SHORT} assistant. Ask me about our services, training courses (prices & duration), portfolio systems, demos, or share feedback for our team.`;

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    const alreadyGreeted = localStorage.getItem(GREETING_KEY);
    if (alreadyGreeted || open) return;

    greetingTimer.current = setTimeout(() => {
      if (!localStorage.getItem(GREETING_KEY) && !open) {
        setShowGreeting(true);
        trackSiteEvent("chat_greet_shown", "Proactive greeting displayed");
      }
    }, GREETING_DELAY_MS);

    return () => {
      if (greetingTimer.current) clearTimeout(greetingTimer.current);
    };
  }, [open]);

  const dismissGreeting = () => {
    setShowGreeting(false);
    localStorage.setItem(GREETING_KEY, "1");
  };

  const openChat = () => {
    const wasOpen = open;
    setOpen(!open);
    if (!wasOpen) {
      dismissGreeting();
      trackSiteEvent("chat_open", "User opened chat assistant");
    }
  };

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);
    trackSiteEvent("chat_message", "User sent chat message", { preview: msg.slice(0, 80) });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.collectFeedback) setFeedbackMode(true);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.message || "Sorry, I couldn't process that." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Connection error. Please try again or contact hello@afrimindai.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!input.trim()) return;
    setLoading(true);
    trackSiteEvent("chat_feedback", "User submitted feedback via chat");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saveFeedback: true,
          feedbackData: {
            name: feedbackName,
            email: feedbackEmail,
            message: input,
            category: "RECOMMENDATION",
          },
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.message }]);
      setFeedbackMode(false);
      setInput("");
      setFeedbackName("");
      setFeedbackEmail("");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What courses do you offer?",
    "Service pricing",
    "Request a demo",
    "Share feedback",
  ];

  return (
    <>
      <AnimatePresence>
        {showGreeting && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 max-w-xs"
          >
            <div className="relative bg-brand-darker border border-brand-gold/30 rounded-2xl p-4 shadow-xl shadow-black/40">
              <button
                onClick={dismissGreeting}
                className="absolute top-2 right-2 text-brand-muted hover:text-white p-1"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
              <div className="flex items-start gap-3 pr-4">
                <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    Need help exploring AfriMind?
                  </p>
                  <p className="text-xs text-brand-muted leading-relaxed mb-3">
                    I can guide you through our courses, services, portfolio demos, and more. Tap
                    to start a conversation!
                  </p>
                  <button
                    onClick={openChat}
                    className="text-xs font-medium px-3 py-1.5 bg-brand-gold text-brand-dark rounded-lg hover:bg-brand-gold-light transition-colors"
                  >
                    Chat with us →
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-brand-darker border-r border-b border-brand-gold/30 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-md bg-brand-darker border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
            style={{ height: "min(520px, 70vh)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-brand-dark/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{COMPANY_SHORT} Assistant</p>
                  <p className="text-[10px] text-green-400">Online · Here to help</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-brand-muted hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-brand-gold text-brand-dark rounded-br-md"
                        : "bg-white/5 text-brand-muted border border-white/5 rounded-bl-md"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 px-4 py-2">
                  <span className="w-2 h-2 bg-brand-gold rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-brand-gold rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 bg-brand-gold rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {!feedbackMode && messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-white/10 bg-brand-dark/50">
              {feedbackMode && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    placeholder="Your name (optional)"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                  />
                  <input
                    placeholder="Email (optional)"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (feedbackMode ? submitFeedback() : send())}
                  placeholder={
                    feedbackMode ? "Share your feedback or recommendation..." : "Ask anything..."
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-gold/40"
                />
                <button
                  onClick={feedbackMode ? submitFeedback : () => send()}
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-brand-gold text-brand-dark rounded-xl hover:bg-brand-gold-light transition-colors disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={openChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/30 flex items-center justify-center hover:shadow-brand-gold/50 transition-shadow"
        aria-label="Open chat assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && showGreeting && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-brand-dark animate-pulse" />
        )}
      </motion.button>
    </>
  );
}
