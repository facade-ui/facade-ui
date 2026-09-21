/**
 * Sample content shared by the section demos.
 *
 * Kept out of the demo files so each one shows the shape of the API rather than
 * eighty lines of placeholder copy — which is what a reader is actually there to
 * see on a component page.
 */

import {
  BlocksIcon,
  BoltIcon,
  ChartNoAxesColumnIcon,
  GaugeIcon,
  LayersIcon,
  LockIcon,
  PaletteIcon,
  RocketIcon,
  ShieldCheckIcon,
  GlobeIcon,
  AtSignIcon,
  TerminalIcon,
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

// ------------------------------------------------------------------ phase 2

export const STATS = [
  { value: "99.98%", label: "Uptime", description: "Rolling 90 days" },
  { value: "1.2K", srValue: "1200", label: "Teams onboarded" },
  { value: "18ms", label: "Median response" },
  { value: "216", label: "Accessibility checks", description: "Per commit" },
]

export const QUOTES = [
  {
    id: "rosa",
    rating: 5 as const,
    quote:
      "We replaced three hand-rolled landing pages in an afternoon. The sections dropped straight into our existing theme.",
    author: { name: "Rosa Iqbal", title: "Head of Design, Northwind" },
  },
  {
    id: "tomas",
    quote:
      "The accessibility work is already done, which is the part we always ran out of time for.",
    author: { name: "Tomas Lindqvist", title: "Engineering lead, Contoso" },
  },
  {
    id: "amara",
    rating: 5 as const,
    quote:
      "Reading the source was the sell. It is the code I would have written on a good day, and now it is in our repo.",
    author: { name: "Amara Okonkwo", title: "Staff engineer, Globex" },
  },
  {
    id: "jonas",
    quote: "One primitive library, one token layer. Our bundle went down, not up.",
    author: { name: "Jonas Weber", title: "Frontend lead, Initech" },
  },
]

export const PLANS = [
  {
    name: "Starter",
    price: "$0",
    srPrice: "Free",
    period: "/month",
    description: "Everything you need to ship a landing page.",
    features: [
      { label: "All sections and atoms" },
      { label: "Three theme presets" },
      { label: "Priority support", included: false },
    ],
    cta: { label: "Start free", href: "#start" },
  },
  {
    featured: true,
    name: "Team",
    price: "$29",
    srPrice: "29 dollars",
    period: "/month",
    description: "For teams shipping more than one site.",
    features: [
      { label: "Everything in Starter" },
      { label: "Shared theme tokens", note: "Sync across projects" },
      { label: "Priority support" },
    ],
    cta: { label: "Start a trial", href: "#trial" },
    footnote: "No card required for 14 days.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    srPrice: "Custom pricing",
    description: "Procurement, SSO and an accessibility statement.",
    features: [
      { label: "Everything in Team" },
      { label: "SSO and SCIM" },
      { label: "VPAT on request" },
    ],
    cta: { label: "Talk to us", href: "#contact" },
  },
]

export const COMPARISON_PLANS = [
  {
    name: "Starter",
    price: "$0",
    srPrice: "Free",
    period: "/mo",
    cta: { label: "Start", href: "#start" },
  },
  {
    name: "Team",
    price: "$29",
    srPrice: "29 dollars",
    period: "/mo",
    featured: true,
    cta: { label: "Try it", href: "#trial" },
  },
  {
    name: "Enterprise",
    price: "Custom",
    srPrice: "Custom pricing",
    cta: { label: "Contact", href: "#contact" },
  },
]

export const COMPARISON_GROUPS = [
  {
    title: "Components",
    features: [
      { label: "Sections and atoms", values: [true, true, true] },
      { label: "Templates", values: [false, true, true] },
      { label: "Theme presets", values: ["3", "3 + custom", "Unlimited"] },
    ],
  },
  {
    title: "Collaboration",
    features: [
      {
        label: "Shared tokens",
        values: [false, true, true],
        note: "Sync across projects",
      },
      { label: "Seats", values: ["1", "10", "Unlimited"] },
      { label: "SSO and SCIM", values: [false, false, true] },
    ],
  },
  {
    title: "Support",
    features: [
      { label: "Community", values: [true, true, true] },
      { label: "Priority email", values: [false, true, true] },
      { label: "VPAT on request", values: [false, false, true] },
    ],
  },
]

export const POSTS = [
  {
    id: "v01",
    title: "Facade UI v0.1",
    href: "#v01",
    description:
      "Twelve core sections, thirteen atoms, and a contrast check that runs on every commit.",
    tag: "Release",
    dateTime: "2026-09-21",
    dateLabel: "21 September 2026",
  },
  {
    id: "rsc",
    title: "Why sections are server components",
    href: "#rsc",
    description:
      "And the one place that breaks down: icon components cannot cross the boundary as props.",
    tag: "Engineering",
    dateTime: "2026-09-14",
    dateLabel: "14 September 2026",
  },
  {
    id: "contrast",
    title: "Checking contrast from the tokens themselves",
    href: "#contrast",
    description:
      "An accessibility statement nobody verifies is just a wish. Here is the script that verifies ours.",
    tag: "Accessibility",
    dateTime: "2026-09-02",
    dateLabel: "2 September 2026",
  },
]

export const STEPS = [
  {
    icon: TerminalIcon,
    title: "Run the command",
    description: "One shadcn add per piece. Dependencies come with it.",
  },
  {
    icon: BlocksIcon,
    title: "Compose the page",
    description: "Pass typed content and slots. No prop soup.",
  },
  {
    icon: PaletteIcon,
    title: "Apply your theme",
    description: "Override the shadcn token names and everything follows.",
  },
]

export const TABS = [
  {
    label: "Install",
    title: "One command per piece",
    description:
      "Add exactly the section you need. Its dependencies are resolved from the real import graph.",
    icon: TerminalIcon,
    bullets: ["npm packages and registry items alike", "Pinned to tested version ranges"],
    media: <MediaPlaceholder label="Install flow" ratio="aspect-[16/10]" />,
  },
  {
    label: "Compose",
    title: "Sections take content, not configuration",
    description:
      "Typed data plus slots, so a page reads as composition rather than a wall of props.",
    icon: BlocksIcon,
    bullets: ["Slots for media, actions and children", "Heading level always explicit"],
    media: <MediaPlaceholder label="Composed page" ratio="aspect-[16/10]" />,
  },
  {
    label: "Theme",
    title: "One block of tokens re-themes everything",
    description:
      "Sections reference only shadcn's token names, so your existing theme already fits.",
    icon: PaletteIcon,
    bullets: ["Three presets, light and dark", "Contrast verified in CI"],
    media: <MediaPlaceholder label="Theme tokens" ratio="aspect-[16/10]" />,
  },
]

export const TEAM = [
  {
    name: "Rosa Iqbal",
    role: "Design systems",
    bio: "Spent a decade making component libraries that people actually use.",
    social: [
      { label: "Mastodon", href: "https://example.com", icon: AtSignIcon },
      { label: "her website", href: "https://example.com", icon: GlobeIcon },
    ],
  },
  {
    name: "Tomas Lindqvist",
    role: "Accessibility",
    bio: "Believes an accessibility statement nobody verifies is just a wish.",
    social: [{ label: "Mastodon", href: "https://example.com", icon: AtSignIcon }],
  },
  {
    name: "Amara Okonkwo",
    role: "Engineering",
    bio: "Writes the source you will be reading after you run the install command.",
    social: [{ label: "their website", href: "https://example.com", icon: GlobeIcon }],
  },
]
