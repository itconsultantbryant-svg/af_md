import { searchKnowledge, getSiteSummary } from "@/lib/knowledge-base";

const GREETINGS = ["hello", "hi", "hey", "good morning", "good afternoon", "help"];

export interface ChatReply {
  message: string;
  suggestions?: string[];
  collectFeedback?: boolean;
}

export async function generateChatReply(
  userMessage: string,
  history: { role: string; content: string }[] = []
): Promise<ChatReply> {
  const msg = userMessage.trim().toLowerCase();

  if (!msg) {
    return {
      message: "How can I help you today? Ask about our services, training courses, portfolio, pricing, or request a demo.",
      suggestions: ["What courses do you offer?", "Show me your services", "How do I request a demo?", "Contact information"],
    };
  }

  if (GREETINGS.some((g) => msg.includes(g)) && msg.length < 20) {
    return {
      message:
        "Hello! I'm the AfriMind assistant. I can help you explore our AI services, training courses (with prices & duration), portfolio systems, and guide you to enroll or request a demo.",
      suggestions: ["List all training courses", "What are your service prices?", "Tell me about portfolio projects", "I have feedback"],
    };
  }

  if (msg.includes("feedback") || msg.includes("suggest") || msg.includes("recommend") || msg.includes("improve")) {
    return {
      message:
        "Thank you for wanting to help us improve! Please share your detailed feedback or recommendation below. I'll submit it directly to our admin team.",
      collectFeedback: true,
      suggestions: ["Submit feedback now"],
    };
  }

  if (msg.includes("demo") || msg.includes("trial")) {
    return {
      message:
        "You can request a demo of any system on our Portfolio page. Click **Request Demo** on a project or fill the form with your name, company, email, phone, and the system you need. We'll send you demo access.",
      suggestions: ["Go to Portfolio", "What systems are available?"],
    };
  }

  if (msg.includes("enroll") || msg.includes("register") || msg.includes("sign up")) {
    return {
      message:
        "To enroll in a course: visit /training, choose a course, and complete registration. You'll verify your account, submit payment, and wait for admin approval. Need help? Contact us at hello@afrimindai.com.",
      suggestions: ["Browse training courses", "Course prices"],
    };
  }

  const chunks = searchKnowledge(userMessage, 4);
  const context = chunks.map((c) => c.content).join("\n\n");

  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: `You are the helpful assistant for AfriMind Tech&AI Consulting Agency. Answer ONLY using the site knowledge below. Be concise, friendly, and professional. Include specific prices, durations, and links when relevant (/training, /services, /portfolio, /contact). If asked for feedback, encourage the user to share it.\n\n${context || getSiteSummary().slice(0, 8000)}`,
            },
            ...history.slice(-6),
            { role: "user", content: userMessage },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) {
          return {
            message: text,
            suggestions: chunks.slice(0, 2).map((c) => `More about ${c.topic}`),
          };
        }
      }
    } catch {
      /* fallback */
    }
  }

  if (chunks.length === 0) {
    return {
      message:
        "I couldn't find specific information on that. Try asking about our services, training courses, portfolio, pricing, demos, or contact details. You can also share feedback for our team.",
      suggestions: ["Training courses", "Services & pricing", "Request demo", "Share feedback"],
    };
  }

  const top = chunks[0];
  let reply = `Here's what I found about **${top.topic}**:\n\n${top.content}`;

  if (chunks.length > 1) {
    reply += `\n\nRelated: ${chunks.slice(1, 3).map((c) => c.topic).join(", ")}.`;
  }

  return {
    message: reply,
    suggestions: ["Tell me about courses", "Request a demo", "Contact us", "Share feedback"],
  };
}
