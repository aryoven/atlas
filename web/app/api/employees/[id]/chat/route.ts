import { z } from "zod";
import {
  normalizeChatError,
  streamEmployeeChatTurn,
} from "@/lib/ai/stream-employee-chat";
import { toChatMessage } from "@/lib/data/employee-messages";

const requestSchema = z.object({
  userMessage: z.string().min(1).trim(),
  conversationId: z.string().uuid(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

function encodeSse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request, context: RouteContext) {
  const { id: employeeId } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of streamEmployeeChatTurn(
          employeeId,
          parsed.data.conversationId,
          parsed.data.userMessage
        )) {
          if (event.type === "userMessage") {
            controller.enqueue(
              encoder.encode(
                encodeSse("userMessage", {
                  userMessage: toChatMessage(event.message),
                })
              )
            );
            continue;
          }

          if (event.type === "token") {
            controller.enqueue(
              encoder.encode(encodeSse("token", { content: event.content }))
            );
            continue;
          }

          if (event.type === "done") {
            controller.enqueue(
              encoder.encode(
                encodeSse("done", {
                  assistantMessage: toChatMessage(event.assistantMessage),
                  sources: event.sources,
                })
              )
            );
            continue;
          }

          controller.enqueue(
            encoder.encode(encodeSse("error", { error: event.error }))
          );
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? normalizeChatError(error.message)
            : "Failed to process message.";

        controller.enqueue(encoder.encode(encodeSse("error", { error: message })));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
