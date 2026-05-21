import CodeBlock from '../components/CodeBlock';
import HomePageDemo from '../components/HomePageDemo';
import { sitePath } from '../lib/site';

export default function HomePage() {
  return (
    <>
      <section className="site-hero">
        <div className="site-hero__content">
          <p className="site-hero__eyebrow">formatted-number-input</p>
          <h1 className="site-hero__title">Drop-in formatted number input</h1>
          <p className="site-hero__tagline">
            A replacement for <code>{`<input>`}</code> and React Native{' '}
            <code>TextInput</code> with automatic comma formatting and decimal
            rounding.
          </p>
        </div>
      </section>

      <div className="site-content">
        <HomePageDemo />

        <article className="docs-page docs-page--home">
          <section className="docs-section">
            <h2>Quick start</h2>
            <CodeBlock language="tsx">{`import { FormattedNumberInputHtmlLike } from 'formatted-number-input';

const [value, setValue] = useState(1234567);

<FormattedNumberInputHtmlLike
  value={value}
  onChangeNumber={setValue}
  className="my-input"
/>;`}</CodeBlock>
          </section>

          <section className="docs-section">
            <h2>Features</h2>
            <ul className="docs-list">
              <li>
                <strong>Drop-in replacement</strong>: swap out{' '}
                <code>{`<input>`}</code> or RN <code>TextInput</code> with
                minimal changes
              </li>
              <li>
                <strong>Overlay mode</strong>: commas shown only when blurred;
                raw typing when focused
              </li>
              <li>
                <strong>Live mode</strong>: commas visible while typing; smart
                Backspace and Delete skips separators
              </li>
              <li>
                <strong>Decimal control</strong>: <code>maxDecimalPlaces</code>{' '}
                with <code>displayAndOutput</code> or <code>displayOnly</code>{' '}
                rounding
              </li>
              <li>
                <strong>Custom formatters</strong>: emoji separators, spaces, or
                any custom format function
              </li>
              <li>
                <strong>Cross-platform</strong>: works on web and React Native
                via adapter props
              </li>
              <li>
                <strong>Lightweight</strong>: no external dependencies; uses
                native <code>Intl.NumberFormat</code>
              </li>
            </ul>
          </section>

          <section className="docs-section">
            <h2>Demos</h2>
            <ul className="docs-list">
              <li>
                <a href={sitePath('web.html')}>Web playground</a>: interactive
                React demo page for permutations and benchmarks
              </li>
              <li>
                <a href={sitePath('guide/expo-snack.html')}>Expo Snack</a>: live
                React Native demo powered by Snack and source files served from
                this site
              </li>
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
