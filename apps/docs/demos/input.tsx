import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"

export function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Input
        label="Work email"
        type="email"
        autoComplete="email"
        description="We send the receipt here."
        required
      />
      <Input
        label="Email address"
        hideLabel
        type="email"
        placeholder="you@example.com"
        trailing={
          <Button size="sm" className="h-9">
            Subscribe
          </Button>
        }
      />
      <Input
        label="Company"
        defaultValue="Northwind"
        error="That company already has an account."
      />
    </div>
  )
}
