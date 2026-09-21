"use client"

/**
 * FeatureTabs — features behind a tab strip, built on Base UI Tabs.
 *
 * a11y: Base UI supplies the roving tabindex, arrow-key movement, Home/End, and
 * the `aria-controls`/`aria-labelledby` pairing between each tab and its panel.
 * What this file decides:
 *
 *  - Tabs are *not* activated on focus. Automatic activation means arrowing
 *    through the strip swaps the panel under the user on every keypress, which
 *    is disorienting and, with real content, expensive. `activateOnFocus` is
 *    off, so a tab is selected with Enter or Space.
 *  - Each panel is focusable, because a panel holding more than a line of text
 *    is a region a keyboard user needs to be able to reach and scroll.
 *  - The strip scrolls horizontally on narrow screens rather than wrapping.
 *    A wrapped tab strip breaks the one-row mental model the arrow keys imply.
 *  - Panel headings sit a level below the section's own.
 *
 * Dependencies: @base-ui-components/react, react, @registry/lib/types,
 * @registry/lib/utils, @registry/ui/container, @registry/ui/heading,
 * @registry/ui/section, @registry/ui/section-header.
 */

import { Tabs } from "@base-ui-components/react/tabs"
import type { ElementType, ReactNode } from "react"

import type { HeadingLevel, IconComponent, SectionBaseProps } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface FeatureTabItem {
  /** Short label for the tab itself. */
  label: string
  /** Panel heading. Defaults to `label`. */
  title?: string
  description: string
  icon?: IconComponent
  /** Panel media — a screenshot, a diagram, a video. */
  media?: ReactNode
  bullets?: string[]
  /** Stable value. Defaults to a slug of the label. */
  value?: string
}

export interface FeatureTabsProps extends SectionBaseProps {
  items: FeatureTabItem[]
  title?: string
  eyebrow?: string
  description?: string
  /** Which tab starts selected. Defaults to the first. */
  defaultValue?: string
  itemHeadingLevel?: HeadingLevel
  align?: "start" | "center"
}

const valueOf = (item: FeatureTabItem): string => item.value ?? slugId(item.label, "tab")

export function FeatureTabs({
  items,
  title,
  eyebrow,
  description,
  defaultValue,
  itemHeadingLevel,
  align = "center",
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: FeatureTabsProps) {
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const itemLevel = itemHeadingLevel ?? (Math.min(headingLevel + 1, 6) as HeadingLevel)
  const first = items[0]

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

        <Tabs.Root
          defaultValue={defaultValue ?? (first ? valueOf(first) : undefined)}
          className="flex flex-col gap-10"
        >
          <Tabs.List
            // Selection on Enter/Space, not on arrow-key focus. This is Base
            // UI's default; it is set explicitly because it is a decision, and
            // the opposite is what most tab strips do.
            activateOnFocus={false}
            className={cn(
              "border-border -mx-gutter px-gutter relative flex gap-1 overflow-x-auto border-b",
              align === "center" && "sm:justify-center",
            )}
          >
            {items.map((item) => {
              const Icon = item.icon as ElementType | undefined
              return (
                <Tabs.Tab
                  key={valueOf(item)}
                  value={valueOf(item)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground data-[selected]:text-foreground",
                    "duration-facade-fast ease-facade-out flex min-h-12 shrink-0 cursor-pointer items-center gap-2",
                    "whitespace-nowrap rounded-t-md px-4 text-sm font-medium transition-colors",
                    "focus-visible:ring-ring outline-none focus-visible:ring-2",
                  )}
                >
                  {Icon ? (
                    <Icon aria-hidden focusable="false" className="size-4" />
                  ) : null}
                  {item.label}
                </Tabs.Tab>
              )
            })}
            <Tabs.Indicator className="bg-primary duration-facade-base ease-facade-out absolute bottom-0 left-0 h-0.5 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] transition-[translate,width]" />
          </Tabs.List>

          {items.map((item) => (
            <Tabs.Panel
              key={valueOf(item)}
              value={valueOf(item)}
              // A panel with real content is a region a keyboard user must reach.
              tabIndex={0}
              className="focus-visible:ring-ring rounded-lg outline-none focus-visible:ring-2"
            >
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="flex flex-col gap-4">
                  <Heading
                    level={itemLevel}
                    className="text-display-sm text-balance font-semibold"
                  >
                    {item.title ?? item.label}
                  </Heading>
                  <p className="text-muted-foreground text-pretty text-lg">
                    {item.description}
                  </p>
                  {item.bullets?.length ? (
                    <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-5 text-sm">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="text-pretty">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {item.media ? <div className="min-w-0">{item.media}</div> : null}
              </div>
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </Container>
    </Section>
  )
}
