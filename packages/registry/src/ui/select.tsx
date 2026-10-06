/**
 * Select — a drop-down list built on Base UI's Select inside a Field, so the
 * label, description and error are wired to the control the same way `Input`
 * wires them.
 *
 * a11y notes worth keeping:
 *
 *  - The trigger is a `combobox` button named by the label. Base UI handles the
 *    listbox roles, arrow keys, typeahead, Escape and returning focus.
 *  - `Field.Root invalid` marks the trigger `aria-invalid` and turns the border
 *    red for an error passed in from outside, such as one from a server.
 *  - "required" is spelled out in the label, as in `Input`.
 *  - A hidden `<input>` carries the value, so the field works in a plain form.
 *  - Options are 44px tall. The popup sits below the trigger rather than over
 *    it, so the label stays visible while the list is open.
 *
 * Not a client component: it creates no functions and holds no state. The
 * placeholder is a `null` entry in Base UI's `items`, because a function child
 * on `Select.Value` could not be rendered from a server component.
 *
 * Dependencies: @base-ui-components/react, lucide-react, react,
 * @registry/lib/utils.
 */

import { Field } from "@base-ui-components/react/field"
import { Select as BaseSelect } from "@base-ui-components/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@registry/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  /** Required. Use `hideLabel` if it should not be visible. */
  label: ReactNode
  /** Hides the label visually but keeps it for screen readers. */
  hideLabel?: boolean
  /** Help text below the field. It is linked to the field for you. */
  description?: ReactNode
  /** Error message. Marks the field invalid and is announced with it. */
  error?: ReactNode
  /** The options, in order. */
  items: SelectOption[]
  /** Shown in the trigger until something is chosen. */
  placeholder?: string
  /** Names the value in a submitted form. */
  name?: string
  /** The chosen value. Use with `onValueChange`. */
  value?: string | null
  /** The value on first render, when you do not control it. */
  defaultValue?: string | null
  /** Called with the new value when the user chooses an option. */
  onValueChange?: (value: string | null) => void
  required?: boolean
  disabled?: boolean
  id?: string
  /** Classes for the outer Field.Root. */
  className?: string
  /** Classes for the trigger button. */
  triggerClassName?: string
}

export function Select({
  label,
  hideLabel = false,
  description,
  error,
  items,
  placeholder = "Choose one",
  name,
  value,
  defaultValue,
  onValueChange,
  required,
  disabled,
  id,
  className,
  triggerClassName,
}: SelectProps) {
  // Base UI shows the label of the `null` item while nothing is chosen.
  const labels = [{ value: null, label: placeholder }, ...items]

  return (
    <Field.Root
      name={name}
      invalid={Boolean(error)}
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      <Field.Label
        className={cn("text-foreground text-sm font-medium", hideLabel && "sr-only")}
      >
        {label}
        {required ? <span className="text-muted-foreground"> (required)</span> : null}
      </Field.Label>

      <BaseSelect.Root
        items={labels}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
        id={id}
      >
        <BaseSelect.Trigger
          className={cn(
            "border-input bg-background text-foreground flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3.5 text-left text-base",
            "duration-facade-fast ease-facade-out transition-[border-color,box-shadow]",
            "focus-visible:ring-ring focus-visible:border-ring outline-none focus-visible:ring-2",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
            "data-[invalid]:border-destructive data-[invalid]:focus-visible:ring-destructive",
            "data-[placeholder]:text-muted-foreground",
            triggerClassName,
          )}
        >
          <BaseSelect.Value className="truncate" />
          <BaseSelect.Icon className="text-muted-foreground flex shrink-0">
            <ChevronDownIcon aria-hidden focusable="false" className="size-4" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner
            sideOffset={6}
            collisionPadding={16}
            alignItemWithTrigger={false}
            className="z-50"
          >
            <BaseSelect.Popup className="bg-popover text-popover-foreground duration-facade-fast ease-facade-out max-h-[var(--available-height)] w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-md border p-1 shadow-lg transition-[opacity,transform] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
              <BaseSelect.List className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <BaseSelect.Item
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    className="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground grid min-h-11 cursor-default select-none grid-cols-[1rem_minmax(0,1fr)] items-center gap-2 rounded-sm px-2 text-base outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
                  >
                    <BaseSelect.ItemIndicator className="col-start-1 flex">
                      <CheckIcon aria-hidden focusable="false" className="size-4" />
                    </BaseSelect.ItemIndicator>
                    <BaseSelect.ItemText className="col-start-2">
                      {item.label}
                    </BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>

      {description ? (
        <Field.Description className="text-muted-foreground text-pretty text-sm">
          {description}
        </Field.Description>
      ) : null}

      {/* `match` shows an error from outside, which Base UI's own validity
          state knows nothing about. Without one, no children are passed, so
          Base UI shows the browser's own message for a failed check. */}
      <Field.Error
        className="text-destructive text-pretty text-sm"
        match={Boolean(error) || undefined}
        {...(error ? { children: error } : {})}
      />
    </Field.Root>
  )
}
