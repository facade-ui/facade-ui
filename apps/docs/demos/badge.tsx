import { SparklesIcon } from "lucide-react"

import { Badge } from "@registry/ui/badge"

export function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="primary">
        <SparklesIcon aria-hidden />
        New
      </Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="destructive" srLabel="Status: ">
        Deprecated
      </Badge>
      <Badge size="sm">Small</Badge>
    </div>
  )
}
