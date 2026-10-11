import { Prose } from "@registry/ui/prose"

export function Demo() {
  return (
    <Prose className="max-w-2xl">
      <h2>Install the tokens</h2>
      <p>
        Every section reads the same design tokens. Add them once, then import the file in
        your global stylesheet. See <a href="#theming">theming</a> for the presets.
      </p>
      {/* Focusable, because it scrolls sideways on a narrow screen. */}
      <pre tabIndex={0} role="region" aria-label="Install command">
        <code>npx shadcn@latest add @facade/tokens</code>
      </pre>
      <h3>What you get</h3>
      <ul>
        <li>
          shadcn colour names, so <code>bg-primary</code> means what it always did
        </li>
        <li>Display sizes, section spacing and motion timings</li>
      </ul>
      <blockquote>
        <p>A token that fails contrast fails the build, not the visitor.</p>
      </blockquote>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Used for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--input</code>
            </td>
            <td>Field borders, at 3:1 or better</td>
          </tr>
          <tr>
            <td>
              <code>--ring</code>
            </td>
            <td>The focus ring</td>
          </tr>
        </tbody>
      </table>
    </Prose>
  )
}
