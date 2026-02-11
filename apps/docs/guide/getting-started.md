# Getting started

## Installation

```bash
npm install @formatted-number-input/core
```

## Web — HTML drop-in replacement

Use `FormattedNumberInputHtmlLike` as a drop-in replacement for `<input type="number">`. It accepts standard HTML input attributes like `disabled`, `className`, `id`, `name`, `aria-*`, `data-*`, `tabIndex`, and `autoComplete`.

```tsx
import { FormattedNumberInputHtmlLike } from '@formatted-number-input/core';

function App() {
  const [value, setValue] = useState(1234567);

  return (
    <FormattedNumberInputHtmlLike
      value={value}
      onChangeNumber={setValue}
      className="my-input"
      id="price"
      disabled={false}
      placeholder="Enter amount"
    />
  );
}
```

The key differences from a standard `<input>`:

- `value` is a `number`, not a string
- Use `onChangeNumber` instead of `onChange` — it receives the parsed number directly
- `type` is managed internally (no need to set `type="number"`)

## Web or React Native — core API

Use `FormattedNumberInput` for full control. It uses React Native `TextInput`-style props (`editable` instead of `disabled`, style objects, etc.) and works on both web and native.

```tsx
import { FormattedNumberInput } from '@formatted-number-input/core';

function App() {
  const [value, setValue] = useState(1234567);

  return <FormattedNumberInput value={value} onChangeNumber={setValue} />;
}
```

## React Native

The component works as a drop-in replacement for React Native `TextInput`. Pass your platform's `TextInput` and `View` as adapters:

```tsx
import { TextInput, View } from 'react-native';
import { FormattedNumberInput } from '@formatted-number-input/core';

function App() {
  const [value, setValue] = useState(1234567);

  return (
    <FormattedNumberInput
      value={value}
      onChangeNumber={setValue}
      inputComponent={TextInput}
      wrapperComponent={View}
      style={{ borderWidth: 1, padding: 8 }}
      placeholder="Enter amount"
    />
  );
}
```

All standard `TextInput` props (`placeholder`, `style`, `testID`, `editable`, `onFocus`, `onBlur`, etc.) are forwarded to the underlying input.

## Next steps

- [Display modes](/guide/display-modes) — overlay vs live comma formatting
- [Nuances](/guide/nuances) — edge cases and platform differences
- [API Props](/api/props) — full prop reference
