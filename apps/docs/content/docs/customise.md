# Theme customiser

To open the customiser, select the palette button in the header of facadeui.dev. It works on any page. The whole site changes as you choose, so there is no separate preview.

Start with three choices:

- Brand colour: any Tailwind colour, or your own hex code.
- Neutral: the grey used for backgrounds, borders and text.
- Corners: how round they are.

The brand colour and the neutral generate every colour for light and dark mode. The result always passes the contrast checks.

Advanced shows every colour token as a hex code and as OKLCH values. When you edit tokens by hand, a colour pair can fail, so the customiser checks your theme as you type. It uses the same colour pairs and minimum ratios as `scripts/check-contrast.ts`, the script that tests the project.

Your theme is saved in your browser. It appears as one more preset, Custom, until you select Reset.

The page shows the contrast results for both modes and the CSS to copy. Paste that CSS into your stylesheet, after the Facade tokens, then set `data-facade-theme="custom"` on `<html>`.
