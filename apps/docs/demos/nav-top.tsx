import { NavTop } from "@registry/sections/nav-top"

import { NAV_ITEMS } from "./content"

export function Demo() {
  return (
    <div className="-m-6 sm:-m-10">
      <NavTop
        brand="Facade UI"
        homeHref="#home"
        items={NAV_ITEMS}
        currentPath="#pricing"
        actions={[
          { label: "Sign in", href: "#sign-in", variant: "ghost" },
          { label: "Start free", href: "#start" },
        ]}
        sticky={false}
      />
      <div className="text-muted-foreground p-6 text-sm sm:p-10">
        Resize the preview to 375 to see the drawer. Escape closes it and focus returns to
        the trigger.
      </div>
    </div>
  )
}
