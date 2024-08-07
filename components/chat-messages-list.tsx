"use client";

import { saveMessage } from "@/app/chats/[id]/action";
import { initialChatMessages } from "@/app/chats/[id]/page";
import {
  CHAT_AVATAR_SIZE,
  SUPABASE_PUBLIC_KEY,
  SUPABASE_URL,
} from "@/lib/constants";
import { formatToTimeAgo } from "@/lib/utils";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ChatMessageListProps {
  initialMessage: initialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
}

export default function ChatMessagesList({
  initialMessage,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessage);
  const [message, setMessage] = useState("");
  const channelRef = useRef<RealtimeChannel>(); // 데이터를 담을 박스인데 그 안에서 CRUD를 해도 리랜더링이 발생하지 않음.
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "xxx",
        },
      },
    ]);
    channelRef.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        created_at: new Date(),
        payload: message,
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channelRef.current = client.channel(`room-${chatRoomId}`);
    channelRef.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();
    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId && "justify-end"
          }`}
        >
          {message.userId !== userId && (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={CHAT_AVATAR_SIZE}
              height={CHAT_AVATAR_SIZE}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId && "items-end"
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-neutral-500" : "bg-green-500"
              } p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-[90%] h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="메세지 보내기"
        />
        <button className="absolute right-0 bottom-[5px]">
          <PaperAirplaneIcon className="size-8 text-green-500 transition-colors hover:text-green-300" />
        </button>
      </form>
    </div>
  );
}
