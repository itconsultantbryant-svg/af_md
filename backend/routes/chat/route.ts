import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateChatReply } from "@/lib/chat-engine";
import { json, error } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, saveFeedback, feedbackData } = body;

    if (saveFeedback && feedbackData?.message) {
      await prisma.siteFeedback.create({
        data: {
          name: feedbackData.name || null,
          email: feedbackData.email || null,
          message: feedbackData.message,
          category: feedbackData.category || "RECOMMENDATION",
          source: "CHATBOT",
        },
      });
      return json({
        message:
          "Thank you! Your feedback has been submitted to our team. We review all recommendations to improve our services.",
        suggestions: ["Browse courses", "View portfolio", "Contact us"],
      });
    }

    if (!message?.trim()) return error("Message required");

    const reply = await generateChatReply(message, history || []);
    return json(reply);
  } catch (e) {
    console.error(e);
    return error("Chat unavailable", 500);
  }
}
