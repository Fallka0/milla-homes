import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { buildConciergeContext, createTourFromConcierge } from "@/lib/concierge";
import { resolvePublicLocale } from "@/lib/public-copy";
import { consumeInquiryRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type ConciergePayload = {
  locale?: string;
  messages?: UIMessage[];
  propertyId?: string;
};

export async function POST(request: Request) {
  let payload: ConciergePayload;
  try {
    payload = (await request.json()) as ConciergePayload;
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const rate = consumeInquiryRateLimit(`concierge:${ip}`);
  if (!rate.allowed) {
    return new Response("Too many messages. Please try again shortly.", { status: 429 });
  }

  const locale = resolvePublicLocale(payload.locale);
  const propertyId = payload.propertyId?.trim() ?? "";
  const messages = payload.messages ?? [];

  const { systemPrompt } = await buildConciergeContext(propertyId, locale);

  const result = streamText({
    model: "anthropic/claude-sonnet-5",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(4),
    tools: {
      book_viewing: tool({
        description:
          "Book a property viewing once you have the visitor's name, email and a preferred date. Only call after collecting these.",
        inputSchema: z.object({
          name: z.string().describe("Visitor's full name"),
          email: z.string().describe("Visitor's email address"),
          date: z.string().describe("Preferred date, format YYYY-MM-DD"),
          time: z.string().optional().describe("Preferred time, e.g. '10:00' or 'afternoon'"),
          phone: z.string().optional().describe("Phone number if given"),
          notes: z.string().optional().describe("Anything else the visitor mentioned"),
        }),
        execute: async (args) => {
          const outcome = await createTourFromConcierge(propertyId, locale, args);
          return outcome.booked
            ? { status: "booked", date: args.date, time: args.time ?? null }
            : { status: "failed", reason: outcome.reason };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
