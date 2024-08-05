"use client";

import { dislikePost, likePost } from "@/app/posts/[id]/actions";
import { HandThumbUpIcon as OnLike } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OffLike } from "@heroicons/react/24/solid";
import { useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}
export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => {
      return {
        isLiked: !previousState.isLiked,
        likeCount: previousState.isLiked
          ? previousState.likeCount - 1
          : previousState.likeCount + 1,
      };
    }
  );
  const onClick = async () => {
    reducerFn(null);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex *:mx-[1px] items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors ${
        state.isLiked ? "bg-green-500 text-white border-green-500" : ""
      }`}
    >
      {state.isLiked ? (
        <OnLike className="size-5" />
      ) : (
        <OffLike className="size-5" />
      )}

      <span>{state.likeCount ? state.likeCount : "공감하기"}</span>
    </button>
  );
}
