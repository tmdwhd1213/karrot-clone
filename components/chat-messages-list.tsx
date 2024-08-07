"use client";

import { initialChatMessages } from "@/app/chats/[id]/page";
import { CHAT_AVATAR_SIZE } from "@/lib/constants";
import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ChatMessageListProps {
  initialMessage: initialChatMessages;
  userId: number;
}

export default function ChatMessagesList({
  initialMessage,
  userId,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessage);
  return (
    <div className="p-5 flex flex-col gap-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId && "justify-end"
          }`}
        >
          <Image
            src={message.user.avatar!}
            alt={message.user.username}
            width={CHAT_AVATAR_SIZE}
            height={CHAT_AVATAR_SIZE}
            className="size-8 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <span className="bg-green-500 p-2.5 rounded-md">
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
