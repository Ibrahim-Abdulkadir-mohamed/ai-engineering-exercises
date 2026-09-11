// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createIdGenerator,
  validateUIMessages,
} from "ai";
import { auth } from "@/lib/auth";
import {
  loadChat,
  saveChat,
  GetUserConversations,
  GetConversationById,
  UpdateConversationTitle,
} from "@/lib/chat";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Get the authenticated session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Following AI SDK best practices: expect either full messages or single message
    const body = await req.json();
    const { messages, message: singleMessage, id: conversationId } = body;

    if (!conversationId) {
      return new Response("Conversation ID is required", { status: 400 });
    }

    // Validate conversation ownership
    const conversation = await GetConversationById(
      conversationId,
      session.user.id,
    );
    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    let allMessages: UIMessage[];

    if (singleMessage) {
      // Following Vercel guide: load previous messages and append new one
      const previousMessages = await loadChat(conversationId);
      allMessages = [...previousMessages, singleMessage];

      // If this is the first message in the conversation, auto-generate a title
      if (previousMessages.length === 0) {
        const textPart = singleMessage.parts?.find(
          (p: any) => p.type === "text",
        );
        const titleText = textPart?.text || "New Conversation";
        const title =
          titleText.slice(0, 50) + (titleText.length > 50 ? "..." : "");

        await UpdateConversationTitle(conversationId, title);
      }
    } else if (messages) {
      // Fallback: use all messages (less efficient)
      allMessages = messages;
    } else {
      return new Response("No messages provided", { status: 400 });
    }

    // Validate messages following Vercel guide
    let validatedMessages: UIMessage[];
    try {
      validatedMessages = await validateUIMessages({
        messages: allMessages,
        // Add tools, metadataSchema, dataPartsSchema here if needed
      });
    } catch (error) {
      console.error("Message validation failed:", error);
      // For now, use messages as-is, but log the error
      validatedMessages = allMessages;
    }

    // Stream the AI response with proper persistence following Vercel guide
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a helpful AI assistant. Be concise and helpful in your responses.",
      messages: await convertToModelMessages(validatedMessages),
    });

    
    result.consumeStream();

    return result.toUIMessageStreamResponse({
      originalMessages: validatedMessages,
      generateMessageId: createIdGenerator({
        prefix: "msg",
        size: 16,
      }),
      onFinish: async ({ messages }) => {
        try {
          await saveChat({ chatId: conversationId, messages });
        } catch (error) {
          console.error("Error saving messages in onFinish:", error);
        }
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}