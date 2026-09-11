"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string;  
  createdAt: Date;
  userId: string;
  updatedAt: Date;
}

interface ChatSidebarProps {
  conversations: Conversation[];
}

export default function ChatSidebar({ conversations }: ChatSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4">
        <Link
          href="/chat/new"
          className="flex items-center gap-2 w-full bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {conversations.map((conv) => {
          const isActive = pathname === `/chat/${conv.id}`;
          return (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                isActive
                  ? "bg-rose-100 text-rose-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{conv.title || "New Conversation"}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}