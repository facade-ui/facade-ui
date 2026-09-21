"use client"

/**
 * TestimonialsGridMotion — the testimonial wall with a staggered entrance.
 *
 * Quotes arrive one after another as the wall scrolls in.
 *
 * A genuine wrapper: it renders the static `TestimonialsGrid` and only swaps the list
 * slots, so no markup, styling or accessibility behaviour is duplicated. *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/testimonials-grid.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import {
  TestimonialsGrid,
  type TestimonialsGridProps,
} from "@registry/sections/testimonials-grid"

export type TestimonialsGridMotionProps = Omit<TestimonialsGridProps, "listAs" | "itemAs">

export function TestimonialsGridMotion(props: TestimonialsGridMotionProps) {
  return <TestimonialsGrid {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
