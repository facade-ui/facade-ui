"use client"

/**
 * Keeps the custom theme's stylesheet in step with storage. Renders nothing.
 *
 * Mounted in the **root** layout, which is the parent of the docs shell, the
 * marketing pages and the bare `/preview` routes — so a preview in an iframe,
 * and the same preview opened full width in its own tab, both follow the
 * palette without a single change to the postMessage protocol. Storage writes
 * reach every other same-origin document through the `storage` event; this
 * component turns whatever it reads into the `<style>` element.
 */

import { useEffect } from "react"

import { applyCustomTheme, useCustomTheme } from "@/lib/custom-theme"

export function CustomThemeStyle() {
  const [theme] = useCustomTheme()

  useEffect(() => {
    applyCustomTheme(theme)
  }, [theme])

  return null
}
