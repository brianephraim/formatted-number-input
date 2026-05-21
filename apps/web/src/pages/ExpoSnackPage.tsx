import SnackEmbed from '../components/SnackEmbed';
import { formattedNumberInputSnackFiles } from '../data/snackFiles';

export default function ExpoSnackPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-page__eyebrow">Guide</p>
        <h1>Expo Snack</h1>
        <p>
          This page embeds a live Expo Snack demo of{' '}
          <code>formatted-number-input</code>.
        </p>
        <p>
          The embedded Snack loads its demo app and library source files from
          this GitHub Pages site under{' '}
          <code>/formatted-number-input/snack-src/</code>. That keeps the Snack
          aligned with the deployed site without requiring an npm publish.
        </p>
      </header>

      <SnackEmbed
        files={formattedNumberInputSnackFiles}
        description="Live Expo Snack demo for formatted-number-input, built from local source files."
        height="760px"
        name="formatted-number-input"
        platform="web"
        sdkVersion="54.0.0"
        supportedPlatforms="mydevice,ios,android,web"
      />

      <section className="docs-section">
        <h2>Notes</h2>
        <ul className="docs-list">
          <li>
            The default preview opens on web so the demo renders immediately
            inside the page.
          </li>
          <li>Inside Snack, you can switch to iOS, Android, or My Device.</li>
          <li>
            The deployed site hosts the same source files that Snack fetches at
            runtime.
          </li>
        </ul>
      </section>
    </article>
  );
}
