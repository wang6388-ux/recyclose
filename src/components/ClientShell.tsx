"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const fullScreen = pathname === "/dropoff";

  return <AppShell fullScreen={fullScreen}>{children}</AppShell>;
}
