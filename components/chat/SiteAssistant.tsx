"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { COMPANY_SHORT } from "@/lib/brand";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        `Hi! I'm the ${COMPANY_SHORT} assistant. Ask me about our services, training courses (prices & duration), portfolio systems, demos, or share feedback for our team.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);

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
        { role: "assistant", content: "Connection error. Please try again or contact hello@afrimindai.com." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!input.trim()) return;
    setLoading(true);
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
                  <p className="text-[10px] text-green-400">Online · Site guide</p>
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
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/30 flex items-center justify-center hover:shadow-brand-gold/50 transition-shadow"
        aria-label="Open chat assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
}
