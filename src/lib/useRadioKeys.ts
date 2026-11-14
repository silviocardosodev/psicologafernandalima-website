"use client";

import { useRef, type KeyboardEvent } from "react";

/**
 * Arrow-key navigation for a single-select radio group (roving tabindex).
 * Render each option as `role="radio"` with `aria-checked`, `ref={(el) => { refs.current[i] = el; }}`,
 * `tabIndex={tabIndexFor(i)}` and `onKeyDown={(e) => onKeyDown(e, i)}`.
 */
export function useRadioKeys<T extends string>(options: readonly T[], value: T | "", onChange: (v: T) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % options.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = options.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(options[next]);
    refs.current[next]?.focus();
  };
  const tabIndexFor = (i: number) => {
    const sel = value ? options.indexOf(value as T) : -1;
    return sel === i || (sel === -1 && i === 0) ? 0 : -1;
  };
  return { refs, onKeyDown, tabIndexFor };
}
