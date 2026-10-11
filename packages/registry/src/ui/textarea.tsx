/**
 * Textarea — a multi-line text field built on Base UI's Field, so the label,
 * description and error are wired to the control the same way `Input` wires
 * them.
 *
 * Base UI's `Input` is `Field.Control`; here `Field.Control` renders a
 * `<textarea>` through its `render` prop, which keeps the generated ids, the
 * `aria-*` links and the validation ref.
 *
 * a11y notes worth keeping:
 *
 *  - The border uses `--input`, held at 3:1 against the background.
 *  - `Field.Root invalid` marks the control `aria-invalid` and turns the
 *    border red for an error passed in from outside, such as one from a server.
 *  - "required" is spelled out in the label, as in `Input`.
 *  - At least 44px tall, and it can be resized vertically unless `resize` is
 *    `none`, so long answers stay readable without a scrollbar.
 *
 * Dependencies: @base-ui-components/react, react, @registry/lib/utils.
 */

import { Field } from "@base-ui-components/react/field"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@registry/lib/utils"

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /** Required. Use `hideLabel` if it should not be visible. */
  label: ReactNode
  /** Hides the label visually but keeps it for screen readers. */
  hideLabel?: boolean
  /** Help text below the field. It is linked to the field for you. */
  description?: ReactNode
  /** Error message. Marks the field invalid and is announced with it. */
  error?: ReactNode
  /** Visible lines of text. */
  rows?: number
  /** `vertical` lets the user drag the height; `none` fixes it. */
  resize?: "vertical" | "none"
  /** Classes for the outer Field.Root. */
  className?: string
  /** Classes for the `<textarea>` itself. */
  textareaClassName?: string
}

export function Textarea({
  label,
  hideLabel = false,
  description,
  error,
  rows = 4,
  resize = "vertical",
  className,
  textareaClassName,
  name,
  value,
  defaultValue,
  disabled,
  required,
  ...props
}: TextareaProps) {
  return (
    <Field.Root
      invalid={Boolean(error)}
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      <Field.Label
        className={cn("text-foreground text-sm font-medium", hideLabel && "sr-only")}
      >
        {label}
        {required ? <span className="text-muted-foreground"> (required)</span> : null}
      </Field.Label>

      {/* Field reads the form props; the rest are textarea attributes. */}
      <Field.Control
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        render={<textarea rows={rows} {...props} />}
        className={cn(
          "border-input bg-background text-foreground placeholder:text-muted-foreground",
          "min-h-11 w-full rounded-md border px-3.5 py-2.5 text-base leading-6",
          "duration-facade-fast ease-facade-out transition-[border-color,box-shadow]",
          "focus-visible:ring-ring focus-visible:border-ring outline-none focus-visible:ring-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "data-[invalid]:border-destructive data-[invalid]:focus-visible:ring-destructive",
          resize === "none" ? "resize-none" : "resize-y",
          textareaClassName,
        )}
      />

      {description ? (
        <Field.Description className="text-muted-foreground text-pretty text-sm">
          {description}
        </Field.Description>
      ) : null}

      {/* `match` shows an error from outside, which Base UI's own validity
          state knows nothing about. */}
      <Field.Error
        className="text-destructive text-pretty text-sm"
        match={Boolean(error) || undefined}
      >
        {error}
      </Field.Error>
    </Field.Root>
  )
}
