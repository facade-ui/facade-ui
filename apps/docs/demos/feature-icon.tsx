import { BoltIcon, LockIcon, RocketIcon, WaypointsIcon } from "lucide-react"

import { FeatureIcon } from "@registry/ui/feature-icon"

export function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <FeatureIcon icon={BoltIcon} />
      <FeatureIcon icon={LockIcon} variant="solid" shape="circle" />
      <FeatureIcon icon={RocketIcon} variant="outline" size="lg" />
      <FeatureIcon icon={WaypointsIcon} variant="plain" />
    </div>
  )
}
