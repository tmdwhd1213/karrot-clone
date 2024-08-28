import TopNav from "@/components/top-nav";
import React from "react";

export default function ProfileActionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TopNav />
      <div>{children}</div>
    </div>
  );
}
