/**
 * Shapes produced by `scripts/extract-props.ts` and consumed by the docs site.
 *
 * Kept in their own module so the docs app can import the types without pulling
 * in the extractor, which writes files the moment it is evaluated.
 */

export interface PropDoc {
  name: string
  type: string
  required: boolean
  description?: string
  defaultValue?: string
}

export interface InterfaceDoc {
  name: string
  description?: string
  extends: string[]
  props: PropDoc[]
}

export interface FileDoc {
  path: string
  interfaces: InterfaceDoc[]
}
