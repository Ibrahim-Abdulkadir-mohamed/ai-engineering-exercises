import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GetUserConversations } from "@/lib/chat";
import ChatSidebar from "@/components/chat-sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signIn");
  }

  const conversations = await GetUserConversations(session.user.id);

  return (
    <div className="flex h-screen">
      <ChatSidebar conversations={conversations} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}