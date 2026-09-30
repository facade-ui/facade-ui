/** Bare layout: a template page is the template, with a toolbar at the bottom. */
export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-background min-h-dvh">{children}</div>
}
