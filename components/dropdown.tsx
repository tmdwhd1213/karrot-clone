"use client";

import Link from "next/link";
import { SetStateAction, useEffect, useRef, useState } from "react";
import DeleteModal from "./delete-modal";

interface DropdownMenuProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  id: number;
  isOwner: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  deleteHandler: () => void;
}

export default function Dropdown({
  isOpen,
  toggleDropdown,
  id,
  isOwner,
  setIsOpen,
  deleteHandler,
}: DropdownMenuProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      toggleDropdown();
    }
  };

  useEffect(() => {
    isOpen
      ? document.addEventListener("mousedown", handleClickOutside)
      : document.removeEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={`absolute flex flex-col gap-1 right-0 w-48 bg-neutral-600 rounded-md shadow-lg z-10 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {isOwner ? (
        <>
          <Link className="px-5 py-2.5 text-white" href={`/product/edit/${id}`}>
            게시글 수정
          </Link>
          <button onClick={deleteHandler} className="px-5 py-2.5 text-left">
            삭제
          </button>
        </>
      ) : (
        <div>주인 아니지롱 (공사중)</div>
      )}
    </div>
  );
}
