# Props

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
