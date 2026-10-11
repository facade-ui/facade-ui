"use client"

/** `"use client"` only for the submit handler that keeps the demo on the page. */

import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import { Textarea } from "@registry/ui/textarea"

export function Demo() {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      noValidate
      className="flex max-w-md flex-col gap-5"
    >
      <Input label="Name" name="name" autoComplete="name" required />
      <Textarea
        label="Message"
        name="message"
        rows={5}
        description="Tell us what you are building."
        required
      />
      <Textarea
        label="Notes"
        name="notes"
        rows={2}
        resize="none"
        defaultValue="Please call after 3pm, or before 9am on weekdays, or any time at weekends."
        error="Keep notes under 60 characters."
      />
      <Button type="submit" className="self-start">
        Send
      </Button>
    </form>
  )
}
