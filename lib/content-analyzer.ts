import { readFile } from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import { estimatePageCount } from "@/lib/material-progress";

async function parsePdf(buffer: Buffer): Promise<{ text: string; numpages: number }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PDFParse } = require("pdf-parse") as {
      PDFParse: new (opts: { data: Buffer }) => {
        getText: () => Promise<{ text: string; total: number }>;
      };
    };
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return {
      text: result.text || "",
      numpages: Math.max(1, result.total || 1),
    };
  } catch (err) {
    console.error("PDF parse error:", err);
    return { text: "", numpages: 1 };
  }
}

export interface ExtractedContent {
  text: string;
  pageCount: number;
}

export async function extractMaterialContent(
  type: string,
  filePath: string | null,
  content: string | null,
  title: string
): Promise<ExtractedContent> {
  const combined = [content, title].filter(Boolean).join("\n\n").trim();

  if (!filePath) {
    return {
      text: combined || title,
      pageCount: estimatePageCount(combined || title),
    };
  }

  const absolute = path.join(process.cwd(), "public", filePath.replace(/^\//, ""));

  if (type === "VIDEO") {
    return {
      text: combined || `Video lesson: ${title}. Key topics and concepts covered in this video recording.`,
      pageCount: 1,
    };
  }

  if (type === "LINK") {
    return {
      text: combined || `External learning resource: ${title}`,
      pageCount: 1,
    };
  }

  let buffer: Buffer;
  try {
    buffer = await readFile(absolute);
  } catch (err) {
    console.error("File read error:", absolute, err);
    return {
      text: combined || title,
      pageCount: estimatePageCount(combined || title),
    };
  }

  if (type === "PDF" || filePath.toLowerCase().endsWith(".pdf")) {
    const parsed = await parsePdf(buffer);
    const text = [combined, parsed.text?.trim()].filter(Boolean).join("\n\n") || title;
    return {
      text,
      pageCount: Math.max(1, parsed.numpages || estimatePageCount(text)),
    };
  }

  if (
    type === "DOC" ||
    filePath.toLowerCase().endsWith(".docx") ||
    filePath.toLowerCase().endsWith(".doc")
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = [combined, result.value?.trim()].filter(Boolean).join("\n\n") || title;
      return { text, pageCount: estimatePageCount(text) };
    } catch (err) {
      console.error("DOC parse error:", err);
      return { text: combined || title, pageCount: estimatePageCount(combined || title) };
    }
  }

  if (type === "IMAGE") {
    if (process.env.OPENAI_API_KEY) {
      try {
        const base64 = buffer.toString("base64");
        const ext = path.extname(filePath).slice(1) || "png";
        const mime = ext === "jpg" ? "jpeg" : ext;
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Describe this educational image in detail for quiz generation. Title: ${title}`,
                  },
                  {
                    type: "image_url",
                    image_url: { url: `data:image/${mime};base64,${base64}` },
                  },
                ],
              },
            ],
            max_tokens: 600,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content?.trim() || title;
          return { text: [combined, text].filter(Boolean).join("\n\n"), pageCount: 1 };
        }
      } catch (err) {
        console.error("Image analysis error:", err);
      }
    }
    return { text: combined || `Image material: ${title}`, pageCount: 1 };
  }

  return { text: combined || title, pageCount: 1 };
}
