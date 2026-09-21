"use client"

/**
 * Copy-to-clipboard button.
 *
 * a11y: the label changes to "Copied" and the result is announced through a
 * polite live region. A purely visual tick would tell a sighted user the copy
 * worked and leave everyone else guessing.
 */

import { CheckIcon, CopyIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@registry/ui/button"

export interface CopyButtonProps {
  value: string
  label?: string
}

export function CopyButton({ value, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground -mr-2 h-8 gap-1.5 px-2 text-xs"
        onClick={() => {
          void navigator.clipboard.writeText(value).then(() => setCopied(true))
        }}
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        <span>{copied ? "Copied" : label}</span>
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} — copied to clipboard` : ""}
      </span>
    </>
  )
}
