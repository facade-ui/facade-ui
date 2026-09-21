/**
 * Button — Facade styling over Base UI's `Button`.
 *
 * Not marked `"use client"`, and deliberately so: Base UI's own modules carry the
 * directive, so this wrapper stays a server component and a hero rendered on the
 * server ships no extra client boundary of its own.
 *
 * `render` is Base UI's composition escape hatch (the equivalent of Radix's
 * `asChild`). Use it to turn the button into a *non-button* control that should
 * still behave like one, and pass `nativeButton={false}` so Base UI supplies the
 * `role="button"`, `tabindex` and Space/Enter handling that element lacks:
 *
 *   <Button render={<span />} nativeButton={false}>Toggle</Button>
 *
 * Do not use `render` for links. Two things go wrong, both verified against
 * Base UI 1.0.0-rc.0 in `button.test.tsx`:
 *
 *   - with `nativeButton` left at its default, the anchor is emitted with
 *     `type="button"` and, when disabled, a `disabled` attribute — neither is
 *     valid on `<a>`, and `disabled` does not actually prevent navigation;
 *   - with `nativeButton={false}`, the anchor gets `role="button"`, so a control
 *     that navigates is announced as one that acts.
 *
 * Style the link directly instead — that is what `buttonVariants` is for, and
 * what `CtaGroup` does:
 *
 *   <a href="/pricing" className={buttonVariants({ variant: "outline" })}>…</a>
 *
 * a11y: every size is at least 44x44 CSS px (WCAG 2.5.5), the focus ring is
 * always visible, and `loading` sets `aria-busy` while keeping the label in the
 * accessible name so it never changes mid-interaction.
 *
 * Dependencies: @base-ui-components/react, class-variance-authority,
 * lucide-react, react, @/lib/utils.
 */

import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
} from "@base-ui-components/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@registry/lib/utils"

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md font-medium",
    "duration-facade-fast ease-facade-out transition-[color,background-color,border-color,box-shadow,opacity]",
    "focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground border",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground hover:text-foreground/80 underline underline-offset-4",
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
