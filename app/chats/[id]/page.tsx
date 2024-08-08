import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

export type initialChatMessages = Prisma.PromiseReturnType<typeof getMessage>;

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true }, // URL만 얻어서 접속하는 것이 아닌, 실제 유저가 맞는지 확인
      },
    },
  });
  if (room) {
    const session = await getSession();
    const isRealUser = Boolean(
      room.users.find((user) => user.id === session.id!)
    );
    if (!isRealUser) {
      return null;
    }
  }
  return room;
}

async function getMessage(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return messages;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

export default async function Chats({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  console.log(room);

  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessage(params.id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      initialMessage={initialMessages}
    />
  );
}
