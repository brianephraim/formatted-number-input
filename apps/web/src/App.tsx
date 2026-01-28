import { useState } from 'react';
import { NumberInput } from '@rn-number-input/core';
import './App.css';

export default function App() {
  const [value, setValue] = useState('1234');

  return (
    <div style={{ maxWidth: 520, margin: '48px auto', padding: 16 }}>
      <h1>rn-number-input (react-native-web dev)</h1>

      <p style={{ opacity: 0.8 }}>
        Developing the component against <code>react-native-web</code>, no emulators.
      </p>

      <div style={{ marginTop: 16 }}>
        <NumberInput
          value={value}
          onChangeValue={setValue}
          placeholder="Enter a number"
          autoComplete="off"
        />
      </div>

      <pre style={{ marginTop: 16, background: '#111', color: '#eee', padding: 12, borderRadius: 8 }}>
        value: {JSON.stringify(value)}
      </pre>
    </div>
  );
}
