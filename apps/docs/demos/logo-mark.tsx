import { LogoMark } from "@registry/ui/logo-mark"

const logos = ["Northwind", "Contoso", "初音 Labs", "Umbrella", "Globex"]

export function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {logos.map((name) => (
        <LogoMark key={name} name={name} />
      ))}
    </div>
  )
}
