/**
 * Input — a text field built on Base UI's Field, so the label, description and
 * error are wired to the control for you.
 *
 * Base UI's `Field` generates the ids and the `aria-labelledby`,
 * `aria-describedby` and `aria-invalid` links between the parts. Doing that by
 * hand is where accessible forms usually go wrong — a visually associated label
 * that is not programmatically associated is invisible to assistive tech.
 *
 * a11y notes worth keeping:
 *
 *  - The border uses `--input`, which the token layer holds at 3:1 against the
 *    background (WCAG 1.4.11). It is noticeably darker than `--border`, because
 *    the edge is the only thing identifying the control as a field.
 *  - A required field is marked with the word "required" in the label, not with
 *    a bare asterisk whose meaning is a convention rather than information.
 *  - The error is rendered by `Field.Error`, which Base UI associates with the
 *    control, so it is announced rather than merely appearing underneath.
 *  - `aria-invalid` is set explicitly when `error` is passed in. Base UI derives
 *    it from the control's own `ValidityState`, which knows nothing about an
 *    error that came back from a server — so without this, an externally
 *    supplied message is described but the field is not marked invalid.
 *  - 44px tall, matching every other control in the registry.
 *
 * `label` is required. Pass `hideLabel` for a search or subscribe field where
 * the design calls for a placeholder instead — the label stays in the
 * accessibility tree, which a placeholder alone never does.
 *
 * Dependencies: @base-ui-components/react, react, @registry/lib/utils.
 */

import { Field } from "@base-ui-components/react/field"
import { Input as BaseInput } from "@base-ui-components/react/input"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@registry/lib/utils"

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  /** Required. Use `hideLabel` if it should not be visible. */
  label: ReactNode
  /** Keeps the label in the accessibility tree but out of the layout. */
  hideLabel?: boolean
  /** Help text below the field, associated automatically. */
  description?: ReactNode
  /** Error message. Associated and announced by Base UI. */
  error?: ReactNode
  /** Rendered inside the field on the trailing edge — a button, a unit. */
  trailing?: ReactNode
  /** Classes for the outer Field.Root. */
  className?: string
  /** Classes for the `<input>` itself. */
  inputClassName?: string
}

export function Input({
  label,
  hideLabel = false,
  description,
  error,
  trailing,
  className,
  inputClassName,
  required,
  ...props
}: InputProps) {
  return (
    <Field.Root className={cn("flex w-full flex-col gap-1.5", className)}>
      <Field.Label
        className={cn("text-foreground text-sm font-medium", hideLabel && "sr-only")}
      >
        {label}
        {/* Spelled out, because an asterisk is a convention, not information. */}
        {required ? <span className="text-muted-foreground"> (required)</span> : null}
      </Field.Label>

      <div className="relative flex w-full items-center">
        <BaseInput
          required={required}
          // See the header: Base UI cannot infer this from an external error.
          aria-invalid={error ? true : undefined}
          className={cn(
            "border-input bg-background text-foreground placeholder:text-muted-foreground",
            "h-11 w-full rounded-md border px-3.5 text-base",
            "duration-facade-fast ease-facade-out transition-[border-color,box-shadow]",
            "focus-visible:ring-ring focus-visible:border-ring outline-none focus-visible:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "data-[invalid]:border-destructive data-[invalid]:focus-visible:ring-destructive",
            trailing && "pr-28",
            inputClassName,
          )}
          {...props}
        />
        {trailing ? (
          <span className="absolute inset-y-1 right-1 flex items-center">{trailing}</span>
        ) : null}
      </div>

      {description ? (
        <Field.Description className="text-muted-foreground text-pretty text-sm">
          {description}
        </Field.Description>
      ) : null}

      {/* `match` lets an externally-supplied error show regardless of the
          control's own ValidityState, which is what a server-side error is. */}
      <Field.Error
        className="text-destructive text-pretty text-sm"
        match={Boolean(error) || undefined}
      >
        {error}
      </Field.Error>
    </Field.Root>
  )
}
