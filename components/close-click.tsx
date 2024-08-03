"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const CloseOnClick = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        router.back();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [router]);

  return <div ref={containerRef}>{children}</div>;
};

export default CloseOnClick;
