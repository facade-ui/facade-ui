/**
 * LogoCloud — a wall of customer or partner logos.
 *
 * Content-driven: pass `items` and, if you use `next/image` or `next/link`, pass
 * those components. The section itself imports no framework.
 *
 * a11y: the logos are a `<ul>`, because that is what they are — a list of
 * companies. Each `LogoMark` exposes its company name as text (visually hidden
 * unless `showNames`), so the wall reads as "Northwind, Contoso, …" instead of a
 * run of unlabelled images. When `title` is omitted the band renders as a `div`
 * rather than adding an unnamed region to the landmark list.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/logo-mark, @registry/ui/section,
 * @registry/ui/section-header.
 */

import type { ElementType } from "react"

import type {
  ImageComponent,
  LinkComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { LogoMark, type LogoItem } from "@registry/ui/logo-mark"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface LogoCloudProps extends SectionBaseProps, ListSlotProps {
  items: LogoItem[]
  /** Optional heading. Omit for a bare strip under a hero. */
  title?: string
  eyebrow?: string
  description?: string
  image?: ImageComponent
  link?: LinkComponent
  /** Rendered logo height. */
  size?: "sm" | "md" | "lg"
  /** Show each company name as text beside its mark. */
  showNames?: boolean
  /** `row` wraps on one line; `grid` gives every logo equal width. */
  layout?: "row" | "grid"
  /** Desaturate and fade logos until hover or focus. */
  muted?: boolean
}

export function LogoCloud({
  items,
  title,
  eyebrow,
  description,
  image,
  link,
  size = "md",
  showNames = false,
  layout = "row",
  muted = true,
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "sm",
  className,
  id,
}: LogoCloudProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container className="flex flex-col gap-10">
        {title ? (
          <SectionHeader
            align="center"
            size="sm"
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingLevel={headingLevel}
            titleId={titleId}
          />
        ) : null}

        <List
          className={cn(
            layout === "row"
              ? "flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14"
              : "grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-5",
          )}
        >
          {items.map((item) => (
            <Item key={item.name}>
              <LogoMark
                {...item}
                image={image}
                link={link}
                size={size}
                muted={muted}
                showName={showNames}
              />
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  )
}
