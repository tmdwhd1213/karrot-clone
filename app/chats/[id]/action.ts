"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
}

export async function markMessageAsRead(chatRoomId: string) {
  const updatedMessage = await db.message.updateMany({
    where: {
      chatRoomId: chatRoomId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return updatedMessage;
}

export async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
          username: true
        },
      },
      product: {
        select: {
          status: true,
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

//user info 가져오기
export async function getUserInfo() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      avatar: true,
      username: true,
    },
  });
  return user;
}

//현재 채팅방 메세지 가져오기
export async function getMessage(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      payload: true,
      id: true,
      created_at: true,
      userId: true,
      isRead: true,
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

//message 타입 정하기
export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessage>;

export async function setReservation(_: any, formData: FormData) {
  const session = await getSession();
  const data = {
    chatId: formData.get("chatId"),
    status: formData.get("status"),
  };
  const chatRoomId: string | undefined =
    data.chatId !== null ? String(data.chatId) : undefined;
  const currentReservation: string | undefined =
    data.status !== null ? String(data.status) : undefined;
  console.log("form data from reservation btn : ", data);

  try {
    if (currentReservation === "reservation") {
      const reservation = await db.chatRoom.update({
        where: {
          id: chatRoomId,
        },
        data: {
          product: {
            update: {
              status: currentReservation,
              buyer: {
                connect: {
                  id: session.id,
                },
              },
            },
          },
        },
      });
      if (reservation) {
        revalidatePath(`/chats/${chatRoomId}`);
        revalidateTag("product-all");
      }
    } else {
      const reservation = await db.chatRoom.update({
        where: {
          id: chatRoomId,
        },
        data: {
          product: {
            update: {
              status: currentReservation,
              buyerUserId: null,
            },
          },
        },
      });
      if (reservation) {
        revalidatePath(`/chats/${chatRoomId}`);
        revalidateTag("product-all");
      }
    }
  } catch (e) {}
}

export async function setConfirm(_: any, formData: FormData) {
  const session = await getSession();
  const data = {
    chatId: formData.get("chatId"),
    status: formData.get("status"),
  };
  const chatRoomId: string | undefined =
    data.chatId !== null ? String(data.chatId) : undefined;
  const currentReservation: string | undefined =
    data.status !== null ? String(data.status) : undefined;
  console.log("form data from reservation btn : ", data);

  try {
    if (currentReservation === "sold") {
      const reservation = await db.chatRoom.update({
        where: {
          id: chatRoomId,
        },
        data: {
          product: {
            update: {
              status: currentReservation,
              buyer: {
                connect: {
                  id: session.id,
                },
              },
            },
          },
        },
      });
      if (reservation) {
        revalidatePath(`/chats/${chatRoomId}`);
        revalidateTag("product-all");
      }
    }
  } catch (e) {}
}

export async function createReview(_: any, formData: FormData) {
  const session = await getSession();
  const data = {
    rating: Number(formData.get("rating")) + 1,
    productId: Number(formData.get("productId")),
    review: formData.get("review") as string | null,
  };
  console.log(data);
  const review = await db.review.create({
    data: {
      rating: data.rating,
      reviewMessage: data.review,
      product: {
        connect: {
          id: data.productId,
        },
      },
      user: {
        connect: {
          id: session.id,
        },
      },
    },
  });
  
  redirect(`/`);
}