// src/lib/savedDb.ts
"use client";

import { useEffect, useState } from "react";

const KEY = "recyclose_saved_db_slugs";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function writeSaved(slugs: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(slugs));
}

/**
 * ✅ React hook：返回当前 saved slugs（会跟随 localStorage 更新）
 */
export function useSavedSlugs() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    // 初次读取
    setSlugs(readSaved());

    // 跨组件/跨页面同步：监听自定义事件
    const onCustom = () => setSlugs(readSaved());
    window.addEventListener("saved-db-changed", onCustom);

    // 跨 tab 同步
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSlugs(readSaved());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("saved-db-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return slugs;
}

/**
 * ✅ 切换收藏（保存/取消保存）
 */
export function toggleSaved(slug: string) {
  const current = readSaved();
  const set = new Set(current);
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);

  const next = Array.from(set);
  writeSaved(next);

  // 通知同一 tab 的其他组件刷新
  window.dispatchEvent(new Event("saved-db-changed"));
}

/**
 * 可选：清空收藏
 */
export function clearSaved() {
  writeSaved([]);
  window.dispatchEvent(new Event("saved-db-changed"));
}
