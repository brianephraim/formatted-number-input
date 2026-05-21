import { useMemo, useState } from 'react';
import { FormattedNumberInputHtmlLike } from 'formatted-number-input';

type DecimalRoundingMode = 'displayAndOutput' | 'displayOnly';
type FormatterPreset = 'usUk' | 'enIn' | 'swiss' | 'spaces' | 'noGrouping';

const formatterPresets = {
  usUk: {
    label: 'US / UK',
    apply(value: number) {
      return value.toLocaleString('en-US', {
        maximumFractionDigits: 20,
      });
    },
    code: `const formatDisplay = (value: number) =>
  value.toLocaleString('en-US', { maximumFractionDigits: 20 });`,
  },
  enIn: {
    label: 'Lakh and crore (used in India)',
    apply(value: number) {
      return value.toLocaleString('en-IN', {
        maximumFractionDigits: 20,
      });
    },
    code: `const formatDisplay = (value: number) =>
  value.toLocaleString('en-IN', { maximumFractionDigits: 20 });`,
  },
  swiss: {
    label: 'Swiss apostrophes',
    apply(value: number) {
      return value.toLocaleString('de-CH', {
        maximumFractionDigits: 20,
      });
    },
    code: `const formatDisplay = (value: number) =>
  value.toLocaleString('de-CH', { maximumFractionDigits: 20 });`,
  },
  spaces: {
    label: 'Spaces',
    apply(value: number) {
      return value
        .toLocaleString('en-US', { maximumFractionDigits: 20 })
        .replaceAll(',', ' ');
    },
    code: `const formatDisplay = (value: number) =>
  value
    .toLocaleString('en-US', { maximumFractionDigits: 20 })
    .replaceAll(',', ' ');`,
  },
  noGrouping: {
    label: 'No grouping',
    apply(value: number) {
      return value.toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      });
    },
    code: `const formatDisplay = (value: number) =>
  value.toLocaleString('en-US', {
    maximumFractionDigits: 20,
    useGrouping: false,
  });`,
  },
} as const satisfies Record<
  FormatterPreset,
  {
    label: string;
    apply: (value: number) => string;
    code: string;
  }
>;

