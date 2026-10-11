"use client"

/**
 * ContactForm — a contact form built from `Input`, `Select` and `Textarea`,
 * with optional contact details beside it.
 *
 * Presentation and wiring only, like `Newsletter`: it owns no network call.
 * `onSubmit` gets the values; drive `status` and `errors` from whatever your
 * form action or mutation returns.
 *
 * a11y:
 *
 *  - Base UI's `Form` checks required fields and email format on submit, shows
 *    the browser's message under each field and focuses the first problem.
 *  - Server errors passed in `errors` are shown under their fields, marked
 *    invalid, and focus moves to the first one, so nobody has to hunt for it.
 *    Editing a field clears its error, so the form can be sent again.
 *  - The outcome is announced through a polite live region that exists from
 *    the first render. While sending, the button is `aria-busy` and keeps its
 *    label.
 *  - Contact details are a `<dl>`, so each value is read with its label.
 *
 * Dependencies: @base-ui-components/react, react, @registry/lib/types,
 * @registry/lib/utils, @registry/ui/*.
 */

import { Form } from "@base-ui-components/react/form"
import {
  useEffect,
  useRef,
  type ElementType,
  type FormEvent,
  type ReactNode,
} from "react"

import type { LinkComponent, SectionBaseProps } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Button } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { Input } from "@registry/ui/input"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"
import { Select, type SelectOption } from "@registry/ui/select"
import { Textarea } from "@registry/ui/textarea"

export type ContactFormStatus = "idle" | "submitting" | "success" | "error"

export interface ContactField {
  /** The key in the submitted values and in `errors`. */
  name: string
  label: string
  /** Defaults to `text`. */
  type?: "text" | "email" | "tel" | "select" | "textarea"
  required?: boolean
  /** The browser's autofill hint, such as `name`, `email` or `organization`. */
  autoComplete?: string
  placeholder?: string
  description?: string
  /** The choices, for `type: "select"`. */
  options?: SelectOption[]
  /** Visible lines, for `type: "textarea"`. */
  rows?: number
  /** `half` puts two fields side by side from `sm` up. */
  width?: "full" | "half"
}

export interface ContactDetail {
  label: string
  value: ReactNode
  /** Makes the value a link, such as `mailto:` or `tel:`. */
  href?: string
}

export interface ContactFormProps extends SectionBaseProps {
  title: string
  eyebrow?: string
  description?: string
  /** The fields, in order. Defaults to name, email, company and message. */
  fields?: ContactField[]
  /** Called with the values once the browser's checks pass. */
  onSubmit?: (values: Record<string, string>) => void
  /** Controls the button, the live region and the error messages. */
  status?: ContactFormStatus
  /** Field errors from your server, keyed by field `name`. */
  errors?: Record<string, string>
  /** Announced on success. */
  successMessage?: ReactNode
  /** Announced on failure. */
  errorMessage?: ReactNode
  submitLabel?: string
  /** Small print under the button, such as how the data is used. */
  note?: ReactNode
  /** Ways to reach you, shown beside the form. */
  details?: ContactDetail[]
  link?: LinkComponent
  /** `card` puts the form on a bordered surface; `muted` on a tinted one. */
  variant?: "plain" | "muted" | "card"
}

const DEFAULT_FIELDS: ContactField[] = [
  { name: "name", label: "Name", autoComplete: "name", required: true, width: "half" },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    required: true,
    width: "half",
  },
  { name: "company", label: "Company", autoComplete: "organization" },
  { name: "message", label: "Message", type: "textarea", rows: 5, required: true },
]

const surfaces = {
  plain: "",
  muted: "bg-muted rounded-2xl p-6 sm:p-8",
  card: "bg-card text-card-foreground rounded-2xl border p-6 sm:p-8",
} as const

function FieldFor({ field, disabled }: { field: ContactField; disabled: boolean }) {
  const shared = {
    label: field.label,
    name: field.name,
    required: field.required,
    description: field.description,
    disabled,
  }

  if (field.type === "select") {
    return (
      <Select {...shared} items={field.options ?? []} placeholder={field.placeholder} />
    )
  }
  if (field.type === "textarea") {
    return <Textarea {...shared} rows={field.rows} placeholder={field.placeholder} />
  }
  return (
    <Input
      {...shared}
      type={field.type ?? "text"}
      autoComplete={field.autoComplete}
      placeholder={field.placeholder}
    />
  )
}

export function ContactForm({
  title,
  eyebrow,
  description,
  fields = DEFAULT_FIELDS,
  onSubmit,
  status = "idle",
  errors,
  successMessage = "Thanks — we will reply within two working days.",
  errorMessage = "That did not send. Check the form and try again.",
  submitLabel = "Send message",
  note,
  details,
  link,
  variant = "card",
  headingLevel = 2,
  as = "section",
  spacing = "md",
  className,
  id,
}: ContactFormProps) {
  const titleId = id ? `${id}-title` : slugId(title)
  const formRef = useRef<HTMLFormElement>(null)
  const submitting = status === "submitting"
  const Link = (link ?? "a") as ElementType

  // Move focus to the first field the server rejected, once per new `errors`.
  const firstError = errors ? fields.find((field) => errors[field.name])?.name : undefined
  useEffect(() => {
    if (!firstError || !formRef.current) return
    const control = formRef.current.elements.namedItem(firstError)
    if (control instanceof HTMLElement) control.focus()
  }, [errors, firstError])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    const values: Record<string, string> = {}
    for (const field of fields) values[field.name] = String(data.get(field.name) ?? "")
    onSubmit(values)
  }

  return (
    <Section as={as} spacing={spacing} labelledBy={titleId} id={id} className={className}>
      <Container
        size={details?.length ? "lg" : "md"}
        className={cn(
          "grid gap-12",
          details?.length && "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16",
        )}
      >
        <div className="flex flex-col gap-8">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingLevel={headingLevel}
            titleId={titleId}
          />

          {details?.length ? (
            <dl className="flex flex-col gap-5">
              {details.map((detail) => (
                <div key={detail.label} className="flex flex-col gap-1">
                  <dt className="text-muted-foreground text-sm">{detail.label}</dt>
                  <dd className="text-foreground font-medium">
                    {detail.href ? (
                      <Link
                        href={detail.href}
                        className="focus-visible:ring-ring rounded-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2"
                      >
                        {detail.value}
                      </Link>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {/* Form shows each error under the field with that name, and clears it
            once the field is edited, so a corrected form can be sent again. */}
        <Form
          ref={formRef}
          errors={errors}
          onSubmit={handleSubmit}
          aria-labelledby={titleId}
          className={cn("flex flex-col gap-6", surfaces[variant])}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={cn(field.width !== "half" && "sm:col-span-2")}
              >
                <FieldFor field={field} disabled={submitting} />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              loading={submitting}
              loadingLabel="Sending"
              className="self-start"
            >
              {submitLabel}
            </Button>
            {note ? (
              <p className="text-muted-foreground text-pretty text-sm">{note}</p>
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
              )}
            >
              {status === "success" ? successMessage : null}
              {status === "error" ? errorMessage : null}
            </p>
          </div>
        </Form>
      </Container>
    </Section>
  )
}
