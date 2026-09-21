"use client"

/**
 * Newsletter — an email capture band.
 *
 * Presentation and wiring only: it owns no network call. Pass `onSubmit` and
 * drive `status` from whatever your form action or mutation returns, so the
 * section works the same behind a server action, a fetch, or a third-party
 * embed.
 *
 * a11y: a form that reports its own outcome, which is the part most newsletter
 * sections skip.
 *
 *  - The result is announced through a polite live region that is present from
 *    the first render. A live region inserted *at the same time* as its message
 *    is frequently missed by screen readers, so the container is always there
 *    and only its content changes.
 *  - While submitting, the button is `aria-busy` and keeps its label — the
 *    accessible name never changes under the user.
 *  - An error is passed to the field as well as the live region, so it is both
 *    announced and programmatically tied to the input that caused it.
 *  - The label is real. `hideLabel` moves it out of the layout, not out of the
 *    accessibility tree, which is what a placeholder-only field does.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/button, @registry/ui/container, @registry/ui/input,
 * @registry/ui/section, @registry/ui/section-header.
 */

import type { FormEvent, ReactNode } from "react"

import type { SectionBaseProps } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Button } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { Input } from "@registry/ui/input"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export type NewsletterStatus = "idle" | "submitting" | "success" | "error"

export interface NewsletterProps extends SectionBaseProps {
  title: string
  description?: string
  eyebrow?: string
  /** Called with the submitted address. Keep the network call outside. */
  onSubmit?: (email: string) => void
  /** Drives the button, the live region, and the field's error state. */
  status?: NewsletterStatus
  /** Announced on success. */
  successMessage?: ReactNode
  /** Announced on failure and attached to the field. */
  errorMessage?: string
  label?: string
  hideLabel?: boolean
  placeholder?: string
  submitLabel?: string
  /** Small print under the form — consent, frequency, unsubscribe. */
  note?: ReactNode
  /** `inline` puts the button inside the field; `stacked` puts it below. */
  layout?: "inline" | "stacked"
  variant?: "plain" | "muted" | "card"
  align?: "start" | "center"
}

const surfaces = {
  plain: "",
  muted: "bg-muted rounded-2xl px-6 py-12 sm:px-12",
  card: "bg-card text-card-foreground rounded-2xl border px-6 py-12 sm:px-12",
} as const

export function Newsletter({
  title,
  description,
  eyebrow,
  onSubmit,
  status = "idle",
  successMessage = "Thanks — check your inbox to confirm.",
  errorMessage,
  label = "Email address",
  hideLabel = true,
  placeholder = "you@example.com",
  submitLabel = "Subscribe",
  note,
  layout = "inline",
  variant = "muted",
  align = "center",
  headingLevel = 2,
  as = "section",
  spacing = "md",
  className,
  id,
}: NewsletterProps) {
  const titleId = id ? `${id}-title` : slugId(title)
  const submitting = status === "submitting"
  const centered = align === "center"

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    onSubmit(String(data.get("email") ?? ""))
  }

  return (
    <Section as={as} spacing={spacing} labelledBy={titleId} id={id} className={className}>
      <Container size="md">
        <div
          className={cn(
            "flex flex-col gap-8",
            surfaces[variant],
            centered && "items-center",
          )}
        >
          <SectionHeader
            align={align}
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingLevel={headingLevel}
            titleId={titleId}
          />

          <form
            onSubmit={handleSubmit}
            noValidate
            className={cn(
              "flex w-full max-w-md flex-col gap-3",
              centered && "items-center",
            )}
          >
            <div
              className={cn(
                "flex w-full gap-3",
                layout === "stacked" && "flex-col",
                layout === "inline" && "flex-col sm:flex-row",
              )}
            >
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                label={label}
                hideLabel={hideLabel}
                placeholder={placeholder}
                error={status === "error" ? errorMessage : undefined}
                disabled={submitting}
              />
              <Button
                type="submit"
                loading={submitting}
                loadingLabel="Subscribing"
                className={cn(
                  "h-11 shrink-0",
                  layout === "stacked" ? "w-full" : "w-full sm:w-auto",
                )}
              >
                {submitLabel}
              </Button>
            </div>

            {note ? (
              <p
                className={cn(
                  "text-muted-foreground text-pretty text-sm",
                  centered && "text-center",
                )}
              >
                {note}
              </p>
            ) : null}

            {/*
              Always rendered, never conditionally mounted: a live region that
              appears at the same moment as its message is routinely missed.
            */}
            <p
              aria-live="polite"
              className={cn(
                "text-pretty text-sm",
                status === "error" ? "text-destructive" : "text-muted-foreground",
                centered && "text-center",
              )}
            >
              {status === "success" ? successMessage : null}
              {status === "error" ? errorMessage : null}
            </p>
          </form>
        </div>
      </Container>
    </Section>
  )
}
