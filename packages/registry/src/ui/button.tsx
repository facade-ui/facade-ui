/**
 * Button — Facade styling over Base UI's `Button`.
 *
 * Not marked `"use client"`, and deliberately so: Base UI's own modules carry the
 * directive, so this wrapper stays a server component and a hero rendered on the
 * server ships no extra client boundary of its own.
 *
 * `render` is Base UI's composition escape hatch (the equivalent of Radix's
 * `asChild`) — swap the element while keeping behaviour and styling:
 *
 *   <Button render={<a href="/pricing" />}>See pricing</Button>
 *
 * Pass `nativeButton={false}` whenever `render` produces something that is not a
 * native `<button>`, so Base UI supplies `role="button"` and the Space/Enter
 * handling that element would otherwise lack.
 *
 * `buttonVariants` is exported alongside for the common case of a plain link
 * styled as a button — `<a className={buttonVariants({ variant: "outline" })}>`.
 *
 * a11y: every size is at least 44x44 CSS px (WCAG 2.5.5), the focus ring is
 * always visible, and `loading` sets `aria-busy` while keeping the label in the
 * accessible name so it never changes mid-interaction.
 *
 * Dependencies: @base-ui-components/react, class-variance-authority,
 * lucide-react, react, @/lib/utils.
 */

import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@base-ui-components/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md font-medium",
    "transition-[color,background-color,border-color,box-shadow,opacity] duration-facade-fast ease-facade-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline underline-offset-4 hover:text-foreground/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        /** 44px — the WCAG 2.5.5 target minimum, and the floor for every control. */
        sm: "h-11 px-4 text-sm",
        md: "h-12 px-5 text-base",
        lg: "h-14 px-7 text-base sm:text-lg",
        icon: "size-11 p-0",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", fullWidth: false },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type ButtonProps = BaseButtonProps &
  ButtonVariantProps & {
    /** Shows a spinner, sets `aria-busy`, and disables activation. */
    loading?: boolean
    /** Screen-reader-only status text shown beside the spinner. */
    loadingLabel?: string
  }

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  loadingLabel = "Loading",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
    >
      {loading ? (
        <>
          <Loader2Icon aria-hidden className="animate-spin" />
          <span className="sr-only">{loadingLabel}</span>
        </>
      ) : null}
      {children}
    </BaseButton>
  )
}
