# Getting started

## Installation

```bash
npm install @rn-number-input/core
```

## Basic usage

```tsx
import { NumberInput } from '@rn-number-input/core';

function App() {
  const [value, setValue] = useState(1234567);

  return (
    <NumberInput
      value={value}
      onChangeNumber={setValue}
    />
  );
}
```

## React Native

The component is React Native–compatible. Use your platform's `TextInput` and `View` via the `inputComponent` and `wrapperComponent` props. On web, the default `HtmlInput` and `DivWrapper` adapters use `react-native-web` when aliased.

## Next steps

- [Display modes](/guide/display-modes) — overlay vs live comma formatting
- [API Props](/api/props) — full prop reference
