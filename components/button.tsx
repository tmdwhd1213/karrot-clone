"use client";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 
      disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "잠시만 기다려주세요" : text}
    </button>
  );
}
