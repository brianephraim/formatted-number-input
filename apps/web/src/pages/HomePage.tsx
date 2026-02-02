import { useState } from 'react';
import { NumberInput } from '@rn-number-input/core';
import { TextInput, View } from 'react-native';
import '../App.css';

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function Variants({ children }: { children: (variant: 'html' | 'rn') => React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
      <div>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>default (html adapters)</div>
        {children('html')}
      </div>
      <div>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>
          react-native-web (View + TextInput)
        </div>
        {children('rn')}
      </div>
    </div>
  );
}

function Controls({
  testIdBase,
  value,
  setValue
}: {
  testIdBase: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
      <button
        data-testid={`${testIdBase}__set`}
        onClick={() => setValue(1234.987654321)}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid #444',
          background: '#222',
          color: '#eee'
        }}
      >
        set to 1234.987654321
      </button>
      <div
        data-testid={`${testIdBase}__value`}
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 12,
          opacity: 0.9
        }}
      >
        value: {JSON.stringify(value)}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [valueA, setValueA] = useState(1234);
  const [valueB, setValueB] = useState(12345678);
  const [valueC, setValueC] = useState(4200);
  const [valueD, setValueD] = useState(900719);
  const [valueE, setValueE] = useState(1234.56789);
  const [valueF, setValueF] = useState(1234.987654321);
  const [valueG, setValueG] = useState(1234.987654321);
  const [valueH, setValueH] = useState(1234567890.1234);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>rn-number-input (react-native-web dev)</h1>

      <p style={{ opacity: 0.8 }}>
        Developing the component against <code>react-native-web</code>, no emulators.
      </p>

      <Row title="Default (default toLocaleString formatting)">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-default-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueA}
                  onChangeNumber={setValueA}
                  placeholder="Enter a number"
                  autoComplete="off"
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueA} setValue={setValueA} />
              </>
            );
          }}
        </Variants>
      </Row>

      <Row title="Bigger text + more padding + thicker border + rounded">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-big-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueB}
                  onChangeNumber={setValueB}
                  placeholder="Big input"
                  autoComplete="off"
                  style={{
                    fontSize: 22,
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    borderWidth: 2,
                    borderColor: '#1f6feb',
                    borderRadius: 14
                  }}
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueB} setValue={setValueB} />
              </>
            );
          }}
        </Variants>
      </Row>

      <Row title="Dark theme (background + text color)">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-dark-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueC}
                  onChangeNumber={setValueC}
                  placeholder="Dark"
                  autoComplete="off"
                  style={{
                    backgroundColor: '#0b1020',
                    color: '#e6edf3',
                    borderColor: '#30363d',
                    borderRadius: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 16
                  }}
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueC} setValue={setValueC} />
              </>
            );
          }}
        </Variants>
      </Row>

      <Row title="Layout/container styles via style: fixed width + margin (applies to wrapper)">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-fixedwidth-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueD}
                  onChangeNumber={setValueD}
                  placeholder="Fixed width"
                  autoComplete="off"
                  style={{ width: 320, marginLeft: 'auto', marginRight: 'auto', textAlign: 'right' }}
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueD} setValue={setValueD} />
              </>
            );
          }}
        </Variants>
      </Row>

      <Row title="Decimals + maxDecimalPlaces=2 (rounding) — default mode (displayAndOutput)">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-decimals-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueE}
                  onChangeNumber={setValueE}
                  placeholder={variant === 'rn' ? 'Decimals (rn)' : 'Decimals'}
                  autoComplete="off"
                  maxDecimalPlaces={2}
                  style={{ textAlign: 'right' }}
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueE} setValue={setValueE} />
              </>
            );
          }}
        </Variants>
      </Row>

      <Row title="decimalRoundingMode=displayOnly + maxDecimalPlaces=2 (display rounds, output does not)">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-displayonly-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueF}
                  onChangeNumber={setValueF}
                  placeholder={variant === 'rn' ? 'displayOnly (rn)' : 'displayOnly'}
                  autoComplete="off"
                  maxDecimalPlaces={2}
                  decimalRoundingMode="displayOnly"
                  style={{ textAlign: 'right' }}
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueF} setValue={setValueF} />
              </>
            );
          }}
        </Variants>
      </Row>

      <Row title="decimalRoundingMode=displayAndOutput + maxDecimalPlaces=2 (both round)">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-displayandoutput-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueG}
                  onChangeNumber={setValueG}
                  placeholder={variant === 'rn' ? 'displayAndOutput (rn)' : 'displayAndOutput'}
                  autoComplete="off"
                  maxDecimalPlaces={2}
                  decimalRoundingMode="displayAndOutput"
                  style={{ textAlign: 'right' }}
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueG} setValue={setValueG} />
              </>
            );
          }}
        </Variants>
      </Row>

      <Row title="Custom formatDisplay (emoji separators)">
        <Variants>
          {(variant) => {
            const testIdBase = `number-input-emoji-${variant}`;
            return (
              <>
                <NumberInput
                  testID={testIdBase}
                  value={valueH}
                  onChangeNumber={setValueH}
                  placeholder={variant === 'rn' ? 'Emoji format (rn)' : 'Emoji format'}
                  autoComplete="off"
                  maxDecimalPlaces={4}
                  formatDisplay={(n: number) => {
                    // replace grouping commas with an emoji
                    return n.toLocaleString('en-US', { maximumFractionDigits: 4 }).replace(/,/g, '🍌');
                  }}
                  {...(variant === 'rn' ? { inputComponent: TextInput, wrapperComponent: View } : null)}
                />
                <Controls testIdBase={testIdBase} value={valueH} setValue={setValueH} />
              </>
            );
          }}
        </Variants>
      </Row>
    </div>
  );
}
