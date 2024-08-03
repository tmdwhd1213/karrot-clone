"use client";

import {
  HomeIcon as OutlineHomeIcon,
  ChevronLeftIcon as BackIcon,
  ShareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropdown from "./dropdown";
import DeleteModal from "./delete-modal";

interface UpperTabBarProps {
  id: number;
  isOwner: boolean;
  deleteProduct?: any;
}

export default function UpperTabBar({
  id,
  isOwner,
  deleteProduct,
}: UpperTabBarProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // 삭제 토글
  const deleteHandler = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsDeleteOpen((prev) => !prev);
  };

  const cancelHandler = () => {
    setIsDeleteOpen((prev) => !prev);
  };

  const backHandler = () => {
    router.back();
  };

  return (
    <>
      {isDeleteOpen ? (
        <DeleteModal
          cancelHandler={cancelHandler}
          isDeleteOpen={isDeleteOpen}
          id={id}
          isOwner={isOwner}
        />
      ) : null}
      <div className="z-40 fixed top-4 mx-auto w-[640px] flex justify-between px-5 py-3">
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
          <button onClick={toggleDropdown}>
            <EllipsisVerticalIcon className="w-8 h-8" />
          </button>
          <Dropdown
            setIsOpen={setIsDropdownOpen}
            isOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
            id={id}
            isOwner={isOwner}
            deleteHandler={deleteHandler}
          />
        </div>
      </div>
    </>
  );
}
