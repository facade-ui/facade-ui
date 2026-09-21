/**
 * PricingTier — one plan card: name, price, feature list, and a call to action.
 *
 * a11y: three things worth spelling out.
 *
 * 1. The price is split into a visible form and a spoken form, because "$29/mo"
 *    is read as "dollar twenty nine slash m o". `srPrice` fixes that.
 * 2. Features are a real `<ul>`, and a feature marked `included: false` gets
 *    visually hidden "Not included" text — a struck-through row with a grey
 *    cross conveys nothing without sight.
 * 3. The "Most popular" flag is a `Badge` with text, not a coloured border, and
 *    it is referenced from the tier's accessible name via `aria-describedby`.
 *
 * The card is a `<li>` by default: a pricing table is a list of plans.
 *
 * Dependencies: lucide-react, react, @/lib/types, @/lib/utils, ./badge, ./button,
 * ./heading.
 */

import { CheckIcon, XIcon } from "lucide-react"
import type { ElementType, ReactNode } from "react"

import type { CtaItem, HeadingLevel, LinkComponent } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Badge } from "@registry/ui/badge"
import { buttonVariants } from "@registry/ui/button"
import { Heading } from "@registry/ui/heading"

export interface PricingFeature {
  label: string
  /** Default `true`. `false` renders a struck row with hidden "Not included". */
  included?: boolean
  /** Extra detail shown under the feature. */
  note?: string
}

export interface PricingTierItem {
  name: string
  /** Display form, e.g. `"$29"`. */
  price: string
  /** Spoken form, e.g. `"29 dollars"`. Strongly recommended. */
  srPrice?: string
  /** Billing cadence, e.g. `"/month"`. */
  period?: string
  description?: string
  features: PricingFeature[]
  cta: CtaItem
  /** Marks this tier as the recommended one. */
  featured?: boolean
  /** Text for the featured flag. Defaults to `"Most popular"`. */
  featuredLabel?: string
  /** Small print under the CTA. */
  footnote?: string
}

export interface PricingTierProps extends PricingTierItem {
  link?: LinkComponent
  /** Outline level of the tier name. Defaults to `3` (under a section `<h2>`). */
  headingLevel?: HeadingLevel
  as?: "li" | "div"
  className?: string
  children?: ReactNode
}

export function PricingTier({
  name,
  price,
  srPrice,
  period,
  description,
  features,
  cta,
  featured = false,
  featuredLabel = "Most popular",
  footnote,
  link,
  headingLevel = 3,
  as = "li",
  className,
  children,
}: PricingTierProps) {
  const Link = (link ?? "a") as ElementType
  const Root = as as ElementType
  const flagId = featured ? `${slugId(name, "tier")}-flag` : undefined

  return (
    <Root
      className={cn(
        "bg-card text-card-foreground relative flex h-full flex-col gap-6 rounded-xl border p-6 sm:p-8",
        featured && "border-primary ring-primary shadow-lg ring-1",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <Heading level={headingLevel} className="text-foreground text-lg font-semibold">
            {name}
          </Heading>
          {featured ? (
            <Badge id={flagId} variant="primary" size="sm">
              {featuredLabel}
            </Badge>
          ) : null}
        </div>
        {description ? (
          <p className="text-muted-foreground text-pretty text-sm">{description}</p>
        ) : null}
      </div>

      <p className="flex items-baseline gap-1">
        <span
          aria-hidden
          className="text-foreground text-display-sm font-semibold tracking-tight"
        >
          {price}
        </span>
        {period ? (
          <span aria-hidden className="text-muted-foreground text-sm">
            {period}
          </span>
        ) : null}
        <span className="sr-only">
          {srPrice ?? price}
          {period ? ` ${period.replace(/^\//, "per ")}` : ""}
        </span>
      </p>

      <ul className="flex flex-1 flex-col gap-3">
        {features.map((feature) => {
          const included = feature.included ?? true
          const Icon = included ? CheckIcon : XIcon
          return (
            <li key={feature.label} className="flex items-start gap-3 text-sm">
              <Icon
                aria-hidden
                focusable="false"
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  included ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "flex flex-col gap-0.5",
                  !included && "text-muted-foreground",
                )}
              >
                <span className={cn(!included && "line-through")}>
                  <span className="sr-only">
                    {included ? "Included: " : "Not included: "}
                  </span>
                  {feature.label}
                </span>
                {feature.note ? (
                  <span className="text-muted-foreground text-xs">{feature.note}</span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ul>

      {children}

      <div className="flex flex-col gap-2">
        <Link
          href={cta.href}
          aria-describedby={flagId}
          aria-label={cta["aria-label"] ?? `${cta.label} — ${name}`}
          {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={cn(
            buttonVariants({
              variant: cta.variant ?? (featured ? "primary" : "outline"),
              size: "md",
              fullWidth: true,
            }),
          )}
        >
          {cta.label}
        </Link>
        {footnote ? (
          <p className="text-muted-foreground text-pretty text-center text-xs">
            {footnote}
          </p>
        ) : null}
      </div>
    </Root>
  )
}
