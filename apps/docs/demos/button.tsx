import { ArrowRightIcon } from "lucide-react"

import { Button, buttonVariants } from "@registry/ui/button"

export function Demo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Start building</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Delete</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">
          Large
          <ArrowRightIcon aria-hidden />
        </Button>
        <Button size="icon" aria-label="Continue">
          <ArrowRightIcon aria-hidden />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
        {/* Links are styled with buttonVariants, never through `render`. */}
        <a href="#demo" className={buttonVariants({ variant: "outline" })}>
          A real link
        </a>
      </div>
    </div>
  )
}
