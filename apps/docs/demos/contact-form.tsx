"use client"

/** `"use client"` for the state that fakes a server round trip. */

import { useState } from "react"

import { ContactForm, type ContactFormStatus } from "@registry/sections/contact-form"

const FIELDS = [
  {
    name: "name",
    label: "Name",
    autoComplete: "name",
    required: true,
    width: "half" as const,
  },
  {
    name: "email",
    label: "Work email",
    type: "email" as const,
    autoComplete: "email",
    required: true,
    width: "half" as const,
  },
  {
    name: "topic",
    label: "What is it about?",
    type: "select" as const,
    placeholder: "Choose a topic",
    options: [
      { value: "sales", label: "Pricing and plans" },
      { value: "support", label: "Help with an install" },
      { value: "press", label: "Press" },
    ],
  },
  {
    name: "message",
    label: "Message",
    type: "textarea" as const,
    rows: 5,
    required: true,
  },
]

export function Demo() {
  const [status, setStatus] = useState<ContactFormStatus>("idle")
  const [errors, setErrors] = useState<Record<string, string>>()

  return (
    <ContactForm
      eyebrow="Contact"
      title="Talk to the team"
      description="Questions about a plan, an install or anything else. A person reads every message."
      fields={FIELDS}
      status={status}
      errors={errors}
      note="We only use your details to reply."
      details={[
        { label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
        { label: "Phone", value: "+31 20 123 4567", href: "tel:+31201234567" },
        { label: "Reply time", value: "Within two working days" },
      ]}
      onSubmit={(values) => {
        setStatus("submitting")
        // Stands in for a server: rejects example.com addresses.
        setTimeout(() => {
          if (values.email?.endsWith("@example.com")) {
            setErrors({ email: "Use your work address, not example.com." })
            setStatus("error")
          } else {
            setErrors(undefined)
            setStatus("success")
          }
        }, 600)
      }}
    />
  )
}
