export default function NuancesPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-page__eyebrow">Guide</p>
        <h1>Nuances and edge cases</h1>
        <p>This page documents behaviors that may affect integration or UX.</p>
      </header>

      <section className="docs-section">
        <h2>Choosing a component</h2>
        <ul className="docs-list">
          <li>
            <strong>FormattedNumberInputHtmlLike</strong>: drop-in replacement
            for HTML input. Accepts HTML attributes such as <code>disabled</code>,{' '}
            <code>className</code>, <code>id</code>, <code>name</code>,{' '}
            <code>aria-*</code>, and <code>data-*</code>.
          </li>
          <li>
            <strong>FormattedNumberInput</strong>: drop-in replacement for
            React Native <code>TextInput</code>. Uses RN-style props and works
            on web and native.
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Input parsing</h2>

        <h3>Negative numbers</h3>
        <p>
          A leading minus sign is supported. Minus signs in the middle of the
          string are stripped, so <code>12-3</code> becomes <code>123</code>{' '}
          and <code>--12</code> becomes <code>-12</code>.
        </p>

        <h3>Multiple decimal points</h3>
        <p>
          Extra decimal points are collapsed into a single decimal point. For
          example, <code>12.3.4.567</code> becomes <code>12.34567</code>.
        </p>

        <h3>Invalid characters</h3>
        <p>
          In overlay mode, the typing input is uncontrolled. If the user types
          letters such as <code>12abc34</code>, they remain visible while
          focused. On blur, the input remounts and reseeds from the controlled
          value, so the letters are stripped on the next focus.
        </p>
      </section>

      <section className="docs-section">
        <h2>formatDisplay and custom separators</h2>
        <p>
          <code>formatDisplay</code> can return any string. The library treats
          only digits, decimal points, and minus signs as significant when
          mapping overlay clicks and deciding which digit to delete in live
          mode.
        </p>
        <p>
          That means custom separators such as emoji, spaces, or other Unicode
          characters work because they are ignored during those operations.
        </p>
      </section>

      <section className="docs-section">
        <h2>Overlay mode reseeding</h2>
        <p>
          The overlay mode typing input remounts on blur. This ensures that the
          next focus shows the canonical controlled value rather than stale DOM
          text such as letters typed before blur.
        </p>
      </section>

      <section className="docs-section">
        <h2>Platform differences</h2>
        <ul className="docs-list">
          <li>
            <strong>Web</strong>: <code>inputMode="numeric"</code> is used and{' '}
            <code>keyboardType</code> is omitted.
          </li>
          <li>
            <strong>React Native</strong>: <code>keyboardType="numeric"</code>{' '}
            is used and <code>inputMode</code> is omitted.
          </li>
          <li>
            <strong>Overlay focus transfer</strong>: on web, the display
            overlay forwards focus to the typing input with caret mapping. On
            native, the overlay is non-interactive.
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>JavaScript number precision</h2>
        <p>
          JavaScript number precision and <code>Intl.NumberFormat</code>{' '}
          fraction digit limits mean unlimited decimals are not truly possible.
          Very large values or many decimal places may lose precision.
        </p>
      </section>
    </article>
  );
}
