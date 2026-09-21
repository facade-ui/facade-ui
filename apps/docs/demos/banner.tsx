import { Banner } from "@registry/sections/banner"

export function Demo() {
  return (
    <div className="-m-6 flex flex-col gap-6 sm:-m-10">
      <Banner
        label="Announcement"
        dismissible
        action={{ label: "Read the notes", href: "#release" }}
      >
        Facade UI v0.1 is out.
      </Banner>
      <Banner variant="muted" label="Maintenance notice" dismissible>
        Scheduled maintenance on Sunday, 02:00–04:00 UTC.
      </Banner>
      <p className="text-muted-foreground px-6 pb-6 text-sm sm:px-10">
        Dismissal is session-only here. Pass <code>storageKey</code> to remember it.
      </p>
    </div>
  )
}
