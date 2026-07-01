import { searchKnowledge, getSiteSummary } from "@/lib/knowledge-base";
import { COMPANY_NAME, COMPANY_EMAIL } from "@/lib/brand";

const GREETINGS = [
  "hello",
  "hi",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
  "help",
  "howdy",
];

const FAREWELLS = ["bye", "goodbye", "see you", "thanks", "thank you", "thx", "cheers"];

const SMALLTALK = [
  "how are you",
  "how r u",
  "what's up",
  "whats up",
  "who are you",
  "your name",
];

export interface ChatReply {
  message: string;
  suggestions?: string[];
  collectFeedback?: boolean;
}

function isSmallTalk(msg: string): boolean {
  return SMALLTALK.some((p) => msg.includes(p));
}

function isFarewell(msg: string): boolean {
  return FAREWELLS.some((p) => msg.includes(p)) && msg.length < 40;
}

function isGreeting(msg: string): boolean {
  return GREETINGS.some((g) => msg.includes(g)) && msg.length < 30;
}

function conversationalFallback(msg: string): ChatReply | null {
  if (isGreeting(msg)) {
    return {
      message: `Hello! Great to meet you. I'm the ${COMPANY_NAME} assistant — happy to chat about anything on our site: training courses, AI services, portfolio demos, pricing, or just general questions about what we do.`,
      suggestions: ["What courses do you offer?", "Tell me about your services", "Request a demo"],
    };
  }

  if (isSmallTalk(msg)) {
    if (msg.includes("who are you") || msg.includes("your name")) {
      return {
        message: `I'm the virtual assistant for ${COMPANY_NAME}. I know our full course catalog (54+ programs), services, portfolio systems, and how to enroll or request demos. Think of me as your guide around the site!`,
        suggestions: ["Browse courses", "View portfolio", "Contact us"],
      };
    }
    return {
      message:
        "I'm doing well, thank you for asking! I'm here and ready to help you explore AfriMind — whether you want to learn about AI training, our consulting services, or just need directions on the site.",
      suggestions: ["What can you help with?", "Training courses", "Services & pricing"],
    };
  }

  if (isFarewell(msg)) {
    return {
      message: `You're welcome! If you need anything else, I'm always here. You can also reach our team at ${COMPANY_EMAIL}. Have a great day!`,
      suggestions: ["Browse courses", "Contact us"],
    };
  }

  if (
    msg.includes("what can you") ||
    msg.includes("what do you do") ||
    msg.includes("help me")
  ) {
    return {
      message:
        "I can help you with:\n• Our 54+ training courses (ICT, AI, Software Dev)\n• AI consulting services and pricing\n• Portfolio systems and demo requests\n• Enrollment and registration steps\n• General questions about AfriMind\n\nJust ask naturally — I'm happy to chat!",
      suggestions: ["Course catalog", "Request demo", "Service pricing"],
    };
  }

  return null;
}

export async function generateChatReply(
  userMessage: string,
  history: { role: string; content: string }[] = []
): Promise<ChatReply> {
  const msg = userMessage.trim().toLowerCase();

  if (!msg) {
    return {
      message:
        "How can I help you today? Feel free to ask about our courses, services, portfolio, or just say hello!",
      suggestions: [
        "What courses do you offer?",
        "Show me your services",
        "How do I request a demo?",
        "Contact information",
      ],
    };
  }

  const casual = conversationalFallback(msg);
  if (casual) return casual;

  if (
    msg.includes("feedback") ||
    msg.includes("suggest") ||
    msg.includes("recommend") ||
    msg.includes("improve")
  ) {
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
        "You can request a demo of any system on our Portfolio page. Click Request Demo on a project or fill the form with your name, company, email, phone, and the system you need. We'll send you demo access.",
      suggestions: ["Go to Portfolio", "What systems are available?"],
    };
  }

  if (msg.includes("enroll") || msg.includes("register") || msg.includes("sign up")) {
    return {
      message: `To enroll in a course: visit /training, choose a course, and complete registration. You'll verify your account, submit payment, and wait for admin approval. Need help? Contact us at ${COMPANY_EMAIL}.`,
      suggestions: ["Browse training courses", "Course prices"],
    };
  }

  const chunks = searchKnowledge(userMessage, 4);
  const context = chunks.map((c) => c.content).join("\n\n");

  const systemPrompt = `You are the friendly virtual assistant for ${COMPANY_NAME}. You can have normal, warm conversations with visitors while staying professional.

Your priorities:
1. Answer questions about AfriMind using the site knowledge below (courses, services, portfolio, pricing, contact).
2. Handle casual conversation naturally (greetings, thanks, small talk) without being robotic.
3. Guide users to relevant pages: /training, /services, /portfolio, /contact, /about.
4. When unsure, be honest and suggest they contact ${COMPANY_EMAIL} or browse the site.

Keep replies concise (2-4 sentences unless listing courses). Use plain text, no markdown headers.

Site knowledge:
${context || getSiteSummary().slice(0, 8000)}`;

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
          temperature: 0.65,
          messages: [
            { role: "system", content: systemPrompt },
            ...history.slice(-8).map((h) => ({
              role: h.role as "user" | "assistant",
              content: h.content,
            })),
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
      /* fallback below */
    }
  }

  if (chunks.length === 0) {
    return {
      message: `That's a great question! I don't have specific details on that, but I'm happy to chat. You can ask about our training courses, AI services, portfolio demos, or contact us at ${COMPANY_EMAIL}.`,
      suggestions: ["Training courses", "Services & pricing", "Request demo", "Share feedback"],
    };
  }

  const top = chunks[0];
  let reply = `Here's what I found about ${top.topic}:\n\n${top.content}`;

  if (chunks.length > 1) {
    reply += `\n\nRelated: ${chunks.slice(1, 3).map((c) => c.topic).join(", ")}.`;
  }

  return {
    message: reply,
    suggestions: ["Tell me about courses", "Request a demo", "Contact us", "Share feedback"],
  };
}
