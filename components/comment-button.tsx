"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useFormStatus } from "react-dom";

export default function CommentButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} name="comment-button">
      {pending ? (
        <span className="loading loading-bars loading-sm"></span>
      ) : (
        <PaperAirplaneIcon className="size-5 text-green-500" />
      )}
    </button>
  );
}
