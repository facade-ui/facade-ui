/**
 * FeatureIcon — the tinted container an icon sits in on feature cards.
 *
 * Takes an icon *component* rather than a rendered node so it can apply sizing
 * and `aria-hidden` itself. That removes the most common a11y slip in marketing
 * UI: a decorative icon that is announced because the author forgot to hide it.
 *
 * a11y: the icon is always `aria-hidden` — its meaning is carried by the heading
 * beside it. If an icon is the *only* content conveying something, it does not
 * belong here; use a labelled element instead.
 *
 * Dependencies: class-variance-authority, react, @/lib/types, @/lib/utils.
 */

import { cva, type VariantProps } from "class-variance-authority"
import type { ElementType } from "react"

import type { IconComponent } from "@registry/lib/types"
import { cn } from "@registry/lib/utils"

export const featureIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      variant: {
        soft: "bg-accent text-accent-foreground",
        solid: "bg-primary text-primary-foreground",
        outline: "border-border bg-background text-foreground border",
        plain: "text-primary",
      },
      size: {
        sm: "size-9 [&_svg]:size-4",
        md: "size-11 [&_svg]:size-5",
        lg: "size-14 [&_svg]:size-6",
      },
      shape: {
        rounded: "rounded-lg",
        circle: "rounded-full",
        square: "rounded-none",
      },
    },
    compoundVariants: [{ variant: "plain", class: "size-auto bg-transparent" }],
    defaultVariants: { variant: "soft", size: "md", shape: "rounded" },
  },
)

export interface FeatureIconProps extends VariantProps<typeof featureIconVariants> {
  icon: IconComponent
  className?: string
}

export function FeatureIcon({ icon, variant, size, shape, className }: FeatureIconProps) {
  const Icon = icon as ElementType

  return (
    <span className={cn(featureIconVariants({ variant, size, shape }), className)}>
      <Icon aria-hidden focusable="false" />
    </span>
  )
}
