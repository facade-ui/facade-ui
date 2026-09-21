/**
 * The demo registry: item name -> the component the preview iframe renders.
 *
 * A static map rather than a dynamic import, so a demo that stops compiling
 * fails the build instead of 404-ing at runtime. The docs page reads the demo's
 * own file for its "usage" tab, which means visitors see the code that produced
 * the preview above it rather than a paraphrase of it.
 *
 * Adding a demo file and an entry here is all it takes for a component to get a
 * preview, an accessibility scan in six theme scopes, and visual snapshots at
 * three breakpoints — the e2e suites derive their item list from this map.
 */

import type { ComponentType } from "react"

import { Demo as AgencyDemo } from "./agency"
import { Demo as BadgeDemo } from "./badge"
import { Demo as BannerDemo } from "./banner"
import { Demo as BentoGridDemo } from "./bento-grid"
import { Demo as BentoGridMotionDemo } from "./bento-grid-motion"
import { Demo as ButtonDemo } from "./button"
import { Demo as CardListDemo } from "./card-list"
import { Demo as CardListMotionDemo } from "./card-list-motion"
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
import { Demo as FeatureTabsDemo } from "./feature-tabs"
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
import { Demo as NavSideDemo } from "./nav-side"
import { Demo as NavTopDemo } from "./nav-top"
import { Demo as NewsletterDemo } from "./newsletter"
import { Demo as PricingComparisonDemo } from "./pricing-comparison"
import { Demo as PricingTierDemo } from "./pricing-tier"
import { Demo as PricingTiersDemo } from "./pricing-tiers"
import { Demo as PricingTiersMotionDemo } from "./pricing-tiers-motion"
import { Demo as ProductLaunchDemo } from "./product-launch"
import { Demo as SaasLandingDemo } from "./saas-landing"
import { Demo as SectionDemo } from "./section"
import { Demo as SectionHeaderDemo } from "./section-header"
import { Demo as StatDemo } from "./stat"
import { Demo as StatsDemo } from "./stats"
import { Demo as StatsMotionDemo } from "./stats-motion"
import { Demo as StepsDemo } from "./steps"
import { Demo as StepsMotionDemo } from "./steps-motion"
import { Demo as TeamDemo } from "./team"
import { Demo as TeamMotionDemo } from "./team-motion"
import { Demo as TestimonialDemo } from "./testimonial"
import { Demo as TestimonialSingleDemo } from "./testimonial-single"
import { Demo as TestimonialsGridDemo } from "./testimonials-grid"
import { Demo as TestimonialsGridMotionDemo } from "./testimonials-grid-motion"
import { Demo as UspListDemo } from "./usp-list"
import { Demo as UspListMotionDemo } from "./usp-list-motion"

export const demos: Record<string, ComponentType> = {
  agency: AgencyDemo,
  badge: BadgeDemo,
  banner: BannerDemo,
  "bento-grid": BentoGridDemo,
  "bento-grid-motion": BentoGridMotionDemo,
  button: ButtonDemo,
  "card-list": CardListDemo,
  "card-list-motion": CardListMotionDemo,
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
  "feature-tabs": FeatureTabsDemo,
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
  "nav-side": NavSideDemo,
  "nav-top": NavTopDemo,
  newsletter: NewsletterDemo,
  "pricing-comparison": PricingComparisonDemo,
  "pricing-tier": PricingTierDemo,
  "pricing-tiers": PricingTiersDemo,
  "pricing-tiers-motion": PricingTiersMotionDemo,
  "product-launch": ProductLaunchDemo,
  "saas-landing": SaasLandingDemo,
  section: SectionDemo,
  "section-header": SectionHeaderDemo,
  stat: StatDemo,
  stats: StatsDemo,
  "stats-motion": StatsMotionDemo,
  steps: StepsDemo,
  "steps-motion": StepsMotionDemo,
  team: TeamDemo,
  "team-motion": TeamMotionDemo,
  testimonial: TestimonialDemo,
  "testimonial-single": TestimonialSingleDemo,
  "testimonials-grid": TestimonialsGridDemo,
  "testimonials-grid-motion": TestimonialsGridMotionDemo,
  "usp-list": UspListDemo,
  "usp-list-motion": UspListMotionDemo,
}

export const hasDemo = (name: string): boolean => name in demos

export const demoSourcePath = (name: string): string => `demos/${name}.tsx`

/** Preview heights used before the frame reports its own. */
export const DEMO_INITIAL_HEIGHT: Record<string, number> = {
  banner: 300,
  "bento-grid": 900,
  "bento-grid-motion": 900,
  button: 320,
  "card-list": 720,
  "card-list-motion": 720,
  "cta-band": 700,
  "cta-band-motion": 700,
  "faq-accordion": 620,
  "faq-accordion-motion": 620,
  "feature-grid": 800,
  "feature-grid-motion": 800,
  "feature-rows": 1200,
  "feature-rows-motion": 1200,
  "feature-tabs": 720,
  footer: 520,
  "hero-centered": 560,
  "hero-centered-motion": 560,
  "hero-split": 620,
  "hero-split-motion": 620,
  "hero-with-media": 520,
  "hero-with-media-motion": 520,
  "motion-primitives": 460,
  "nav-side": 520,
  "nav-top": 220,
  newsletter: 520,
  "pricing-comparison": 820,
  "pricing-tier": 620,
  "product-launch": 3600,
  "pricing-tiers": 820,
  "pricing-tiers-motion": 820,
  stats: 420,
  "stats-motion": 420,
  steps: 460,
  "steps-motion": 460,
  team: 620,
  "team-motion": 620,
  testimonial: 420,
  "testimonial-single": 420,
  "testimonials-grid": 900,
  "testimonials-grid-motion": 900,
  "usp-list": 520,
  "usp-list-motion": 520,
}
