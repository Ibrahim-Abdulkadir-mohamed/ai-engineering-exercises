import { loadChat, GetConversationById } from '@/lib/chat';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Chat from '@/components/chat';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/signIn');
  }

  let conversation;
  try {
    conversation = await GetConversationById(id, session.user.id);
  } catch {
    redirect('/chat/new'); // ← ha ku laaban conversation aan jirin
  }

  const initialMessages = await loadChat(id);

  return (
    <Chat
      conversationId={id}
      initialMessages={initialMessages}
      conversationTitle={conversation.title}
    />
  );
}