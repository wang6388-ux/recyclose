"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type SheetSnap = "collapsed" | "half" | "full";

export default function BottomSheet({
  title,
  children,
  snap: snapProp,
  onSnapChange,
  bottomOffset = 0,
}: {
  title: string;
  children: React.ReactNode;
  snap?: SheetSnap;
  onSnapChange?: (s: SheetSnap) => void;
  bottomOffset?: number;
}) {
  const [snapInner, setSnapInner] = useState<SheetSnap>("half");
  const snap = snapProp ?? snapInner;

  function setSnap(next: SheetSnap) {
    onSnapChange?.(next);
    if (snapProp === undefined) setSnapInner(next);
  }

  const startYRef = useRef<number | null>(null);

  const heightClass = useMemo(() => {
    if (snap === "collapsed") return "h-[140px]";
    if (snap === "half") return "h-[360px]";
    return "h-[78vh]";
  }, [snap]);

  function onPointerDown(e: React.PointerEvent) {
    startYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startYRef.current == null) return;
    const dy = e.clientY - startYRef.current;

    if (dy > 60) {
      setSnap(snap === "full" ? "half" : "collapsed");
      startYRef.current = null;
      return;
    }
    if (dy < -60) {
      setSnap(snap === "collapsed" ? "half" : "full");
      startYRef.current = null;
      return;
    }
  }

  function onPointerUp() {
    startYRef.current = null;
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSnap("collapsed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap]);

  return (
    <div
      className="fixed inset-x-0 z-40"
      style={{ bottom: bottomOffset }}
    >
      <div
        className={[
          "mx-auto w-full max-w-[520px]",
          "rounded-t-3xl border border-neutral-200 bg-white shadow-lg",
          "transition-[height] duration-200",
          heightClass,
        ].join(" ")}
      >
        <div
          className="px-4 pt-3 pb-2"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-neutral-300" />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm font-semibold">{title}</div>

            <div className="flex gap-2 text-xs">
              <button
                className="rounded-full border border-neutral-200 px-2 py-1"
                onClick={() => setSnap("collapsed")}
              >
                Min
              </button>
              <button
                className="rounded-full border border-neutral-200 px-2 py-1"
                onClick={() => setSnap("half")}
              >
                Mid
              </button>
              <button
                className="rounded-full border border-neutral-200 px-2 py-1"
                onClick={() => setSnap("full")}
              >
                Full
              </button>
            </div>
          </div>
        </div>

        <div className="h-[calc(100%-64px)] overflow-y-auto px-4 pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
