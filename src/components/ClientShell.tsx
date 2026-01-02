"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ 你可以把需要全屏的页面路径都加进来
  const fullScreen = pathname === "/dropoff";

  return <AppShell fullScreen={fullScreen}>{children}</AppShell>;
}
