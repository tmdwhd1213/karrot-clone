"use client";
import {
  saveMessage,
  setConfirm,
  setReservation,
} from "@/app/chats/[id]/action";
import { InitialChatMessages } from "@/app/chats/[id]/action";
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import CreateReview from "./createReview";
import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { CHAT_AVATAR_SIZE } from "@/lib/constants";
import { formatToTimeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  avatar: string;
  username: string;
  status: string;
  productId: number;
  productMaster: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  avatar,
  username,
  status,
  productId,
  productMaster,
}: ChatMessageListProps) {
  const router = useRouter();
  const [currentReservation, setCurrentReservation] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null); // 채팅 리스트 끝부분을 참조할 ref
  const inputRef = useRef<HTMLInputElement>(null); // 입력창을 참조할 ref
  // 메시지 목록의 끝으로 스크롤하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setMessage(value);
  };
  const onInputSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessages((prevMsg) => [
      ...prevMsg,
      {
        id: Date.now(),
        created_at: new Date(),
        payload: message,
        user: {
          avatar,
          username,
        },
        isRead: false,
        userId: userId,
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        isRead: false,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
    setTimeout(scrollToBottom, 1000);
  };
  useEffect(() => {
    //useState 현재 예약현황 저장
    setCurrentReservation(status);

    //supabase connect

    channel.current = supabase.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId, status]);

  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const interceptionReservation = (_: any, formData: FormData) => {
    formData.set("chatId", chatRoomId);

    if (currentReservation === "forsale") {
      formData.set("status", "reservation");
      setCurrentReservation("reservation");
    } else {
      formData.set("status", "forsale");
      setCurrentReservation("forsale");
    }

    return setReservation(_, formData);
  };

  const interceptionConfirm = (_: any, formData: FormData) => {
    formData.set("chatId", chatRoomId);

    formData.set("status", "sold");
    setCurrentReservation("sold");

    return setConfirm(_, formData);
  };

  const [state, action] = useFormState(interceptionReservation, null);
  const [stateConfirm, actionConfirm] = useFormState(interceptionConfirm, null);
  const backHandler = () => {
    router.back();
  };

  return (
    <div>
      <div className="p-5 flex flex-col gap-5 min-h-screen justify-end ">
        <div className="fixed inset-x-0 z-10 top-10 flex flex-col gap-5 justify-center items-start px-10">
          <button onClick={backHandler}>
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
          <div className="w-[90%] px-6 py-2 bg-neutral-800 rounded-md flex justify-between items-center gap-8  ">
            <div className="flex flex-col text-white grow text-center">
              {currentReservation === "forsale" ? (
                <div>
                  {productMaster}님과 거래 예약을 원하시면 예약하기 버튼을
                  눌러주세요.
                </div>
              ) : currentReservation === "reservation" ? (
                <div>
                  {productMaster}님과 거래를 완료하시려면 구매확정 버튼을
                  눌러주세요.
                </div>
              ) : null}
              {currentReservation !== "reservation" &&
                currentReservation === "sold" &&
                "구매가 완료되었습니다."}
            </div>
            {currentReservation === "forsale" ? (
              <form action={action}>
                <button className="bg-green-500  text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  예약하기
                </button>
              </form>
            ) : currentReservation === "reservation" ? (
              <form action={action}>
                <button className="bg-green-500  text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  예약취소
                </button>
              </form>
            ) : null}

            {currentReservation === "reservation" ? (
              <form action={actionConfirm}>
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  구매확정
                </button>
              </form>
            ) : currentReservation === "sold" ? (
              <div className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-not-allowed  whitespace-nowrap">
                구매완료
              </div>
            ) : null}
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${
              message.userId === userId && "justify-end"
            }`}
          >
            {message.userId !== userId &&
              (message.user.avatar ? (
                <Image
                  src={message.user.avatar}
                  alt={message.user.username}
                  width={48}
                  height={48}
                  className="size-8 rounded-full"
                />
              ) : (
                <UserIcon className="w-[48px] h-[48px]" />
              ))}
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
        {currentReservation === "sold" ? (
          <CreateReview productId={productId} />
        ) : null}
        <div ref={messagesEndRef} />
        {currentReservation === "sold" ? null : (
          <form className="flex relative" onSubmit={onInputSubmit}>
            <input
              required
              onChange={onInputChange}
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
        )}
      </div>
    </div>
  );
}
