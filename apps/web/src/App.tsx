import { useState } from 'react';
import { NumberInput } from '@rn-number-input/core';
import './App.css';

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function Controls({ value, setValue }: { value: number; setValue: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
      <button
        onClick={() => setValue(1234.987654321)}
        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #444', background: '#222', color: '#eee' }}
      >
        set to 1234.987654321
      </button>
      <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 12, opacity: 0.9 }}>
        value: {JSON.stringify(value)}
      </div>
    </div>
  );
}

export default function App() {
  const [valueA, setValueA] = useState(1234);
  const [valueB, setValueB] = useState(12345678);
  const [valueC, setValueC] = useState(4200);
  const [valueD, setValueD] = useState(900719);
  const [valueE, setValueE] = useState(1234.56789);

  return (
    <div style={{ maxWidth: 720, margin: '48px auto', padding: 16 }}>
      <h1>rn-number-input (react-native-web dev)</h1>

      <p style={{ opacity: 0.8 }}>
        Developing the component against <code>react-native-web</code>, no emulators.
      </p>

      <Row title="Default (formatDisplay + default border/padding)">
        <NumberInput
          value={valueA}
          onChangeNumber={setValueA}
          placeholder="Enter a number"
          autoComplete="off"
          formatDisplay={(n: number) => n.toLocaleString('en-US')}
        />
        <Controls value={valueA} setValue={setValueA} />
      </Row>

      <Row title="Bigger text + more padding + thicker border + rounded">
        <NumberInput
          value={valueB}
          onChangeNumber={setValueB}
          placeholder="Big input"
          autoComplete="off"
          formatDisplay={(n: number) => n.toLocaleString('en-US')}
          style={{
            fontSize: 22,
            paddingVertical: 16,
            paddingHorizontal: 18,
            borderWidth: 2,
            borderColor: '#1f6feb',
            borderRadius: 14
          }}
        />
        <Controls value={valueB} setValue={setValueB} />
      </Row>

      <Row title="Dark theme (background + text color)">
        <NumberInput
          value={valueC}
          onChangeNumber={setValueC}
          placeholder="Dark"
          autoComplete="off"
          formatDisplay={(n: number) => n.toLocaleString('en-US')}
          style={{
            backgroundColor: '#0b1020',
            color: '#e6edf3',
            borderColor: '#30363d',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16
          }}
        />
        <Controls value={valueC} setValue={setValueC} />
      </Row>

      <Row title="Layout/container styles via style: fixed width + margin (applies to wrapper)">
        <NumberInput
          value={valueD}
          onChangeNumber={setValueD}
          placeholder="Fixed width"
          autoComplete="off"
          formatDisplay={(n: number) => n.toLocaleString('en-US')}
          style={{ width: 320, marginLeft: 'auto', marginRight: 'auto', textAlign: 'right' }}
        />
        <Controls value={valueD} setValue={setValueD} />
      </Row>

      <Row title="Decimals + maxDecimalPlaces=2 (rounding)">
        <NumberInput
          value={valueE}
          onChangeNumber={setValueE}
          placeholder="Decimals"
          autoComplete="off"
          maxDecimalPlaces={2}
          formatDisplay={(n: number) =>
            n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
          style={{ textAlign: 'right' }}
        />
        <Controls value={valueE} setValue={setValueE} />
      </Row>
    </div>
  );
}
