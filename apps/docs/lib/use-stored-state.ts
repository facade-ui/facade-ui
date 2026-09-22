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
 * local subscribers explicitly. Cross-tab and cross-iframe writes arrive through
 * `storage` on their own, which is what keeps the preview iframes in step with
 * the chrome.
 *
 * `useStoredRaw` deliberately returns the **raw string**: `getSnapshot` must
 * return a stable value, and a primitive is stable for free. Parsing a string
 * into an object inside `getSnapshot` would either hand React a new reference
 * every read or need a cache mutated during render. Callers parse with
 * `useMemo` on the raw value instead.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react"

const listeners = new Set<() => void>()

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  window.addEventListener("storage", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    // Private mode, or storage disabled by policy.
    return null
  }
}

/** The stored string for a key, and a setter. `null` clears the key. */
export function useStoredRaw(
  key: string,
): [string | null, (next: string | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  )

  const set = useCallback(
    (next: string | null) => {
      try {
        if (next === null) localStorage.removeItem(key)
        else localStorage.setItem(key, next)
      } catch {
        // Still notify, so the UI reflects the choice for this session.
      }
      for (const listener of [...listeners]) listener()
    },
    [key],
  )

  return [value, set]
}

/** A stored value constrained to a known set of strings. */
export function useStoredState<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): [T, (next: T) => void] {
  const [raw, setRaw] = useStoredRaw(key)

  const value =
    raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback

  const set = useCallback((next: T) => setRaw(next), [setRaw])

  return [value, set]
}

/** A stored value parsed by a module-level function. */
export function useStoredJson<T>(
  key: string,
  parse: (raw: string | null) => T,
): [T, (next: string | null) => void] {
  const [raw, setRaw] = useStoredRaw(key)
  const value = useMemo(() => parse(raw), [raw, parse])
  return [value, setRaw]
}
