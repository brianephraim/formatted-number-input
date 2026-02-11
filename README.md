# rn-number-input

Monorepo for developing a React Native-compatible number input component **using react-native-web only** (no emulators).

## Quick start

```bash
npm install
npm run dev:web
```

Then open the URL Vite prints.

## Usage

```tsx
import { NumberInput } from '@rn-number-input/core';

const [value, setValue] = useState(1234567);

<NumberInput value={value} onChangeNumber={setValue} />
```

## Display modes

The component has two display modes, controlled by the `showCommasWhileEditing` prop.

### Overlay mode (default)

```tsx
<NumberInput value={value} onChangeNumber={setValue} />
```

Commas are shown only when the input is **blurred**. While focused, the user types into a raw numeric input (no commas). An absolutely-positioned display overlay shows the formatted value on top when blurred.

### Live formatting mode

```tsx
<NumberInput value={value} onChangeNumber={setValue} showCommasWhileEditing />
```

Commas remain visible **while the user is typing**. The `onChangeNumber` callback still receives a plain number (no commas).

Backspace and Delete intelligently skip over comma separators to delete the nearest significant digit. For example, in `1,234,567` with the cursor just before or after the comma between `1` and `234`, pressing Backspace deletes the `1` and the value reformats to `234,567`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | (required) | Controlled numeric value |
| `onChangeNumber` | `(n: number) => void` | (required) | Called when the user types a valid number |
| `showCommasWhileEditing` | `boolean` | `false` | Show commas while focused/typing (live mode) |
| `maxDecimalPlaces` | `number` | — | Max digits after the decimal point |
| `decimalRoundingMode` | `'displayAndOutput' \| 'displayOnly'` | `'displayAndOutput'` | Whether rounding applies to both the output value and display, or display only |
| `formatDisplay` | `(value: number) => string` | `toLocaleString('en-US')` | Custom formatter for the blurred display (overlay mode) |
| `inputComponent` | `InputComponent` | `HtmlInput` | Custom input adapter (e.g. RN `TextInput`) |
| `wrapperComponent` | `WrapperComponent` | `DivWrapper` | Custom wrapper adapter (e.g. RN `View`) |

All other `TextInput` props (e.g. `placeholder`, `style`, `testID`) are forwarded to the underlying input.

## Documentation

```bash
npm run dev:docs     # local dev at http://localhost:5173/react-fancy-number-input/
npm run build:docs  # build for GitHub Pages
npm run deploy:docs # build and push to gh-pages branch
```

## Repo layout

- `packages/core` → the reusable component package (`@rn-number-input/core`)
  - `src/NumberInput.tsx` → hub component that routes to the active mode
  - `src/modes/overlay/` → overlay mode (dual-input architecture)
  - `src/modes/live/` → live formatting mode (single controlled input)
  - `src/numberFormatting.ts` → shared formatting and cursor-mapping helpers
  - `src/adapters/` → platform adapters (`HtmlInput`, `DivWrapper`)
- `apps/web` → Vite + React + react-native-web playground
- `apps/expo` → Expo demo app
- `apps/docs` → VitePress documentation (deployable to GitHub Pages)

## Notes

- The web app aliases `react-native` → `react-native-web` in `apps/web/vite.config.ts`.
- The web app imports the package source directly for fast iteration.
