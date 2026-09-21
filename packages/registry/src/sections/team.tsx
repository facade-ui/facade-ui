/**
 * Team — the people behind the product.
 *
 * a11y: portraits carry the person's name as `alt` only when there is no visible
 * name beside them, which there almost always is — so the default is `alt=""`.
 * Announcing "photo of Rosa Iqbal, Rosa Iqbal, Head of Design" is worse than
 * announcing the name once.
 *
 * Social links are per person and each gets an accessible name that includes
 * whose profile it is: four "Twitter" links in a row are indistinguishable when
 * read out of context, which is exactly how a screen-reader user meets them in
 * a links list.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/heading, @registry/ui/section,
 * @registry/ui/section-header.
 */

import type { ElementType } from "react"

import type {
  HeadingLevel,
  IconComponent,
  ImageComponent,
  LinkComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface TeamSocial {
  /** Network name, e.g. "GitHub". Combined with the person's name for the label. */
  label: string
  href: string
  icon: IconComponent
}

export interface TeamMember {
  name: string
  role: string
  bio?: string
  photoSrc?: string
  social?: TeamSocial[]
}

export interface TeamProps extends SectionBaseProps, ListSlotProps {
  items: TeamMember[]
  title?: string
  eyebrow?: string
  description?: string
  image?: ImageComponent
  link?: LinkComponent
  columns?: 2 | 3 | 4
  /** `square` crops to a card; `circle` is the classic avatar row. */
  shape?: "square" | "circle"
  itemHeadingLevel?: HeadingLevel
  align?: "start" | "center"
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
} as const

export function Team({
  items,
  title,
  eyebrow,
  description,
  image,
  link,
  columns = 3,
  shape = "square",
  itemHeadingLevel,
  align = "center",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: TeamProps) {
  const List = (listAs ?? "ul") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const Image = (image ?? "img") as ElementType
  const Link = (link ?? "a") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const itemLevel = itemHeadingLevel ?? (Math.min(headingLevel + 1, 6) as HeadingLevel)
  const circle = shape === "circle"

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container className="flex flex-col gap-14">
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

        <List className={cn("grid gap-8", columnClasses[columns])}>
          {items.map((member) => (
            <Item
              key={member.name}
              className={cn("flex flex-col gap-4", circle && "items-center text-center")}
            >
              {member.photoSrc ? (
                <Image
                  src={member.photoSrc}
                  // The name is text directly below; repeating it here is noise.
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "bg-muted w-full object-cover",
                    circle ? "size-28 rounded-full" : "aspect-[4/5] rounded-xl",
                  )}
                />
              ) : null}

              <div className={cn("flex flex-col gap-1", circle && "items-center")}>
                <Heading level={itemLevel} className="text-foreground font-semibold">
                  {member.name}
                </Heading>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>

              {member.bio ? (
                <p className="text-muted-foreground text-pretty text-sm">{member.bio}</p>
              ) : null}

              {member.social?.length ? (
                <ul className={cn("flex items-center gap-1", circle && "justify-center")}>
                  {member.social.map((social) => {
                    const Icon = social.icon as ElementType
                    return (
                      <li key={social.href}>
                        <Link
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
                        >
                          <Icon aria-hidden focusable="false" className="size-5" />
                          {/* Whose profile, not just which network. */}
                          <span className="sr-only">
                            {member.name} on {social.label} (opens in a new tab)
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  )
}
