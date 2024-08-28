import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { random } from "lodash";
import Image from "next/image";
import Link from "next/link";

//모든 채팅방 가져오기
async function getAllChatRoom(id: number | undefined) {
  const rooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: {
            in: [id!],
          },
        },
      },
    },
    include: {
      users: {
        where: {
          NOT: {
            id,
          },
        },
      },
      product: {
        select: {
          title: true,
          photo: true,
        },
      },
      messages: {
        select: {
          payload: true,
          id: true,
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  return rooms;
}

//안읽은 메세지 갯수 세기
//나의 메세지 제외, 다른 사람의 메세지만 세기
async function countUnreadMessages(id: number | undefined) {
  const unreadCount = await db.message.count({
    where: {
      userId: {
        not: id,
      },
      isRead: false,
    },
  });

  return unreadCount;
}

export default async function Chat() {
  const session = await getSession();

  const rooms = await getAllChatRoom(session.id);

  const unReadCount = await countUnreadMessages(session.id);

  return (
    <div className="py-12 px-4 flex flex-col h-screen justify-start items-center ">
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/chats/${room.id}`}
          className="cursor-pointer w-full"
        >
          <div className="px-3 py-2 w-full flex justify-center items-center rounded-xl">
            <div className="flex justify-between w-full py-4 px-4 rounded-xl bg-base-100 shadow-xl">
              <div className="flex justify-center items-center gap-4">
                {room.users[0]?.avatar ? (
                  <Image
                    src={`${room.users[0].avatar}`}
                    alt={room.users[0]?.username ?? "익명의_오이러"}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="size-8 rounded-full bg-slate-400"></div>
                )}
                <div className=" flex flex-col gap-1">
                  <div className="text-xl text-white">
                    {room.users[0]?.username ?? "익명의_오이러"}
                  </div>
                  <div className="text-teal-500 text-sm">
                    {room.messages[0]?.payload ?? null}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 ">
                <span className="text-white">
                  {formatToTimeAgo(room.created_at.toString())}
                </span>
                {unReadCount == 0 ? null : (
                  <div className="badge bg-orange-400 text-white">{`+${unReadCount}`}</div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
