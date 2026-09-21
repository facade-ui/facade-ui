import { Stat } from "@registry/ui/stat"

export function Demo() {
  return (
    <dl className="grid gap-8 sm:grid-cols-3">
      <Stat value="99.98%" label="Uptime" description="Rolling 90 days" />
      <Stat value="1.2K" srValue="1200" label="Teams onboarded" />
      <Stat value="18ms" label="Median response" />
    </dl>
  )
}
