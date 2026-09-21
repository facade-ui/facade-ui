"use client"

import { useState } from "react"

import { Newsletter, type NewsletterStatus } from "@registry/sections/newsletter"

export function Demo() {
  const [status, setStatus] = useState<NewsletterStatus>("idle")

  // Stands in for a server action or a fetch. The section owns no network call.
  const submit = (email: string) => {
    if (!email.includes("@")) {
      setStatus("error")
      return
    }
    setStatus("submitting")
    window.setTimeout(() => setStatus("success"), 900)
  }

  return (
    <Newsletter
      eyebrow="Changelog"
      title="One email when something ships"
      description="No drip campaign, no webinar invitations."
      onSubmit={submit}
      status={status}
      errorMessage="Enter a valid email address."
      note="Unsubscribe in one click. We never share your address."
    />
  )
}
