"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { uploadPost } from "./actions";
import { useFormState } from "react-dom";

export default function AddPost() {
  const [state, action] = useFormState(uploadPost, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <Input
          name="title"
          required
          placeholder="제목을 입력하세요"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <div className="flex flex-col gap-2">
          <textarea
            name="description"
            required
            className="bg-transparent rounded-md w-full h-52 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-green-500 border-none placeholder:text-neutral-400"
            placeholder="동네 이웃과 이야기를 나눠보세요."
          />
          {state?.fieldErrors.description!.map((error, index) => (
            <span key={index} className="text-red-500 font-medium">
              {error}
            </span>
          ))}
        </div>
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
