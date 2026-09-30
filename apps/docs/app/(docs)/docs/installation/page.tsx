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
        Facade UI is not an npm package. You add each component with the shadcn CLI, which
        copies its source files into your project. There is no package to upgrade later,
        and you can edit every file.
      </p>

      <h2>1. Set up a project with shadcn</h2>
      <p>
        You need a project where you have run <code>shadcn init</code>. To create a new
        one:
      </p>
      <CodeBlock
        lang="bash"
        filename="terminal"
        code={`npx create-next-app@latest my-site --typescript --tailwind --app
cd my-site
npx shadcn@latest init`}
      />
      <p>
        Facade UI needs React 19 and Tailwind v4, and is built for server components. You
        do not need any configuration beyond what <code>shadcn init</code> sets up.
      </p>

      <h2>2. Add the tokens</h2>
      <p>
        The tokens file defines the <code>--facade-*</code> CSS variables that sections
        use for heading sizes, spacing and animation. It also defines the shadcn colour
        names. If your project already has a theme, you can skip this step and the
        sections will use your colours.
      </p>
      <InstallCommand commands={installCommands("tokens")} />
      <p>Then import the file in your stylesheet, after Tailwind:</p>
      <CodeBlock
        lang="css"
        filename="app/globals.css"
        code={`@import "tailwindcss";
@import "../styles/facade-tokens.css";`}
      />

      <h2>3. Add a component</h2>
      <p>
        You install each component by its URL. The CLI also installs what the component
        needs: npm packages and other Facade UI components.
      </p>
      <InstallCommand commands={installCommands("section-header")} />

      <h2>4. Use your own image and link components</h2>
      <p>
        The components do not import anything from <code>next/*</code>, so they work with
        any React framework. Some sections render images or links from your data. Pass the
        image and link components you want them to use:
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
        Pass the component itself, such as <code>Image</code>, not a function that renders
        it. A server component can then hand it to the section.
      </p>

      <h2>Optional: add animation</h2>
      <p>Animation is optional. To use it:</p>
      <ol>
        <li>Install the motion primitives with the command below.</li>
        <li>Add the provider once, near the root of your app.</li>
        <li>
          Use the <code>-motion</code> version of a section.
        </li>
      </ol>
      <p>The static version of each section looks the same with JavaScript turned off.</p>
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
