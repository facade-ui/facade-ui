# Installation

Facade UI is not an npm package. You add each component with the shadcn CLI, which copies its source files into your project. There is no package to upgrade later, and you can edit every file.

## 1. Set up a project with shadcn

You need a project where you have run `shadcn init`. To create a new one:

```bash
npx create-next-app@latest my-site --typescript --tailwind --app
cd my-site
npx shadcn@latest init
```

Facade UI needs React 19 and Tailwind v4, and is built for server components. You do not need any configuration beyond what `shadcn init` sets up.

## 2. Add the tokens

The tokens file defines the `--facade-*` CSS variables that sections use for heading sizes, spacing and animation. Every section needs it, so do not skip this step.

```bash
npx shadcn@latest add @facade/tokens
```

Then import the file in your stylesheet, after Tailwind:

```css
@import "tailwindcss";
@import "../styles/facade-tokens.css";
```

The file also sets the shadcn colour names to Facade's default colours. If your project already has a theme, keep your own colour variables below the import. They override the defaults, and the sections use your colours.

## 3. Add a component

You install each component by name. The CLI also installs what the component needs: npm packages and other Facade UI components.

```bash
npx shadcn@latest add @facade/section-header
```

If the `@facade` namespace is not configured, install by URL instead: `npx shadcn@latest add https://facadeui.dev/r/section-header.json`.

## 4. Use your own image and link components

The components do not import anything from `next/*`, so they work with any React framework. Some sections render images or links from your data. Pass the image and link components you want them to use:

```tsx
import Image from "next/image"
import Link from "next/link"

import { LogoCloud } from "@/components/sections/logo-cloud"

export default function Page() {
  return <LogoCloud items={logos} image={Image} link={Link} />
}
```

Pass the component itself, such as `Image`, not a function that renders it. A server component can then hand it to the section.

## Optional: add animation

Animation is optional. To use it:

1. Install the motion primitives: `npx shadcn@latest add @facade/motion-primitives`
2. Add the provider once, near the root of your app.
3. Use the `-motion` version of a section.

The static version of each section looks the same with JavaScript turned off.

```tsx
import { FacadeMotionProvider } from "@/components/motion/facade-motion-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FacadeMotionProvider>{children}</FacadeMotionProvider>
      </body>
    </html>
  )
}
```
