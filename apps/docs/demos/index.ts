/**
 * The demo registry: item name -> the component the preview iframe renders.
 *
 * A static map rather than a dynamic import, so a demo that stops compiling
 * fails the build instead of 404-ing at runtime. `demoSourcePath` lets the docs
 * page read the demo's own file for the "usage" tab — visitors see the code that
 * produced the preview above it, not a paraphrase of it.
 */

import type { ComponentType } from "react"

import { Demo as BadgeDemo } from "./badge"
import { Demo as ButtonDemo } from "./button"
import { Demo as ContainerDemo } from "./container"
import { Demo as CtaGroupDemo } from "./cta-group"
import { Demo as EyebrowDemo } from "./eyebrow"
import { Demo as FeatureIconDemo } from "./feature-icon"
import { Demo as HeadingDemo } from "./heading"
import { Demo as LogoMarkDemo } from "./logo-mark"
import { Demo as MotionPrimitivesDemo } from "./motion-primitives"
import { Demo as PricingTierDemo } from "./pricing-tier"
import { Demo as SectionDemo } from "./section"
import { Demo as SectionHeaderDemo } from "./section-header"
import { Demo as StatDemo } from "./stat"
import { Demo as TestimonialDemo } from "./testimonial"

export const demos: Record<string, ComponentType> = {
  badge: BadgeDemo,
  button: ButtonDemo,
  container: ContainerDemo,
  "cta-group": CtaGroupDemo,
  eyebrow: EyebrowDemo,
  "feature-icon": FeatureIconDemo,
  heading: HeadingDemo,
  "logo-mark": LogoMarkDemo,
  "motion-primitives": MotionPrimitivesDemo,
  "pricing-tier": PricingTierDemo,
  section: SectionDemo,
  "section-header": SectionHeaderDemo,
  stat: StatDemo,
  testimonial: TestimonialDemo,
}

export const hasDemo = (name: string): boolean => name in demos

export const demoSourcePath = (name: string): string => `demos/${name}.tsx`

/** Preview widths that need extra vertical room before the frame reports back. */
export const DEMO_INITIAL_HEIGHT: Record<string, number> = {
  "pricing-tier": 620,
  testimonial: 420,
  "motion-primitives": 460,
  button: 320,
}
