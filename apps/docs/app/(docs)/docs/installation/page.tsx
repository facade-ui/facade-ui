import type { Metadata } from "next"

import { CodeBlock } from "@/components/code-block"
import { InstallCommand } from "@/components/install-command"
import { Prose } from "@/components/prose"
import { installCommands } from "@/lib/registry-shared"

export const metadata: Metadata = {
  title: "Installation",
  description: "Add Facade UI to a Next.js project in four steps.",
}

export default function InstallationPage() {
  return (
    <Prose>
      <h1 className="text-display-sm font-semibold">Installation</h1>
      <p>
        Facade UI is a shadcn-compatible registry, not an npm component library. The CLI
        copies source into your project: there is no runtime package to upgrade, and every
        file is yours to edit.
      </p>

      <h2>1. Start from a shadcn project</h2>
      <p>
        Any project that has run <code>shadcn init</code> will do. If you are starting
        fresh:
      </p>
      <CodeBlock
        lang="bash"
        filename="terminal"
        code={`npx create-next-app@latest my-site --typescript --tailwind --app
cd my-site
npx shadcn@latest init`}
      />
      <p>
        Facade UI targets React 19, Tailwind v4 and server components. It needs no
        configuration beyond what <code>shadcn init</code> already writes.
      </p>

      <h2>2. Add the tokens</h2>
      <p>
        The token layer defines the <code>--facade-*</code> custom properties that
        sections rely on for display type, section rhythm and motion. It also defines the
        shadcn colour names, so in a project that already has a theme you can skip this
        step and Facade will inherit yours.
      </p>
      <InstallCommand commands={installCommands("tokens")} />
      <p>Then import it from your stylesheet, after Tailwind:</p>
      <CodeBlock
        lang="css"
        filename="app/globals.css"
        code={`@import "tailwindcss";
@import "../styles/facade-tokens.css";`}
      />

      <h2>3. Add a component</h2>
      <p>
        Every item is installed by URL. Dependencies — both npm packages and other
        registry items — are resolved for you.
      </p>
      <InstallCommand commands={installCommands("section-header")} />

      <h2>4. Make images and links yours</h2>
      <p>
        Nothing in the registry imports from <code>next/*</code>, so sections work in any
        React setup. Where a section renders images or links from data, pass the component
        you want it to use:
      </p>
      <CodeBlock
        filename="app/page.tsx"
        code={`import Image from "next/image"
import Link from "next/link"

import { LogoCloud } from "@/components/sections/logo-cloud"

export default function Page() {
  return <LogoCloud items={logos} image={Image} link={Link} />
}`}
      />
      <p>
        They are component types, not render callbacks, which is what lets them cross the
        server component boundary unchanged.
      </p>

      <h2>Optional: motion</h2>
      <p>
        Motion is opt-in. Install the primitives, mount the provider once near your root,
        and use the <code>-motion</code> variant of any section. The static variant
        renders identically with JavaScript disabled.
      </p>
      <InstallCommand commands={installCommands("motion-primitives")} />
      <CodeBlock
        filename="app/layout.tsx"
        code={`import { FacadeMotionProvider } from "@/components/motion/facade-motion-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FacadeMotionProvider>{children}</FacadeMotionProvider>
      </body>
    </html>
  )
}`}
      />
    </Prose>
  )
}
