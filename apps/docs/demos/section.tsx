import { Container } from "@registry/ui/container"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export function Demo() {
  return (
    <Section
      spacing="sm"
      labelledBy="facade-a-named-band"
      className="bg-muted/40 rounded-xl"
    >
      <Container size="md">
        <SectionHeader
          eyebrow="Structure"
          title="A named band"
          description="Section pairs aria-labelledby with the id SectionHeader puts on the heading, so it becomes a real landmark instead of an unnamed region."
        />
      </Container>
    </Section>
  )
}
