"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dropoff", label: "Dropoff" },
  { href: "/database", label: "Database" },
  { href: "/community", label: "Community" },
  { href: "/account", label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[999] border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-md">
        <div className="grid grid-cols-4">
          {tabs.map((t) => {
            const active = pathname === t.href || pathname.startsWith(t.href + "/");
            return (
              <Link
                key={t.href}
                href={t.href}
                className={[
                  "py-3 text-center text-xs",
                  active ? "font-semibold text-neutral-900" : "text-neutral-500",
                ].join(" ")}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
