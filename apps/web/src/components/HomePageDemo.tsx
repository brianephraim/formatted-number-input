import { useState } from 'react';
import { FormattedNumberInputHtmlLike } from 'formatted-number-input';

type DemoMode = 'overlay' | 'live';
type DecimalRoundingMode = 'displayAndOutput' | 'displayOnly';

const presets = [
  {
    label: 'ARR',
    note: 'SaaS forecast',
    value: 1284500.2357,
  },
  {
    label: 'Invoice',
    note: 'Customer total',
    value: 18492.4,
  },
  {
    label: 'Micro',
    note: 'High precision',
    value: 0.004278,
  },
] as const;

function roundToPlaces(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function formatPreview(value: number, places: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: places === 0 ? 0 : Math.min(2, places),
    maximumFractionDigits: places,
  }).format(value);
}

export default function HomePageDemo() {
  const [value, setValue] = useState(1284500.2357);
  const [mode, setMode] = useState<DemoMode>('live');
  const [precision, setPrecision] = useState(2);
  const [roundingMode, setRoundingMode] =
    useState<DecimalRoundingMode>('displayOnly');
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = roundToPlaces(value, precision);
  const displayText = formatPreview(displayValue, precision);
  const stateText = value.toLocaleString('en-US', {
    maximumFractionDigits: 10,
  });

  return (
    <section className="home-demo" aria-labelledby="home-demo-title">
      <div className="home-demo__content">
        <div className="home-demo__copy">
          <p className="home-demo__eyebrow">Interactive hero demo</p>
          <h2 className="home-demo__title" id="home-demo-title">
            A number input that feels expensive in all the right ways.
          </h2>
          <p className="home-demo__lede">
            Type directly into the component, switch between overlay and live
            formatting, and watch the controlled numeric value stay easy to
            reason about.
          </p>

          <div className="home-demo__controls">
            <div className="home-demo__control-group">
              <span className="home-demo__control-label">Mode</span>
              <div className="home-demo__pills">
                <button
                  type="button"
                  className={
                    mode === 'overlay'
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setMode('overlay')}
                >
                  Overlay
                </button>
                <button
                  type="button"
                  className={
                    mode === 'live'
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setMode('live')}
                >
                  Live commas
                </button>
              </div>
            </div>

            <div className="home-demo__control-group">
              <span className="home-demo__control-label">Precision</span>
              <div className="home-demo__pills">
                {[0, 2, 4].map((nextPrecision) => (
                  <button
                    key={nextPrecision}
                    type="button"
                    className={
                      precision === nextPrecision
                        ? 'home-demo__pill is-active'
                        : 'home-demo__pill'
                    }
                    onClick={() => setPrecision(nextPrecision)}
                  >
                    {nextPrecision === 0 ? 'Whole' : `${nextPrecision} decimals`}
                  </button>
                ))}
              </div>
            </div>

            <div className="home-demo__control-group">
              <span className="home-demo__control-label">Rounding</span>
              <div className="home-demo__pills">
                <button
                  type="button"
                  className={
                    roundingMode === 'displayOnly'
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setRoundingMode('displayOnly')}
                >
                  Display only
                </button>
                <button
                  type="button"
                  className={
                    roundingMode === 'displayAndOutput'
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setRoundingMode('displayAndOutput')}
                >
                  Display + output
                </button>
              </div>
            </div>
          </div>

          <div className="home-demo__stats">
            <article className="home-demo__stat">
              <span className="home-demo__stat-label">Controlled value</span>
              <strong className="home-demo__stat-value">{stateText}</strong>
            </article>
            <article className="home-demo__stat">
              <span className="home-demo__stat-label">Rendered display</span>
              <strong className="home-demo__stat-value">{displayText}</strong>
            </article>
            <article className="home-demo__stat">
              <span className="home-demo__stat-label">Editing feel</span>
              <strong className="home-demo__stat-value">
                {mode === 'live'
                  ? 'Commas stay visible'
                  : isFocused
                    ? 'Typing raw digits'
                    : 'Formatted while blurred'}
              </strong>
            </article>
          </div>

          <pre className="home-demo__code" aria-label="Example code snippet">
            <code>{`<FormattedNumberInputHtmlLike
  value={amount}
  onChangeNumber={setAmount}
  showCommasWhileEditing={${mode === 'live'}}
  maxDecimalPlaces={${precision}}
  decimalRoundingMode="${roundingMode}"
/>`}</code>
          </pre>
        </div>

        <div className="home-demo__stage">
          <div className="home-demo__stage-card">
            <div className="home-demo__stage-topline">
              <span className="home-demo__badge">Revenue planner</span>
              <span className="home-demo__stage-note">
                Try typing <code>1234567.891</code>
              </span>
            </div>

            <div className="home-demo__field-shell">
              <div className="home-demo__currency" aria-hidden="true">
                $
              </div>
              <div className="home-demo__field-meta">
                <p className="home-demo__field-label">Projected annual total</p>
                <p className="home-demo__field-hint">
                  {mode === 'overlay'
                    ? isFocused
                      ? 'Blur the field to bring the formatted overlay back.'
                      : 'Focus to edit raw digits, blur to reveal commas.'
                    : 'Commas and caret logic stay active while you type.'}
                </p>
              </div>

              <div className="home-demo__input-wrap">
                <FormattedNumberInputHtmlLike
                  aria-label="Homepage formatted number input demo"
                  value={value}
                  onChangeNumber={setValue}
                  maxDecimalPlaces={precision}
                  decimalRoundingMode={roundingMode}
                  showCommasWhileEditing={mode === 'live'}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: 22,
                    backgroundColor: 'rgba(15, 23, 42, 0.72)',
                    color: '#f8fafc',
                    fontSize: 42,
                    fontWeight: '700',
                    lineHeight: 52,
                    letterSpacing: -1.4,
                    paddingTop: 26,
                    paddingBottom: 26,
                    paddingLeft: 76,
                    paddingRight: 24,
                  }}
                />
              </div>
            </div>

            <div className="home-demo__presets" aria-label="Preset values">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="home-demo__preset"
                  onClick={() => setValue(preset.value)}
                >
                  <span>{preset.label}</span>
                  <small>{preset.note}</small>
                </button>
              ))}
            </div>

            <div className="home-demo__bottom-grid">
              <article className="home-demo__mini-card">
                <span className="home-demo__mini-label">Best for</span>
                <strong>Forms, pricing, invoices</strong>
              </article>
              <article className="home-demo__mini-card">
                <span className="home-demo__mini-label">Cross-platform</span>
                <strong>Web and React Native</strong>
              </article>
              <article className="home-demo__mini-card">
                <span className="home-demo__mini-label">Cursor behavior</span>
                <strong>Separator-aware delete logic</strong>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
