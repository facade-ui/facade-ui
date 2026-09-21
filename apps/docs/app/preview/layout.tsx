/**
 * Bare layout for the preview iframes: no header, no sidebar, no chrome.
 *
 * The iframe gives each preview a real viewport, which is the only way `sm:` and
 * `md:` utilities resolve correctly at a chosen width.
 */

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-background min-h-0">{children}</div>
}
