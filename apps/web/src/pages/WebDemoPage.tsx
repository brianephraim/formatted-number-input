import DocsWebDemo from '../DocsWebDemo';
import PageQrCode from '../components/PageQrCode';

export default function WebDemoPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-page__eyebrow">Playground</p>
        <h1>Web Demo</h1>
        <p>
          Explore the browser playground inside the same React site shell that
          powers the landing page and docs.
        </p>
      </header>

      <PageQrCode />
      <DocsWebDemo />

      <section className="docs-section">
        <h2>Notes</h2>
        <ul className="docs-list">
          <li>
            The demo is rendered directly in the React site, not embedded
            through an iframe.
          </li>
          <li>
            The benchmark deep link is still available via{' '}
            <code>#/benchmark</code>.
          </li>
        </ul>
      </section>
    </article>
  );
}
