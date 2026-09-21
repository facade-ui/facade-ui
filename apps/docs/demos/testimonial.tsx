import { Testimonial } from "@registry/ui/testimonial"

export function Demo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Testimonial
        rating={5}
        quote="We replaced three hand-rolled landing pages in an afternoon. The sections dropped straight into our existing theme."
        author={{ name: "Rosa Iqbal", title: "Head of Design, Northwind" }}
      />
      <Testimonial
        variant="plain"
        size="lg"
        quote="The accessibility work is already done, which is the part we always ran out of time for."
        author={{ name: "Tomas Lindqvist", title: "Engineering lead, Contoso" }}
      />
    </div>
  )
}
