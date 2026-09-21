/**
 * Sample content shared by the section demos.
 *
 * Kept out of the demo files so each one shows the shape of the API rather than
 * eighty lines of placeholder copy — which is what a reader is actually there to
 * see on a component page.
 */

import {
  BoltIcon,
  ChartNoAxesColumnIcon,
  GaugeIcon,
  LayersIcon,
  LockIcon,
  PaletteIcon,
  RocketIcon,
  ShieldCheckIcon,
  WaypointsIcon,
} from "lucide-react"

import type { CtaItem } from "@registry/lib/types"
import type { BentoItem } from "@registry/sections/bento-grid"
import type { FaqItem } from "@registry/sections/faq-accordion"
import type { FeatureItem } from "@registry/sections/feature-grid"
import type { FeatureRowItem } from "@registry/sections/feature-rows"
import type { NavItem } from "@registry/sections/nav-top"
import type { UspItem } from "@registry/sections/usp-list"
import type { LogoItem } from "@registry/ui/logo-mark"

export const ACTIONS: CtaItem[] = [
  { label: "Start building", href: "#start" },
  { label: "Read the docs", href: "#docs" },
]

export const LOGOS: LogoItem[] = [
  { name: "Northwind" },
  { name: "Contoso" },
  { name: "Umbrella" },
  { name: "Globex" },
  { name: "Initech" },
]

export const USPS: UspItem[] = [
  {
    icon: BoltIcon,
    title: "Ships as source",
    description:
      "The CLI copies files into your project. Nothing to upgrade, nothing to fight.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Accessible by default",
    description: "WCAG 2.2 AA, with contrast and axe checks that run on every commit.",
  },
  {
    icon: PaletteIcon,
    title: "Inherits your theme",
    description:
      "shadcn token names, so a section looks like it belongs the moment it lands.",
  },
]

export const FEATURES: FeatureItem[] = [
  {
    icon: LayersIcon,
    title: "Composable sections",
    description: "Typed data plus slots. Pass items and children, not forty props.",
    href: "#composable",
  },
  {
    icon: GaugeIcon,
    title: "Server components first",
    description: "Only the drawer and the motion wrappers are client components.",
    href: "#rsc",
  },
  {
    icon: LockIcon,
    title: "One primitive library",
    description: "Base UI throughout. No Radix, and never both in the same tree.",
    href: "#base-ui",
  },
  {
    icon: WaypointsIcon,
    title: "Framework neutral",
    description:
      "Nothing imports next/*. Hand it next/image and next/link if you want them.",
  },
  {
    icon: RocketIcon,
    title: "Motion, optional",
    description: "Every section is static first. The motion variant wraps it.",
  },
  {
    icon: ChartNoAxesColumnIcon,
    title: "Verified, not asserted",
    description: "Contrast, axe and a real shadcn install all run in CI.",
  },
]

/** Stands in for whatever the consumer passes into a `media` slot. */
const MediaPlaceholder = ({
  label,
  ratio = "aspect-[4/3]",
}: {
  label: string
  ratio?: string
}) => (
  <div
    className={`bg-muted text-muted-foreground flex w-full items-center justify-center rounded-xl border text-sm ${ratio}`}
  >
    {label}
  </div>
)

export const ROWS: FeatureRowItem[] = [
  {
    eyebrow: "Install",
    title: "One command per piece",
    description:
      "Add exactly the section you need. Its dependencies — npm packages and other registry items — come with it.",
    bullets: ["Resolved from the real import graph", "Pinned to tested version ranges"],
    media: <MediaPlaceholder label="Install flow" />,
    href: "#install",
    linkLabel: "See the install guide",
  },
  {
    eyebrow: "Own it",
    title: "The source lands in your repo",
    description:
      "No wrapper package sitting between you and the markup. Change a class, delete a prop, rename the file.",
    bullets: ["Readable, commented source", "Strict TypeScript throughout"],
    media: <MediaPlaceholder label="Your repository" />,
  },
]

export const BENTO: BentoItem[] = [
  {
    icon: LayersIcon,
    span: "lg",
    title: "Sections, not snippets",
    description:
      "Content-driven blocks that take typed data and slots, so a page is composition rather than copy-paste.",
    media: <MediaPlaceholder label="Section catalogue" ratio="aspect-[16/7]" />,
  },
  {
    icon: ShieldCheckIcon,
    span: "sm",
    title: "WCAG 2.2 AA",
    description: "Checked in CI, not claimed in a README.",
  },
  {
    icon: PaletteIcon,
    span: "sm",
    title: "Three presets",
    description: "Neutral, warm and vivid, light and dark.",
  },
  {
    icon: GaugeIcon,
    span: "sm",
    title: "RSC first",
    description: "Client boundaries only where state lives.",
  },
  {
    icon: BoltIcon,
    span: "lg",
    title: "Motion that knows when to stop",
    description:
      "Opacity and transform only, and nothing at all under prefers-reduced-motion.",
  },
]

export const FAQS: FaqItem[] = [
  {
    question: "Is Facade UI free?",
    answer: "Yes. MIT licensed, with no paid tier and nothing held back.",
  },
  {
    question: "Do I need Next.js?",
    answer:
      "No. Nothing in the registry imports from next/*. Sections take component types for images and links, so next/image and next/link are pluggable rather than assumed.",
  },
  {
    question: "Can I use it in an existing shadcn project?",
    answer:
      "That is the design. Sections only reference shadcn's own token names, so they inherit your theme the moment they land.",
  },
  {
    question: "What about Radix?",
    answer:
      "Facade UI uses Base UI for every interactive primitive. Mixing two primitive libraries in one tree doubles the bundle and the bugs, so the registry never does.",
  },
]

export const NAV_ITEMS: NavItem[] = [
  { label: "Product", href: "#product" },
  {
    label: "Solutions",
    children: [
      {
        label: "For startups",
        href: "#startups",
        description: "Ship a landing page this afternoon.",
      },
      {
        label: "For agencies",
        href: "#agencies",
        description: "One theme, many client sites.",
      },
      {
        label: "For platforms",
        href: "#platforms",
        description: "Docs, marketing and app in one system.",
      },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
]

export const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Sections", href: "#sections" },
      { label: "Atoms", href: "#atoms" },
      { label: "Templates", href: "#templates" },
      { label: "Changelog", href: "#changelog", badge: undefined },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Installation", href: "#installation" },
      { label: "Theming", href: "#theming" },
      { label: "Accessibility", href: "#accessibility" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "Discussions", href: "https://github.com", external: true },
    ],
  },
]

export { MediaPlaceholder }
