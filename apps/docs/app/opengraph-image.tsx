import { ImageResponse } from "next/og"

export const alt = "Facade UI — sections for marketing websites"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** The default social image: the mark, the name and the one-line description. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 96,
        background: "#ffffff",
        color: "#0c0a09",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="88" height="88" viewBox="0 0 48 48">
          <rect width="48" height="48" rx="9" fill="#f54900" />
          <rect x="9" y="9" width="30" height="6" rx="2" fill="#0c0a09" />
          <rect x="9" y="21" width="21" height="6" rx="2" fill="#0c0a09" />
          <rect x="9" y="33" width="12" height="6" rx="2" fill="#0c0a09" />
        </svg>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>Facade UI</div>
      </div>
      <div style={{ marginTop: 56, fontSize: 44, lineHeight: 1.25, maxWidth: 1000 }}>
        Accessible sections and page templates for marketing websites, installed with the
        shadcn CLI.
      </div>
      <div style={{ marginTop: 48, fontSize: 30, color: "#57534d" }}>facadeui.dev</div>
    </div>,
    size,
  )
}
