"use client";

import {
  HomeIcon as OutlineHomeIcon,
  ChevronLeftIcon as BackIcon,
  ShareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UpperTabBar() {
  const router = useRouter();

  const backHandler = () => {
    router.back();
  };

  return (
    <div className="z-50 fixed top-4 mx-auto w-[640px] flex justify-between px-5 py-3">
      <div className="*:text-white flex gap-8">
        <button onClick={backHandler}>
          <BackIcon className="w-8 h-8" />
        </button>
        <Link href="/home" className="flex flex-col items-center gap-px">
          <OutlineHomeIcon className="w-8 h-8" />
        </Link>
      </div>
      <div className="*:text-white flex gap-8">
        <button>
          <ShareIcon className="w-8 h-8" />
        </button>
        <button>
          <EllipsisVerticalIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
