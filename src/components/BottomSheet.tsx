"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type SheetSnap = "hidden" | "collapsed" | "half" | "full";

export default function BottomSheet({
  title,
  children,
  snap: snapProp,
  onSnapChange,
  bottomOffset = 0,
  contentRef,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  snap?: SheetSnap;
  onSnapChange?: (s: SheetSnap) => void;
  bottomOffset?: number | string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [snapInner, setSnapInner] = useState<SheetSnap>("half");
  const snap = snapProp ?? snapInner;

  function setSnap(next: SheetSnap) {
    onSnapChange?.(next);
    if (snapProp === undefined) setSnapInner(next);
  }

  const startYRef = useRef<number | null>(null);

  const heightClass = useMemo(() => {
    if (snap === "hidden") return "h-0";
    if (snap === "collapsed") return "h-[140px]";
    if (snap === "half") return "h-[360px]";
    return "h-[78vh]";
  }, [snap]);

  // ✅ 给 hidden 增加“彻底隐藏”的视觉与布局保障
  const hiddenClass = snap === "hidden" ? "opacity-0 overflow-hidden" : "opacity-100";

  function onPointerDown(e: React.PointerEvent) {
    startYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startYRef.current == null) return;
    const dy = e.clientY - startYRef.current;

    // 下滑：full -> half -> collapsed -> hidden
    if (dy > 60) {
      if (snap === "full") setSnap("half");
      else if (snap === "half") setSnap("collapsed");
      else if (snap === "collapsed") setSnap("hidden");
      else setSnap("hidden");
      startYRef.current = null;
      return;
    }

    // 上滑：hidden -> collapsed -> half -> full
    if (dy < -60) {
      if (snap === "hidden") setSnap("collapsed");
      else if (snap === "collapsed") setSnap("half");
      else setSnap("full");
      startYRef.current = null;
      return;
    }
  }

  function onPointerUp() {
    startYRef.current = null;
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSnap("hidden");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={["fixed inset-x-0 z-40", snap === "hidden" ? "pointer-events-none" : "pointer-events-auto"].join(" ")}
      style={{ bottom: bottomOffset }}
    >
      <div
        className={[
          "mx-auto w-full max-w-md",
          "rounded-t-3xl border border-neutral-200 bg-white shadow-lg",
          "transition-[height,opacity] duration-200",
          heightClass,
          hiddenClass,
        ].join(" ")}
      >
        {/* drag handle area */}
        <div
          className="px-4 pt-3 pb-2 select-none touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-neutral-300" />
          <div className="mt-2 text-[20px] font-semibold leading-none text-[var(--brand-900)]">{title}</div>
        </div>

        {/* content */}
        <div
          ref={contentRef as any}
          className="h-[calc(100%-56px)] overflow-y-auto px-4"
          style={{
            // ✅ 这里不要额外加 safe-area：bottomOffset 已经负责把 sheet 抬到 nav 之上
            paddingBottom: "12px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
