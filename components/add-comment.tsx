"use client";

import { createComment } from "@/app/posts/[id]/actions";
import CommentButton from "./comment-button";
import { Suspense, useOptimistic } from "react";
import { useFormState } from "react-dom";
import Comments from "./comments";
import { formatToTimeAgo } from "@/lib/utils";

interface CommentsProps {
  payload: string;
  id: number;
  userId: number;
  created_at: Date;
  user: {
    username: string;
    avatar: string | null;
  };
}

export default function AddComment({
  id,
  sessionId,
  comments,
  commentsAmount,
}: {
  id: number;
  sessionId: number;
  comments: CommentsProps[];
  commentsAmount: number;
}) {
  const [optimisticState, reducerFn] = useOptimistic(
    comments,
    (previousComments, payload: CommentsProps) => [...previousComments, payload]
  );

  //여기서 server action을 intercept해서 필요한 작업 수행 (나중에 다시 확인!)
  const interceptAction = async (_: any, formData: FormData) => {
    // formData 이용해서 newComment 생성
    const newComment = {
      payload: formData.get("comment")?.toString()!,
      id,
      created_at: new Date(),
      userId: sessionId,
      user: {
        username: "optimistic",
        avatar: null,
      },
    };

    // optimistic
    reducerFn(newComment);
    formData.append("postId", id + "");
    return createComment(null, formData);
  };
  const [, action] = useFormState(interceptAction, null);

  return (
    <>
      <Suspense
        fallback={<span className="loading loading-bars loading-sm"></span>}
      >
        <ul className="mt-3 bg-neutral-800 p-5 text-white">
          <li className="text-neutral-300 mb-3 text-sm">
            댓글 {commentsAmount}
          </li>
          {optimisticState.map(({ id, payload, user, userId, created_at }) => (
            <Comments
              key={id}
              id={id}
              payload={payload}
              sessionId={sessionId}
              user={user}
              userId={userId}
              createdAt={formatToTimeAgo(created_at.toString())}
            />
          ))}
        </ul>
      </Suspense>
      <form
        action={action}
        className="flex gap-2 justify-center items-center w-full fixed bottom-2 left-0"
      >
        <input
          type="text"
          name="comment"
          className="placeholder:text-neutral-400 bg-neutral-700 rounded-full w-[620px]"
          placeholder="댓글을 입력해주세요."
        />
        <CommentButton />
      </form>
    </>
  );
}