function roundToPlaces(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function defaultFormatDisplay(
  value: number,
  maxDecimalPlaces: number | undefined
) {
  const clampedMax =
    typeof maxDecimalPlaces === 'number'
      ? Math.min(20, Math.max(0, Math.floor(maxDecimalPlaces)))
      : 20;

  return value.toLocaleString('en-US', {
    maximumFractionDigits: clampedMax,
  });
}

export default function HomePageDemo() {
  const [value, setValue] = useState(1284500.2357);
  const [showCommasWhileEditing, setShowCommasWhileEditing] = useState<
    boolean | undefined
  >(true);
  const [maxDecimalPlaces, setMaxDecimalPlaces] = useState<number | undefined>(
    2
  );
  const [decimalRoundingMode, setDecimalRoundingMode] = useState<
    DecimalRoundingMode | undefined
  >('displayOnly');
  const [formatterPreset, setFormatterPreset] = useState<
    FormatterPreset | undefined
  >(undefined);
  const [isFocused, setIsFocused] = useState(false);

  const formatDisplay = useMemo(() => {
    if (formatterPreset == null) return undefined;
    return formatterPresets[formatterPreset].apply;
  }, [formatterPreset]);

  const displayValue =
    typeof maxDecimalPlaces === 'number'
      ? roundToPlaces(value, maxDecimalPlaces)
      : value;
  const displayText = formatDisplay
    ? formatDisplay(displayValue)
    : defaultFormatDisplay(displayValue, maxDecimalPlaces);
  const stateText = value.toLocaleString('en-US', {
    maximumFractionDigits: 10,
  });
  const liveCommas = showCommasWhileEditing ?? false;

  const codeLines = [
    '<FormattedNumberInputHtmlLike',
    '  value={amount}',
    '  onChangeNumber={setAmount}',
    ...(showCommasWhileEditing == null
      ? []
      : [`  showCommasWhileEditing={${showCommasWhileEditing}}`]),
    ...(maxDecimalPlaces == null
      ? []
      : [`  maxDecimalPlaces={${maxDecimalPlaces}}`]),
    ...(decimalRoundingMode == null
      ? []
      : [`  decimalRoundingMode="${decimalRoundingMode}"`]),
    ...(formatterPreset == null ? [] : ['  formatDisplay={formatDisplay}']),
    '/>',
  ];
  const codeExample =
    formatterPreset == null
      ? codeLines.join('\n')
      : `${formatterPresets[formatterPreset].code}\n\n${codeLines.join('\n')}`;

  return (
    <section className="home-demo" aria-label="Interactive number input demo">
      <div className="home-demo__content">
        <div className="home-demo__example">
          <p className="home-demo__field-hint">
            Live example of this component. Use the prop controls below to
            change this exact instance.
          </p>
          <div className="home-demo__input-shell">
            <div className="home-demo__currency" aria-hidden="true">
              $
            </div>
            <FormattedNumberInputHtmlLike
              aria-label="Homepage formatted number input demo"
              value={value}
              onChangeNumber={setValue}
              maxDecimalPlaces={maxDecimalPlaces}
              decimalRoundingMode={decimalRoundingMode}
              formatDisplay={formatDisplay}
              showCommasWhileEditing={showCommasWhileEditing}
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

        <div className="home-demo__copy">
          <p className="home-demo__lede">
            Toggle the actual props, assign <code>undefined</code> when you want
            defaults, and watch the sample code stay honest about what is really
            being passed.
          </p>

          <div className="home-demo__controls">
            <div className="home-demo__control-group">
              <span className="home-demo__control-label">
                <code>showCommasWhileEditing</code>
              </span>
              <div className="home-demo__pills">
                <button
                  type="button"
                  className={
                    showCommasWhileEditing === undefined
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setShowCommasWhileEditing(undefined)}
                >
                  Undefined (false)
                </button>
                <button
                  type="button"
                  className={
                    showCommasWhileEditing === false
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setShowCommasWhileEditing(false)}
                >
                  false
                </button>
                <button
                  type="button"
                  className={
                    showCommasWhileEditing === true
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setShowCommasWhileEditing(true)}
                >
                  true
                </button>
              </div>
              <p className="home-demo__control-note">
                Switch between blurred overlay formatting and live comma-aware
                editing.
              </p>
            </div>

            <div className="home-demo__control-group">
              <span className="home-demo__control-label">
                <code>maxDecimalPlaces</code>
              </span>
              <div className="home-demo__pills">
                <button
                  type="button"
                  className={
                    maxDecimalPlaces === undefined
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setMaxDecimalPlaces(undefined)}
                >
                  Undefined (full precision)
                </button>
                {[0, 2, 4].map((nextPrecision) => (
                  <button
                    key={nextPrecision}
                    type="button"
                    className={
                      maxDecimalPlaces === nextPrecision
                        ? 'home-demo__pill is-active'
                        : 'home-demo__pill'
                    }
                    onClick={() => setMaxDecimalPlaces(nextPrecision)}
                  >
                    {nextPrecision}
                  </button>
                ))}
              </div>
              <p className="home-demo__control-note">
                Rounds the display value before formatting. Leave it undefined
                to preserve the full numeric precision.
              </p>
            </div>

            <div className="home-demo__control-group">
              <span className="home-demo__control-label">
                <code>decimalRoundingMode</code>
              </span>
              <div className="home-demo__pills">
                <button
                  type="button"
                  className={
                    decimalRoundingMode === undefined
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setDecimalRoundingMode(undefined)}
                >
                  Undefined (displayAndOutput)
                </button>
                <button
                  type="button"
                  className={
                    decimalRoundingMode === 'displayAndOutput'
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setDecimalRoundingMode('displayAndOutput')}
                >
                  displayAndOutput
                </button>
                <button
                  type="button"
                  className={
                    decimalRoundingMode === 'displayOnly'
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setDecimalRoundingMode('displayOnly')}
                >
                  displayOnly
                </button>
              </div>
              <p className="home-demo__control-note">
                Only matters when <code>maxDecimalPlaces</code> is set: should
                rounding affect the controlled value too, or just the display?
              </p>
            </div>

            <div className="home-demo__control-group">
              <span className="home-demo__control-label">Country</span>
              <div className="home-demo__pills">
                <button
                  type="button"
                  className={
                    formatterPreset === undefined
                      ? 'home-demo__pill is-active'
                      : 'home-demo__pill'
                  }
                  onClick={() => setFormatterPreset(undefined)}
                >
                  Undefined (US / UK default)
                </button>
                {(Object.keys(formatterPresets) as FormatterPreset[]).map(
                  (preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={
                        formatterPreset === preset
                          ? 'home-demo__pill is-active'
                          : 'home-demo__pill'
                      }
                      onClick={() => setFormatterPreset(preset)}
                    >
                      {formatterPresets[preset].label}
                    </button>
                  )
                )}
              </div>
              <p className="home-demo__control-note">
                Uses <code>formatDisplay</code> presets to change the rendered
                grouping style without changing the underlying numeric state.
              </p>
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
                {liveCommas
                  ? 'Commas stay visible'
                  : isFocused
                    ? 'Typing raw digits'
                    : 'Formatted while blurred'}
              </strong>
            </article>
          </div>

          <pre className="home-demo__code" aria-label="Example code snippet">
            <code>{codeExample}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
