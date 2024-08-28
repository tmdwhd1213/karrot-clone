import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface ProfileButtonsProps {
  path: string;
  title: string;
  id: number | undefined;
}

export default function ProfileButtons({
  path,
  title,
  id,
}: ProfileButtonsProps) {
  return (
    <>
      <Link
        href={`/profile/${id}/${path}`}
        className={`${
          path === "edit" ? "rounded-md bg-neutral-700" : "bg-neutral-800"
        }
          flex justify-center w-full h-auto py-1 font-bold hover:bg-neutral-500 transition-colors`}
      >
        {path === "edit" ? (
          <label className="text-white h-auto cursor-pointer">{title}</label>
        ) : (
          <label className=" w-full text-white py-2 px-4 cursor-pointer flex justify-between">
            {title} <ChevronRightIcon className="h-6" />
          </label>
        )}
      </Link>
    </>
  );
}
