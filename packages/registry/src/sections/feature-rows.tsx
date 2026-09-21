/**
 * FeatureRows — alternating rows of media and copy.
 *
 * The long-form counterpart to `FeatureGrid`: each row gets a headline, a
 * paragraph, an optional bullet list and its own media, with the media side
 * alternating down the page.
 *
 * a11y: the alternation is `lg:order-*` only. In DOM order the copy always comes
 * first, so reading order and tab order match on every row regardless of which
 * side the media lands on visually — flipping the DOM instead would make a
 * screen reader meet an unlabelled image before the heading that explains it.
 *
 * Each row's bullets are a real `<ul>`, and the check icons are decorative.
 *
 * Dependencies: lucide-react, react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/button, @registry/ui/container, @registry/ui/eyebrow,
 * @registry/ui/heading, @registry/ui/section, @registry/ui/section-header.
 */

import { CheckIcon } from "lucide-react"
import type { ElementType, ReactNode } from "react"

import type {
  HeadingLevel,
  LinkComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { buttonVariants } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { Eyebrow } from "@registry/ui/eyebrow"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface FeatureRowItem {
  title: string
  description: string
  /** The row's media. Pass `<Image />`, a video, a diagram. */
  media?: ReactNode
  eyebrow?: string
  bullets?: string[]
  /** Optional inline link under the copy. */
  href?: string
  linkLabel?: string
  external?: boolean
  /** Stable key when two rows share a title. */
  id?: string
}

export interface FeatureRowsProps extends SectionBaseProps, ListSlotProps {
  items: FeatureRowItem[]
  title?: string
  eyebrow?: string
  description?: string
  link?: LinkComponent
  itemHeadingLevel?: HeadingLevel
  /** Which side the first row's media sits on at `lg` and up. */
  mediaFirst?: boolean
  align?: "start" | "center"
}

export function FeatureRows({
  items,
  title,
  eyebrow,
  description,
  link,
  itemHeadingLevel,
  mediaFirst = false,
  align = "start",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: FeatureRowsProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const Link = (link ?? "a") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const itemLevel = itemHeadingLevel ?? (Math.min(headingLevel + 1, 6) as HeadingLevel)

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container className="flex flex-col gap-16">
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

        <List className="flex flex-col gap-16 sm:gap-24">
          {items.map((item, index) => {
            // Visual alternation only; the DOM order below never changes.
            const mediaOnLeft = index % 2 === (mediaFirst ? 0 : 1)

            return (
              <Item
                key={item.id ?? item.title}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <div className={cn("flex flex-col gap-5", mediaOnLeft && "lg:order-2")}>
                  {item.eyebrow ? <Eyebrow tone="primary">{item.eyebrow}</Eyebrow> : null}

                  <Heading
                    level={itemLevel}
                    className="text-display-sm text-balance font-semibold"
                  >
                    {item.title}
                  </Heading>

                  <p className="text-muted-foreground text-pretty text-lg">
                    {item.description}
                  </p>

                  {item.bullets?.length ? (
                    <ul className="flex flex-col gap-2.5">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm">
                          <CheckIcon
                            aria-hidden
                            focusable="false"
                            className="text-primary mt-0.5 size-4 shrink-0"
                          />
                          <span className="text-pretty">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {item.href ? (
                    <Link
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-fit",
                      )}
                    >
                      {item.linkLabel ?? `More about ${item.title}`}
                      {item.external ? (
                        <span className="sr-only"> (opens in a new tab)</span>
                      ) : null}
                    </Link>
                  ) : null}
                </div>

                {item.media ? (
                  <div className={cn("min-w-0", mediaOnLeft && "lg:order-1")}>
                    {item.media}
                  </div>
                ) : null}
              </Item>
            )
          })}
        </List>
      </Container>
    </Section>
  )
}
