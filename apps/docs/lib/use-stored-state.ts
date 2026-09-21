"use client"

/**
 * React state backed by localStorage, read through `useSyncExternalStore`.
 *
 * The obvious version — `useState` plus a `useEffect` that reads localStorage on
 * mount — causes a cascading render on every load and is what
 * `react-hooks/set-state-in-effect` exists to flag. localStorage *is* an
 * external store, so the right primitive is the one React provides for exactly
 * that: the server snapshot is the fallback, React re-reads after hydration, and
 * no extra render pass is scheduled.
 *
 * Same-tab writes do not fire the `storage` event, so writes are broadcast to
 * local subscribers explicitly.
 */

import { useCallback, useSyncExternalStore } from "react"

const listeners = new Set<() => void>()

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  window.addEventListener("storage", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** Reads a key, falling back when storage is unavailable or the value is unknown. */
function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored && (allowed as readonly string[]).includes(stored)
      ? (stored as T)
      : fallback
  } catch {
    // Private mode, or storage disabled by policy. The fallback is correct.
    return fallback
  }
}

export function useStoredState<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): [T, (next: T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, allowed, fallback),
    () => fallback,
  )

  const set = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, next)
      } catch {
        // Still notify, so the UI reflects the choice for this session.
      }
      for (const listener of [...listeners]) listener()
    },
    [key],
  )

  return [value, set]
}
