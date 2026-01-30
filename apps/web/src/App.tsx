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

export default function App() {
  const [valueA, setValueA] = useState(1234);
  const [valueB, setValueB] = useState(12345678);
  const [valueC, setValueC] = useState(4200);
  const [valueD, setValueD] = useState(900719);

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
        <pre style={{ marginTop: 8, background: '#111', color: '#eee', padding: 12, borderRadius: 8 }}>
          value: {JSON.stringify(valueA)}
        </pre>
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
        <pre style={{ marginTop: 8, background: '#111', color: '#eee', padding: 12, borderRadius: 8 }}>
          value: {JSON.stringify(valueB)}
        </pre>
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
        <pre style={{ marginTop: 8, background: '#111', color: '#eee', padding: 12, borderRadius: 8 }}>
          value: {JSON.stringify(valueC)}
        </pre>
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
        <pre style={{ marginTop: 8, background: '#111', color: '#eee', padding: 12, borderRadius: 8 }}>
          value: {JSON.stringify(valueD)}
        </pre>
      </Row>
    </div>
  );
}
