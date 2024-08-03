"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CloseOnEscape = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return null;
};

export default CloseOnEscape;
