import { Container } from "@registry/ui/container"

const sizes = ["sm", "md", "lg"] as const

export function Demo() {
  return (
    <div className="flex flex-col gap-4 py-4">
      {sizes.map((size) => (
        <Container key={size} size={size}>
          <div className="bg-accent text-accent-foreground rounded-lg px-4 py-3 text-sm font-medium">
            size=&quot;{size}&quot;
          </div>
        </Container>
      ))}
    </div>
  )
}
