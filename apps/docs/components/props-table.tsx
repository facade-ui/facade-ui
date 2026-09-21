/**
 * Props tables, generated from the registry source by `scripts/extract-props.ts`.
 *
 * Nothing here is hand-maintained: renaming a prop or changing its default
 * changes this table on the next build. Inherited types are named rather than
 * flattened, because a reader chasing `BaseButtonProps` is better served by the
 * real name than by a hundred inlined DOM attributes.
 *
 * a11y: a real `<table>` with a caption and row headers, so screen readers can
 * navigate it cell by cell and announce which prop each row describes.
 */

import type { FileDoc } from "@scripts/props-types"
import { cn } from "@registry/lib/utils"

export interface PropsTableProps {
  files: FileDoc[]
  className?: string
}

export function PropsTable({ files, className }: PropsTableProps) {
  const interfaces = files.flatMap((file) => file.interfaces)
  if (interfaces.length === 0) return null

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {interfaces.map((iface) => (
        <section key={iface.name} className="flex flex-col gap-3">
          <h3 id={`props-${iface.name}`} className="font-mono text-base font-semibold">
            {iface.name}
          </h3>
          {iface.description ? (
            <p className="text-muted-foreground text-pretty text-sm">
              {iface.description}
            </p>
          ) : null}
          {iface.extends.length > 0 ? (
            <p className="text-muted-foreground text-sm">
              Extends{" "}
              {iface.extends.map((name, index) => (
                <span key={name}>
                  {index > 0 ? ", " : ""}
                  <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                    {name}
                  </code>
                </span>
              ))}
              .
            </p>
          ) : null}

          {iface.props.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">Props for {iface.name}</caption>
                <thead className="bg-muted/40">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Prop
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Type
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {iface.props.map((prop) => (
                    <tr key={prop.name} className="border-t align-top">
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        <code className="font-mono text-sm font-medium">{prop.name}</code>
                        {prop.required ? (
                          <span className="text-destructive ml-1" title="Required">
                            *<span className="sr-only">Required</span>
                          </span>
                        ) : null}
                        {prop.description ? (
                          <span className="text-muted-foreground mt-1 block text-pretty text-xs font-normal">
                            {prop.description}
                          </span>
                        ) : null}
                      </th>
                      <td className="px-4 py-3">
                        <code className="text-muted-foreground break-words font-mono text-xs">
                          {prop.type}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        {prop.defaultValue ? (
                          <code className="font-mono text-xs">{prop.defaultValue}</code>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  )
}
