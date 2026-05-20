import CodeBlock from '../components/CodeBlock';

export default function DisplayModesPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-page__eyebrow">Guide</p>
        <h1>Display modes</h1>
        <p>
          The component has two display modes, controlled by the{' '}
          <code>showCommasWhileEditing</code> prop.
        </p>
      </header>

      <section className="docs-section">
        <h2>Overlay mode (default)</h2>
        <CodeBlock language="tsx">{`<FormattedNumberInput value={value} onChangeNumber={setValue} />`}</CodeBlock>

        <p>
          Commas are shown only when the input is blurred. While focused, the
          user types into a raw numeric input without commas. An absolutely
          positioned display overlay shows the formatted value on top when
          blurred.
        </p>

        <ol className="docs-list docs-list--ordered">
          <li>
            Two inputs are stacked: a hidden typing input with raw digits and a
            visible display input with formatted text.
          </li>
          <li>
            On focus, the display overlay hides and the user types raw digits.
          </li>
          <li>
            On blur, the display overlay reappears with formatted text and the
            typing input remounts to reseed from the controlled value.
          </li>
          <li>
            On web, clicking the formatted display transfers focus to the
            typing input with caret position mapping.
          </li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Live formatting mode</h2>
        <CodeBlock language="tsx">{`<FormattedNumberInput
  value={value}
  onChangeNumber={setValue}
  showCommasWhileEditing
/>`}</CodeBlock>

        <p>
          Commas remain visible while the user is typing. The{' '}
          <code>onChangeNumber</code> callback still receives a plain number
          without commas.
        </p>

        <ul className="docs-list">
          <li>
            <strong>Backspace and Delete skip separators.</strong> Pressing
            Backspace next to a comma deletes the nearest significant digit
            instead of the comma.
          </li>
          <li>
            <strong>Cursor position is preserved.</strong> After formatting
            changes the text, the cursor stays in the correct logical position
            relative to nearby digits.
          </li>
          <li>
            <strong>Copy strips separators.</strong> Selecting and copying{' '}
            <code>1,234</code> places <code>1234</code> on the clipboard.
          </li>
        </ul>
      </section>
    </article>
  );
}
