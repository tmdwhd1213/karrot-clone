"use client";
import { cls } from "@/lib/utils";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
  edit?: boolean;
  isForsale?: boolean;
}

export default function Button({ text, edit, isForsale = true }: ButtonProps) {
  //useFormStatus는 자신의 부모 요소를 찾으려고 한다.
  //자식 요소에서 사용하는 hook이다.
  //따라서 FormButton을 가지고 있는 부모의 요소에서 action의 진행과정을 가져올 수 있다.
  //지금의 경우에는 login page.tsx가 부모가 되겠지.
  const { pending, action, data, method } = useFormStatus();

  return (
    <>
      <button
        disabled={pending || !isForsale}
        className={cls(
          "primary-btn h-10 disabled:bg-neutral-400 px-2 disabled:text-neutral-300 disabled:cursor-not-allowed",
          edit ? "w-1/3 mt-6" : "",
          isForsale ? "" : "cursor-not-allowed"
        )}
      >
        {pending ? "Loading..." : text}
      </button>
    </>
  );
}
