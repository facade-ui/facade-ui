/**
 * ChangelogList — releases in order, each with its version, date and changes.
 *
 * `CardList` covers "a grid of linked posts"; a changelog needs the changes
 * themselves on the page, so readers can scan what moved without a click per
 * release.
 *
 * a11y:
 *
 *  - Each release is an `<article>` named by its own heading, inside an
 *    ordered list, so "release 2 of 12" is announced and heading navigation
 *    jumps release to release.
 *  - The date is a `<time>` with a machine-readable `dateTime`.
 *  - The kind of each change ("Added", "Fixed") is a word in a badge, not a
 *    colour alone. Pass `kindLabels` to translate the words.
 *  - Every release has a stable `id`, `release-v1-2-0` by default, so a
 *    release can be linked to directly.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/badge, @registry/ui/container, @registry/ui/heading,
 * @registry/ui/section, @registry/ui/section-header.
 */

import type { ElementType, ReactNode } from "react"

import type {
  HeadingLevel,
  LinkComponent,
  ListSlotProps,
  SectionBaseProps,
} from "@registry/lib/types"
import { slugId } from "@registry/lib/utils"
import { Badge, type BadgeProps } from "@registry/ui/badge"
import { Container } from "@registry/ui/container"
import { Heading } from "@registry/ui/heading"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export type ChangeKind =
  "added" | "changed" | "fixed" | "removed" | "deprecated" | "security"

export interface ChangelogChange {
  kind: ChangeKind
  description: ReactNode
}

export interface ChangelogEntry {
  /** Shown as a badge and used for the anchor id, e.g. "v1.2.0". */
  version: string
  title: string
  /** ISO 8601, for the `datetime` attribute. */
  dateTime: string
  /** Human label for the date, e.g. "21 September 2026". */
  dateLabel: string
  summary?: ReactNode
  changes: ChangelogChange[]
  /** Links the title, e.g. to the release notes on GitHub. */
  href?: string
  external?: boolean
  /** Anchor id. Defaults to a slug of the version. */
  id?: string
  /** A small tag beside the version, such as "Latest". */
  tag?: string
}

export interface ChangelogListProps extends SectionBaseProps, ListSlotProps {
  items: ChangelogEntry[]
  title?: string
  eyebrow?: string
  description?: string
  link?: LinkComponent
  /** Heading level of each release. Defaults to one below `headingLevel`. */
  itemHeadingLevel?: HeadingLevel
  /** Words for the change kinds, for translation. */
  kindLabels?: Partial<Record<ChangeKind, string>>
  align?: "start" | "center"
}

const KIND_LABELS: Record<ChangeKind, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  removed: "Removed",
  deprecated: "Deprecated",
  security: "Security",
}

const KIND_VARIANTS: Record<ChangeKind, BadgeProps["variant"]> = {
  added: "default",
  changed: "outline",
  fixed: "muted",
  removed: "destructive",
  deprecated: "outline",
  security: "destructive",
}

export function ChangelogList({
  items,
  title,
  eyebrow,
  description,
  link,
  itemHeadingLevel,
  kindLabels,
  align = "start",
  listAs,
  itemAs,
  headingLevel = 2,
  as,
  spacing = "md",
  className,
  id,
}: ChangelogListProps) {
  const List = (listAs ?? "ol") as ElementType
  const Item = (itemAs ?? "li") as ElementType
  const Link = (link ?? "a") as ElementType
  const titleId = title ? (id ? `${id}-title` : slugId(title)) : undefined
  const itemLevel = itemHeadingLevel ?? (Math.min(headingLevel + 1, 6) as HeadingLevel)
  const labels = { ...KIND_LABELS, ...kindLabels }

  return (
    <Section
      as={as ?? (title ? "section" : "div")}
      spacing={spacing}
      labelledBy={titleId}
      id={id}
      className={className}
    >
      <Container size="md" className="flex flex-col gap-12">
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

        <List className="divide-border flex flex-col divide-y">
          {items.map((entry) => {
            const entryId = entry.id ?? slugId(entry.version, "release")
            const entryTitleId = `${entryId}-title`

            return (
              <Item key={entryId}>
                <article
                  id={entryId}
                  aria-labelledby={entryTitleId}
                  className="grid scroll-mt-24 gap-4 py-10 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8"
                >
                  <div className="flex flex-col gap-2 md:sticky md:top-24 md:self-start">
                    <p className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{entry.version}</Badge>
                      {entry.tag ? <Badge size="sm">{entry.tag}</Badge> : null}
                    </p>
                    <time
                      dateTime={entry.dateTime}
                      className="text-muted-foreground text-sm"
                    >
                      {entry.dateLabel}
                    </time>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Heading
                      level={itemLevel}
                      id={entryTitleId}
                      className="text-foreground text-balance text-xl font-semibold tracking-tight"
                    >
                      {entry.href ? (
                        <Link
                          href={entry.href}
                          {...(entry.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="focus-visible:ring-ring rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2"
                        >
                          {entry.title}
                          {entry.external ? (
                            <span className="sr-only"> (opens in a new tab)</span>
                          ) : null}
                        </Link>
                      ) : (
                        entry.title
                      )}
                    </Heading>

                    {entry.summary ? (
                      <p className="text-muted-foreground text-pretty">{entry.summary}</p>
                    ) : null}

                    {entry.changes.length > 0 ? (
                      <ul className="flex flex-col gap-3">
                        {entry.changes.map((change, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Badge
                              variant={KIND_VARIANTS[change.kind]}
                              size="sm"
                              className="mt-0.5 w-24 shrink-0 justify-center"
                            >
                              {labels[change.kind]}
                            </Badge>
                            <span className="text-foreground text-pretty">
                              {change.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              </Item>
            )
          })}
        </List>
      </Container>
    </Section>
  )
}
