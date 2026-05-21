import CodeBlock from '../components/CodeBlock';

export default function ApiPropsPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-page__eyebrow">API</p>
        <h1>Props</h1>
      </header>

      <section className="docs-section">
        <h2>FormattedNumberInput</h2>
        <p>
          The core component. Uses React Native <code>TextInput</code>-style
          props and works on both web and React Native.
        </p>

        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>value</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>(required)</td>
                <td>Controlled numeric value</td>
              </tr>
              <tr>
                <td>
                  <code>onChangeNumber</code>
                </td>
                <td>
                  <code>{`(n: number) => void`}</code>
                </td>
                <td>(required)</td>
                <td>Called when the user types a valid number</td>
              </tr>
              <tr>
                <td>
                  <code>showCommasWhileEditing</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Show commas while focused and typing.</td>
              </tr>
              <tr>
                <td>
                  <code>maxDecimalPlaces</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>Max digits after the decimal point</td>
              </tr>
              <tr>
                <td>
                  <code>decimalRoundingMode</code>
                </td>
                <td>
                  <code>{`'displayAndOutput' | 'displayOnly'`}</code>
                </td>
                <td>
                  <code>'displayAndOutput'</code>
                </td>
                <td>
                  Whether rounding applies to both the output value and display,
                  or display only
                </td>
              </tr>
              <tr>
                <td>
                  <code>formatDisplay</code>
                </td>
                <td>
                  <code>{`(value: number) => string`}</code>
                </td>
                <td>
                  <code>toLocaleString('en-US')</code>
                </td>
                <td>Custom formatter for the display text</td>
              </tr>
              <tr>
                <td>
                  <code>inputComponent</code>
                </td>
                <td>
                  <code>InputComponent</code>
                </td>
                <td>
                  <code>HtmlInput</code>
                </td>
                <td>Custom input adapter such as RN TextInput</td>
              </tr>
              <tr>
                <td>
                  <code>wrapperComponent</code>
                </td>
                <td>
                  <code>WrapperComponent</code>
                </td>
                <td>
                  <code>DivWrapper</code>
                </td>
                <td>Custom wrapper adapter such as RN View</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          All other <code>TextInput</code> props such as{' '}
          <code>placeholder</code>, <code>style</code>, <code>testID</code>,{' '}
          <code>editable</code>, <code>onFocus</code>, and <code>onBlur</code>{' '}
          are forwarded to the underlying input.
        </p>
      </section>

      <section className="docs-section">
        <h2>FormattedNumberInputHtmlLike</h2>
        <p>
          An HTML-compatible wrapper for web apps. Drop-in replacement for{' '}
          <code>{`<input type="number">`}</code>.
        </p>
        <p>
          It accepts the same formatting props as{' '}
          <code>FormattedNumberInput</code> plus standard HTML input attributes.
        </p>

        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>disabled</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>Maps to editable internally</td>
              </tr>
              <tr>
                <td>
                  <code>className</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>CSS class name</td>
              </tr>
              <tr>
                <td>
                  <code>id</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Element ID</td>
              </tr>
              <tr>
                <td>
                  <code>name</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Form field name</td>
              </tr>
              <tr>
                <td>
                  <code>placeholder</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Placeholder text</td>
              </tr>
              <tr>
                <td>
                  <code>style</code>
                </td>
                <td>
                  <code>CSSProperties</code>
                </td>
                <td>Inline styles</td>
              </tr>
              <tr>
                <td>
                  <code>tabIndex</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>Tab order</td>
              </tr>
              <tr>
                <td>
                  <code>autoComplete</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Autocomplete hint</td>
              </tr>
              <tr>
                <td>
                  <code>aria-*</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Accessibility attributes</td>
              </tr>
              <tr>
                <td>
                  <code>data-*</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Data attributes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="docs-section">
        <h2>Rounding modes</h2>

        <h3>
          <code>displayAndOutput</code>
        </h3>
        <p>
          Both the displayed value and the value passed to{' '}
          <code>onChangeNumber</code> are rounded. Use this when you want the
          user&apos;s input to be constrained to a fixed number of decimal
          places.
        </p>

        <h3>
          <code>displayOnly</code>
        </h3>
        <p>
          The displayed value is rounded, but <code>onChangeNumber</code>{' '}
          receives the unrounded value. Use this when you want a clean display
          but need to preserve full precision internally.
        </p>
      </section>

      <section className="docs-section">
        <h2>Exports</h2>
        <CodeBlock language="tsx">{`// Components
import {
  FormattedNumberInput,
  FormattedNumberInputHtmlLike,
} from 'formatted-number-input';

// Adapters (for custom platform integration)
import { HtmlInput, DivWrapper } from 'formatted-number-input';

// Types
import type {
  FormattedNumberInputProps,
  FormattedNumberInputHtmlLikeProps,
  InputHandle,
  InputComponent,
  WrapperComponent,
  WrapperProps,
  RNishInputProps,
  RNPointerEvents,
} from 'formatted-number-input';`}</CodeBlock>
      </section>
    </article>
  );
}
