"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="flex-1 flex flex-col amc-page-enter">
      {children}
    </div>
  );
}
