# Props

## FormattedNumberInput

The core component. Uses React Native `TextInput`-style props and works on both web and React Native.

| Prop                     | Type                                  | Default                   | Description                                                                               |
| ------------------------ | ------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| `value`                  | `number`                              | (required)                | Controlled numeric value                                                                  |
| `onChangeNumber`         | `(n: number) => void`                 | (required)                | Called when the user types a valid number                                                 |
| `showCommasWhileEditing` | `boolean`                             | `false`                   | Show commas while focused/typing ([live mode](/guide/display-modes#live-formatting-mode)) |
| `maxDecimalPlaces`       | `number`                              | —                         | Max digits after the decimal point                                                        |
| `decimalRoundingMode`    | `'displayAndOutput' \| 'displayOnly'` | `'displayAndOutput'`      | Whether rounding applies to both the output value and display, or display only            |
| `formatDisplay`          | `(value: number) => string`           | `toLocaleString('en-US')` | Custom formatter for the display text                                                     |
| `inputComponent`         | `InputComponent`                      | `HtmlInput`               | Custom input adapter (e.g. RN `TextInput`)                                                |
| `wrapperComponent`       | `WrapperComponent`                    | `DivWrapper`              | Custom wrapper adapter (e.g. RN `View`)                                                   |

All other `TextInput` props (e.g. `placeholder`, `style`, `testID`, `editable`, `onFocus`, `onBlur`) are forwarded to the underlying input.

## FormattedNumberInputHtmlLike

An HTML-compatible wrapper for web apps. Drop-in replacement for `<input type="number">`.

Accepts the same formatting props as `FormattedNumberInput` (`value`, `onChangeNumber`, `showCommasWhileEditing`, `maxDecimalPlaces`, `decimalRoundingMode`, `formatDisplay`) plus standard HTML input attributes:

| Prop           | Type            | Description                               |
| -------------- | --------------- | ----------------------------------------- |
| `disabled`     | `boolean`       | Maps to `editable={!disabled}` internally |
| `className`    | `string`        | CSS class name                            |
| `id`           | `string`        | Element ID                                |
| `name`         | `string`        | Form field name                           |
| `placeholder`  | `string`        | Placeholder text                          |
| `style`        | `CSSProperties` | Inline styles                             |
| `tabIndex`     | `number`        | Tab order                                 |
| `autoComplete` | `string`        | Autocomplete hint                         |
| `aria-*`       | `string`        | Accessibility attributes                  |
| `data-*`       | `string`        | Data attributes                           |

## Rounding modes

When `maxDecimalPlaces` is set, the `decimalRoundingMode` prop controls how rounding is applied:

### `displayAndOutput` (default)

Both the displayed value and the value passed to `onChangeNumber` are rounded. Use this when you want the user's input to be constrained to a fixed number of decimal places (e.g. currency inputs limited to 2 decimals).

### `displayOnly`

The displayed value is rounded, but `onChangeNumber` receives the unrounded value. Use this when you want a clean display but need to preserve full precision internally.

## Exports

```tsx
// Components
import {
  FormattedNumberInput,
  FormattedNumberInputHtmlLike,
} from 'formatted-number-input';

// Adapters (for custom platform integration)
import { HtmlInput, DivWrapper } from 'formatted-number-input';

// Types
import type {
  FormattedNumberInputProps,
  FormattedNumberInputHtmlLikeProps,
  InputHandle,
  InputComponent,
  WrapperComponent,
  WrapperProps,
  RNishInputProps,
  RNPointerEvents,
} from 'formatted-number-input';
```
