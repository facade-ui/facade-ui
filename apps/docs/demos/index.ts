/**
 * The demo registry: item name -> the component the preview iframe renders.
 *
 * A static map rather than a dynamic import, so a demo that stops compiling
 * fails the build instead of 404-ing at runtime. The docs page reads the demo's
 * own file for its "usage" tab, which means visitors see the code that produced
 * the preview above it rather than a paraphrase of it.
 *
 * Generated shape, hand-maintained content: adding a demo file and an entry here
 * is all it takes for a component to get a preview, an accessibility scan and a
 * visual snapshot, since the e2e suites derive their item list from this map.
 */

import type { ComponentType } from "react"

import { Demo as BadgeDemo } from "./badge"
import { Demo as BentoGridDemo } from "./bento-grid"
import { Demo as BentoGridMotionDemo } from "./bento-grid-motion"
import { Demo as ButtonDemo } from "./button"
import { Demo as ContainerDemo } from "./container"
import { Demo as CtaBandDemo } from "./cta-band"
import { Demo as CtaBandMotionDemo } from "./cta-band-motion"
import { Demo as CtaGroupDemo } from "./cta-group"
import { Demo as EyebrowDemo } from "./eyebrow"
import { Demo as FaqAccordionDemo } from "./faq-accordion"
import { Demo as FaqAccordionMotionDemo } from "./faq-accordion-motion"
import { Demo as FeatureGridDemo } from "./feature-grid"
import { Demo as FeatureGridMotionDemo } from "./feature-grid-motion"
import { Demo as FeatureIconDemo } from "./feature-icon"
import { Demo as FeatureRowsDemo } from "./feature-rows"
import { Demo as FeatureRowsMotionDemo } from "./feature-rows-motion"
import { Demo as FooterDemo } from "./footer"
import { Demo as HeadingDemo } from "./heading"
import { Demo as HeroCenteredDemo } from "./hero-centered"
import { Demo as HeroCenteredMotionDemo } from "./hero-centered-motion"
import { Demo as HeroSplitDemo } from "./hero-split"
import { Demo as HeroSplitMotionDemo } from "./hero-split-motion"
import { Demo as HeroWithMediaDemo } from "./hero-with-media"
import { Demo as HeroWithMediaMotionDemo } from "./hero-with-media-motion"
import { Demo as LogoCloudDemo } from "./logo-cloud"
import { Demo as LogoCloudMotionDemo } from "./logo-cloud-motion"
import { Demo as LogoMarkDemo } from "./logo-mark"
import { Demo as MotionPrimitivesDemo } from "./motion-primitives"
import { Demo as NavTopDemo } from "./nav-top"
import { Demo as PricingTierDemo } from "./pricing-tier"
import { Demo as SectionDemo } from "./section"
import { Demo as SectionHeaderDemo } from "./section-header"
import { Demo as StatDemo } from "./stat"
import { Demo as TestimonialDemo } from "./testimonial"
import { Demo as UspListDemo } from "./usp-list"
import { Demo as UspListMotionDemo } from "./usp-list-motion"

export const demos: Record<string, ComponentType> = {
  badge: BadgeDemo,
  "bento-grid": BentoGridDemo,
  "bento-grid-motion": BentoGridMotionDemo,
  button: ButtonDemo,
  container: ContainerDemo,
  "cta-band": CtaBandDemo,
  "cta-band-motion": CtaBandMotionDemo,
  "cta-group": CtaGroupDemo,
  eyebrow: EyebrowDemo,
  "faq-accordion": FaqAccordionDemo,
  "faq-accordion-motion": FaqAccordionMotionDemo,
  "feature-grid": FeatureGridDemo,
  "feature-grid-motion": FeatureGridMotionDemo,
  "feature-icon": FeatureIconDemo,
  "feature-rows": FeatureRowsDemo,
  "feature-rows-motion": FeatureRowsMotionDemo,
  footer: FooterDemo,
  heading: HeadingDemo,
  "hero-centered": HeroCenteredDemo,
  "hero-centered-motion": HeroCenteredMotionDemo,
  "hero-split": HeroSplitDemo,
  "hero-split-motion": HeroSplitMotionDemo,
  "hero-with-media": HeroWithMediaDemo,
  "hero-with-media-motion": HeroWithMediaMotionDemo,
  "logo-cloud": LogoCloudDemo,
  "logo-cloud-motion": LogoCloudMotionDemo,
  "logo-mark": LogoMarkDemo,
  "motion-primitives": MotionPrimitivesDemo,
  "nav-top": NavTopDemo,
  "pricing-tier": PricingTierDemo,
  section: SectionDemo,
  "section-header": SectionHeaderDemo,
  stat: StatDemo,
  testimonial: TestimonialDemo,
  "usp-list": UspListDemo,
  "usp-list-motion": UspListMotionDemo,
}

export const hasDemo = (name: string): boolean => name in demos

export const demoSourcePath = (name: string): string => `demos/${name}.tsx`

/** Preview widths that need extra vertical room before the frame reports back. */
export const DEMO_INITIAL_HEIGHT: Record<string, number> = {
  "bento-grid": 900,
  "bento-grid-motion": 900,
  button: 320,
  "cta-band": 700,
  "cta-band-motion": 700,
  "faq-accordion": 620,
  "faq-accordion-motion": 620,
  "feature-grid": 800,
  "feature-grid-motion": 800,
  "feature-rows": 1200,
  "feature-rows-motion": 1200,
  footer: 520,
  "hero-centered": 560,
  "hero-centered-motion": 560,
  "hero-split": 620,
  "hero-split-motion": 620,
  "hero-with-media": 520,
  "hero-with-media-motion": 520,
  "motion-primitives": 460,
  "nav-top": 220,
  "pricing-tier": 620,
  testimonial: 420,
  "usp-list": 520,
  "usp-list-motion": 520,
}
