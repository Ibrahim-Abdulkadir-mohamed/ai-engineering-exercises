// lib/chat/conversation.ts
import { db } from "@/db/drizzle";
import { conversation } from "@/db/schema";
import { nanoid } from "nanoid";
import { eq, desc } from "drizzle-orm";

export const CreateConversation = async (
  userId: string,
  title?: string,
): Promise<string> => {
  const conversationId = nanoid();

  await db.insert(conversation).values({
    id: conversationId,
    title: title || "New Conversation",
    userId: userId,
  });

  return conversationId;
};

export const GetUserConversations = async (userId: string) => {
  return await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, userId))
    .orderBy(desc(conversation.createdAt));
};

export const GetConversationById = async (
  conversationId: string,
  userId: string,
) => {
  const result = await db
    .select()
    .from(conversation)
    .where(eq(conversation.id, conversationId))
    .limit(1);

  const conv = result[0];
  if (!conv || conv.userId !== userId) {
    throw new Error("Conversation not found");
  }

  return conv;
};

export const UpdateConversationTitle = async (
  conversationId: string,
  title: string,
) => {
  await db
    .update(conversation)
    .set({ title })
    .where(eq(conversation.id, conversationId));
};