"use client"

/**
 * The install command, with a package-manager switcher.
 *
 * a11y: a labelled radio group for the manager rather than a tab widget — there
 * is only one panel and it always shows, so tab semantics would over-describe it.
 */

import { PACKAGE_MANAGERS, type PackageManager } from "@/lib/registry-shared"
import { useStoredState } from "@/lib/use-stored-state"
import { cn } from "@registry/lib/utils"
import { CopyButton } from "./copy-button"

const STORAGE_KEY = "facade-docs-pm"

export interface InstallCommandProps {
  /** Pre-rendered command per manager, so the server does the string building. */
  commands: Record<PackageManager, string>
  className?: string
}

export function InstallCommand({ commands, className }: InstallCommandProps) {
  const [manager, choose] = useStoredState<PackageManager>(
    STORAGE_KEY,
    PACKAGE_MANAGERS,
    "pnpm",
  )

  return (
    <div className={cn("bg-card overflow-hidden rounded-lg border", className)}>
      <div className="border-border bg-muted/40 flex items-center justify-between gap-3 border-b px-2 py-1.5">
        <fieldset className="flex items-center gap-0.5">
          <legend className="sr-only">Package manager</legend>
          {PACKAGE_MANAGERS.map((value) => (
            <label
              key={value}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                "has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-2",
                manager === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name="facade-package-manager"
                value={value}
                checked={manager === value}
                onChange={() => choose(value)}
                className="sr-only"
              />
              {value}
            </label>
          ))}
        </fieldset>
        <CopyButton value={commands[manager]} label="Copy command" />
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-sm">
        <code>{commands[manager]}</code>
      </pre>
    </div>
  )
}
