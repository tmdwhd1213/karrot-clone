import { AVATAR_SIZE } from "@/lib/constants";
import { formatToTimeAgo } from "@/lib/utils";
import { HandThumbDownIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface CommentProps {
  id: number;
  payload: string;
  userId?: number;
  user: {
    avatar: string | null;
    username: string;
  };
  sessionId?: number;
  createdAt: string;
}

export default function Comments({
  id,
  payload,
  userId,
  user,
  sessionId,
  createdAt,
}: CommentProps) {
  return (
    <>
      <li className="mt-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {user.avatar ? (
              <Image
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                className="size-9 rounded-full"
                src={user.avatar!}
                alt={user.username}
              />
            ) : (
              <UserIcon className="size-9 rounded-full" />
            )}
            <div className="ml-1">
              <span className="text-md font-semibold">{user.username}</span>
              <div className="text-xs text-neutral-400 mt-[2px]">
                <span>{createdAt}</span>
              </div>
            </div>
          </div>
          <button>
            {userId === sessionId ? (
              <EllipsisVerticalIcon className="size-5" />
            ) : null}
          </button>
        </div>
        <div className="flex items-center justify-between pl-4 mt-1">
          <section className="ml-8">{payload}</section>
          <div className="flex items-center gap-3 *:size-5 *:cursor-pointer">
            <HandThumbUpIcon />
            <HandThumbDownIcon />
          </div>
        </div>
      </li>
    </>
  );
}
