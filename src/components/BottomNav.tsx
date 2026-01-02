"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type React from "react";

import {
  DropoffNavIcon,
  DatabaseNavIcon,
  CommunityNavIcon,
  AccountNavIcon,
} from "@/components/icons/NavIcons";

type Tab = {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  activeMatch?: (pathname: string) => boolean;
};

const TABS: Tab[] = [
  {
    href: "/dropoff",
    label: "Dropoff",
    Icon: DropoffNavIcon,
    activeMatch: (p) => p === "/dropoff" || p.startsWith("/dropoff/"),
  },
  {
    href: "/database",
    label: "Database",
    Icon: DatabaseNavIcon,
    activeMatch: (p) => p === "/database" || p.startsWith("/database/"),
  },
  {
    href: "/community",
    label: "Community",
    Icon: CommunityNavIcon,
    activeMatch: (p) => p === "/community" || p.startsWith("/community/"),
  },
  {
    href: "/account",
    label: "Account",
    Icon: AccountNavIcon,
    activeMatch: (p) => p === "/account" || p.startsWith("/account/"),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80]">
      <div className="pointer-events-auto w-full bg-white/95 ring-1 ring-neutral-200 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <nav className="mx-auto w-full max-w-md px-3">
          <ul className="grid grid-cols-4 py-2.5">
            {TABS.map((t) => {
              const isActive = t.activeMatch ? t.activeMatch(pathname) : pathname === t.href;
              const Icon = t.Icon;

              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
                      "flex w-full flex-col items-center justify-center py-2 transition",
                      isActive ? "text-[var(--brand-900)]" : "text-[rgba(46,63,58,.65)]"
                    )}
                  >
                    <span
                      className={clsx(
                        "block transition-transform duration-150",
                        isActive ? "scale-110" : "scale-100"
                      )}
                    >
                      <Icon className="h-[22px] w-[22px]" />
                    </span>

                    <div className="mt-[2px] text-[11px] font-semibold leading-none">{t.label}</div>

                    <div
                      className={clsx(
                        "mt-[6px] h-[3px] w-6 rounded-full",
                        isActive ? "bg-[var(--brand-900)]" : "bg-transparent"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
