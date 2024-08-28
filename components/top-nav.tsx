"use client";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const router = useRouter();
  const goBackToProfile = () => {
    router.back();
  };

  return (
    <div onClick={goBackToProfile} className="pt-6 px-6 cursor-pointer">
      <ArrowLeftCircleIcon className="size-10" />
    </div>
  );
}
