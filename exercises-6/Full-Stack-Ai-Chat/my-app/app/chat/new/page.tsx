import { getSessionCached } from '@/lib/auth-session';
import { CreateConversation } from '@/lib/chat';
import { redirect } from 'next/navigation';

export default async function NewChatPage() {
  const session = await getSessionCached();

  if (!session) {
    redirect('/signIn');
  }

  const conversationId = await CreateConversation(session.user.id);
  redirect(`/chat/${conversationId}`);
}