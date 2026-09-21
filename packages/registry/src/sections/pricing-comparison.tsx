/**
 * PricingComparison — the full feature matrix, plan by plan.
 *
 * a11y: this is the section where a `<div>` grid would do the most damage, so it
 * is a real `<table>` and the details matter.
 *
 *  - Plan names are `<th scope="col">`, feature names are `<th scope="row">`.
 *    That pairing is what lets a screen reader announce "Team, Shared theme
 *    tokens, included" when the user lands on a cell — without it, the reader
 *    gets "included" with no idea of what or whose.
 *  - Group rows use `<th scope="colgroup">` spanning the table, so a feature
 *    inherits its group heading.
 *  - A tick or a cross is never the only content of a cell: each carries
 *    visually hidden "Included" / "Not included" text, and the icon is
 *    `aria-hidden`. Colour and shape alone fail 1.4.1.
 *  - The table has a `<caption>`. It can be visually hidden, but it is always
 *    there, because a table without one is an unnamed grid.
 *  - The scroll container is focusable, so a wide matrix can be scrolled without
 *    a mouse.
 *
 * Dependencies: lucide-react, react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/badge, @registry/ui/button, @registry/ui/container,
 * @registry/ui/section, @registry/ui/section-header.
 */

import { CheckIcon, MinusIcon } from "lucide-react"
import type { ElementType, ReactNode } from "react"

import type { CtaItem, LinkComponent, SectionBaseProps } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Badge } from "@registry/ui/badge"
import { buttonVariants } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface ComparisonPlan {
  name: string
  price?: string
  srPrice?: string
  period?: string
  cta?: CtaItem
  featured?: boolean
  featuredLabel?: string
}

/** `true`/`false` render a tick or a dash; a string renders as text. */
export type ComparisonValue = boolean | string

export interface ComparisonFeature {
  label: string
  /** One entry per plan, in the same order as `plans`. */
  values: ComparisonValue[]
  note?: string
}

export interface ComparisonGroup {
  title: string
  features: ComparisonFeature[]
}

export interface PricingComparisonProps extends SectionBaseProps {
  plans: ComparisonPlan[]
  groups: ComparisonGroup[]
  title?: string
  eyebrow?: string
  description?: string
  link?: LinkComponent
  /** Table caption. Always present; hidden visually by default. */
  caption?: string
  showCaption?: boolean
  note?: ReactNode
  align?: "start" | "center"
}

function Cell({ value }: { value: ComparisonValue | undefined }) {
  if (typeof value === "string") {
    return <span className="text-foreground text-sm">{value}</span>
  }
  if (value) {
    return (
      <>
        <CheckIcon
          aria-hidden
          focusable="false"
          className="text-primary mx-auto size-5"
        />
        {/* Never rely on the glyph alone. */}
        <span className="sr-only">Included</span>
      </>
    )
  }
  return (
    <>
      <MinusIcon
        aria-hidden
        focusable="false"
        className="text-muted-foreground mx-auto size-5"
      />
      <span className="sr-only">Not included</span>
    </>
  )
}

export function PricingComparison({
  plans,
  groups,
  title,
  eyebrow,
  description,
  link,
  caption,
  showCaption = false,
  note,
  align = "center",
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: PricingComparisonProps) {
  const Link = (link ?? "a") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const tableCaption =
    caption ?? (title ? `${title}: plan comparison` : "Plan comparison")

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container className="flex flex-col gap-12">
        {title ? (
          <SectionHeader
            align={align}
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingLevel={headingLevel}
            titleId={titleId}
          />
        ) : null}

        <div
          tabIndex={0}
          role="region"
          aria-label={tableCaption}
          className="focus-visible:ring-ring overflow-x-auto rounded-xl border focus-visible:outline-none focus-visible:ring-2"
        >
          <table className="w-full border-collapse text-left">
            <caption
              className={cn(
                "px-4 py-3 text-sm",
                showCaption ? "text-muted-foreground" : "sr-only",
              )}
            >
              {tableCaption}
            </caption>

            <thead>
              <tr className="border-b">
                <th
                  scope="col"
                  className="bg-background sticky left-0 px-4 py-4 align-bottom"
                >
                  <span className="sr-only">Feature</span>
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className={cn(
                      "min-w-40 px-4 py-4 text-center align-bottom",
                      plan.featured && "bg-accent/40",
                    )}
                  >
                    <span className="flex flex-col items-center gap-2">
                      {plan.featured ? (
                        <Badge variant="primary" size="sm">
                          {plan.featuredLabel ?? "Most popular"}
                        </Badge>
                      ) : null}
                      <span className="text-foreground text-base font-semibold">
                        {plan.name}
                      </span>
                      {plan.price ? (
                        <span className="text-muted-foreground text-sm">
                          <span aria-hidden>
                            {plan.price}
                            {plan.period}
                          </span>
                          <span className="sr-only">
                            {plan.srPrice ?? plan.price}
                            {plan.period ? ` ${plan.period.replace(/^\//, "per ")}` : ""}
                          </span>
                        </span>
                      ) : null}
                      {plan.cta ? (
                        <Link
                          href={plan.cta.href}
                          aria-label={
                            plan.cta["aria-label"] ?? `${plan.cta.label} — ${plan.name}`
                          }
                          className={buttonVariants({
                            variant:
                              plan.cta.variant ?? (plan.featured ? "primary" : "outline"),
                            size: "sm",
                          })}
                        >
                          {plan.cta.label}
                        </Link>
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {groups.map((group) => (
              <tbody key={group.title} className="border-b last:border-b-0">
                <tr className="bg-muted/50">
                  {/* colgroup scope: every feature below inherits this heading. */}
                  <th
                    scope="colgroup"
                    colSpan={plans.length + 1}
                    className="text-foreground px-4 py-2.5 text-sm font-semibold"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.features.map((feature) => (
                  <tr key={feature.label} className="border-t">
                    <th
                      scope="row"
                      className="bg-background sticky left-0 px-4 py-3 text-sm font-normal"
                    >
                      <span className="text-foreground">{feature.label}</span>
                      {feature.note ? (
                        <span className="text-muted-foreground mt-0.5 block text-pretty text-xs">
                          {feature.note}
                        </span>
                      ) : null}
                    </th>
                    {plans.map((plan, index) => (
                      <td
                        key={plan.name}
                        className={cn(
                          "px-4 py-3 text-center",
                          plan.featured && "bg-accent/40",
                        )}
                      >
                        <Cell value={feature.values[index]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        {note ? (
          <p
            className={cn(
              "text-muted-foreground text-pretty text-sm",
              align === "center" && "text-center",
            )}
          >
            {note}
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
