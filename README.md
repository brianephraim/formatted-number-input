# @formatted-number-input/core

A drop-in replacement for `<input type="number">` (web) and React Native `TextInput` that adds automatic number formatting with comma separators, decimal rounding, and intelligent cursor management.

## Features

- **Drop-in replacement** — swap out your `<input>` or `TextInput` with minimal changes
- **Two display modes** — overlay (commas on blur) or live (commas while typing)
- **Smart cursor handling** — Backspace/Delete skip over separators to delete the nearest digit
- **Decimal control** — configurable `maxDecimalPlaces` with `displayAndOutput` or `displayOnly` rounding
- **Custom formatters** — use any format function (emoji separators, spaces, custom Unicode)
- **Cross-platform** — works on web and React Native via adapter props
- **Lightweight** — no external dependencies; uses native `Intl.NumberFormat`

## Installation

```bash
npm install @formatted-number-input/core
```

## Quick start

### Web (HTML-like API)

Use `FormattedNumberInputHtmlLike` as a drop-in replacement for `<input>`. It accepts standard HTML input attributes like `disabled`, `className`, `id`, `aria-*`, and `data-*`.

```tsx
import { FormattedNumberInputHtmlLike } from '@formatted-number-input/core';

function App() {
  const [value, setValue] = useState(1234567);

  return (
    <FormattedNumberInputHtmlLike
      value={value}
      onChangeNumber={setValue}
      className="my-input"
      disabled={false}
    />
  );
}
```

### Web or React Native (core API)

Use `FormattedNumberInput` for full control. It uses React Native `TextInput`-style props (`editable` instead of `disabled`, `onChangeText`, etc.) and works on both platforms.

```tsx
import { FormattedNumberInput } from '@formatted-number-input/core';

function App() {
  const [value, setValue] = useState(1234567);

  return <FormattedNumberInput value={value} onChangeNumber={setValue} />;
}
```

### React Native

Pass your platform's `TextInput` and `View` as adapters:

```tsx
import { TextInput, View } from 'react-native';
import { FormattedNumberInput } from '@formatted-number-input/core';

<FormattedNumberInput
  value={value}
  onChangeNumber={setValue}
  inputComponent={TextInput}
  wrapperComponent={View}
/>
```

## Display modes

Controlled by the `showCommasWhileEditing` prop.

### Overlay mode (default)

```tsx
<FormattedNumberInput value={value} onChangeNumber={setValue} />
```

Commas are shown only when the input is **blurred**. While focused, the user types into a raw numeric input. An absolutely-positioned display overlay shows the formatted value on top when blurred.

### Live formatting mode

```tsx
<FormattedNumberInput value={value} onChangeNumber={setValue} showCommasWhileEditing />
```

Commas remain visible **while the user is typing**. Backspace and Delete intelligently skip over separators to delete the nearest significant digit.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | (required) | Controlled numeric value |
| `onChangeNumber` | `(n: number) => void` | (required) | Called when the user types a valid number |
| `showCommasWhileEditing` | `boolean` | `false` | Show commas while focused/typing (live mode) |
| `maxDecimalPlaces` | `number` | — | Max digits after the decimal point |
| `decimalRoundingMode` | `'displayAndOutput' \| 'displayOnly'` | `'displayAndOutput'` | Whether rounding applies to both the output value and display, or display only |
| `formatDisplay` | `(value: number) => string` | `toLocaleString('en-US')` | Custom formatter for the display text |
| `inputComponent` | `InputComponent` | `HtmlInput` | Custom input adapter (e.g. RN `TextInput`) |
| `wrapperComponent` | `WrapperComponent` | `DivWrapper` | Custom wrapper adapter (e.g. RN `View`) |

All other `TextInput` props (e.g. `placeholder`, `style`, `testID`, `editable`) are forwarded to the underlying input.

`FormattedNumberInputHtmlLike` accepts standard HTML input attributes instead (`disabled`, `className`, `id`, `name`, `aria-*`, `data-*`, `tabIndex`, `autoComplete`, etc.).

## Documentation

Full docs: [brianephraim.github.io/formatted-number-input](https://brianephraim.github.io/formatted-number-input/)

```bash
npm run dev:docs     # local dev at http://localhost:5173/formatted-number-input/
npm run build:docs   # build for GitHub Pages
npm run deploy:docs  # build and push to gh-pages branch
```

## Repo layout

- `packages/core` — the reusable component package (`@formatted-number-input/core`)
  - `src/FormattedNumberInput.tsx` — hub component that routes to the active mode
  - `src/FormattedNumberInputHtmlLike.tsx` — HTML-compatible drop-in wrapper
  - `src/modes/overlay/` — overlay mode (dual-input architecture)
  - `src/modes/live/` — live formatting mode (single controlled input)
  - `src/numberFormatting.ts` — shared formatting and cursor-mapping helpers
  - `src/adapters/` — platform adapters (`HtmlInput`, `DivWrapper`)
- `apps/web` — Vite + React playground
- `apps/expo` — Expo demo app
- `apps/docs` — VitePress documentation

## Development

```bash
npm install           # install dependencies
npm run dev:web       # start Vite dev server (web playground)
npx expo start        # start Expo dev server
npm test              # run unit tests
npm run lint          # lint
```
