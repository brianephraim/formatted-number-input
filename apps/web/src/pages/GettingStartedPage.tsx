import CodeBlock from '../components/CodeBlock';
import { sitePath } from '../lib/site';

export default function GettingStartedPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-page__eyebrow">Guide</p>
        <h1>Getting started</h1>
      </header>

      <section className="docs-section">
        <h2>Installation</h2>
        <CodeBlock language="bash">{`npm install formatted-number-input`}</CodeBlock>
      </section>

      <section className="docs-section">
        <h2>Web: HTML drop-in replacement</h2>
        <p>
          Use <code>FormattedNumberInputHtmlLike</code> as a drop-in replacement
          for <code>{`<input type="number">`}</code>. It accepts standard HTML
          input attributes like <code>disabled</code>, <code>className</code>,{' '}
          <code>id</code>, <code>name</code>, <code>aria-*</code>,{' '}
          <code>data-*</code>, <code>tabIndex</code>, and{' '}
          <code>autoComplete</code>.
        </p>
        <CodeBlock language="tsx">{`import { FormattedNumberInputHtmlLike } from 'formatted-number-input';

function App() {
  const [value, setValue] = useState(1234567);

  return (
    <FormattedNumberInputHtmlLike
      value={value}
      onChangeNumber={setValue}
      className="my-input"
      id="price"
      disabled={false}
      placeholder="Enter amount"
    />
  );
}`}</CodeBlock>

        <ul className="docs-list">
          <li>
            <code>value</code> is a <code>number</code>, not a string.
          </li>
          <li>
            Use <code>onChangeNumber</code> instead of <code>onChange</code>.
          </li>
          <li>
            <code>type</code> is managed internally, so there is no need to set{' '}
            <code>type="number"</code>.
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Web or React Native: core API</h2>
        <p>
          Use <code>FormattedNumberInput</code> for full control. It uses React
          Native <code>TextInput</code>-style props and works on both web and
          native.
        </p>
        <CodeBlock language="tsx">{`import { FormattedNumberInput } from 'formatted-number-input';

function App() {
  const [value, setValue] = useState(1234567);

  return <FormattedNumberInput value={value} onChangeNumber={setValue} />;
}`}</CodeBlock>
      </section>

      <section className="docs-section">
        <h2>React Native</h2>
        <p>
          Pass your platform&apos;s <code>TextInput</code> and <code>View</code>{' '}
          as adapters.
        </p>
        <CodeBlock language="tsx">{`import { TextInput, View } from 'react-native';
import { FormattedNumberInput } from 'formatted-number-input';

function App() {
  const [value, setValue] = useState(1234567);

  return (
    <FormattedNumberInput
      value={value}
      onChangeNumber={setValue}
      inputComponent={TextInput}
      wrapperComponent={View}
      style={{ borderWidth: 1, padding: 8 }}
      placeholder="Enter amount"
    />
  );
}`}</CodeBlock>
        <p>
          All standard <code>TextInput</code> props such as{' '}
          <code>placeholder</code>, <code>style</code>, <code>testID</code>,{' '}
          <code>editable</code>, <code>onFocus</code>, and <code>onBlur</code>{' '}
          are forwarded to the underlying input.
        </p>
      </section>

      <section className="docs-section">
        <h2>Next steps</h2>
        <ul className="docs-list">
          <li>
            <a href={sitePath('guide/display-modes.html')}>Display modes</a> for
            overlay vs live comma formatting
          </li>
          <li>
            <a href={sitePath('guide/nuances.html')}>Nuances</a> for edge cases
            and platform differences
          </li>
          <li>
            <a href={sitePath('api/props.html')}>API Props</a> for the full prop
            reference
          </li>
        </ul>
      </section>
    </article>
  );
}
