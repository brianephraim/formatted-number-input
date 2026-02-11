# Display modes

The component has two display modes, controlled by the `showCommasWhileEditing` prop.

## Overlay mode (default)

```tsx
<FormattedNumberInput value={value} onChangeNumber={setValue} />
```

Commas are shown only when the input is **blurred**. While focused, the user types into a raw numeric input (no commas). An absolutely-positioned display overlay shows the formatted value on top when blurred.

How it works:

1. Two inputs are stacked — a hidden **typing input** (raw digits) and a visible **display input** (formatted text)
2. On focus, the display overlay hides and the user types raw digits
3. On blur, the display overlay reappears with formatted text and the typing input remounts to reseed from the controlled value
4. On web, clicking the formatted display transfers focus to the typing input with intelligent caret position mapping

## Live formatting mode

```tsx
<FormattedNumberInput
  value={value}
  onChangeNumber={setValue}
  showCommasWhileEditing
/>
```

Commas remain visible **while the user is typing**. The `onChangeNumber` callback still receives a plain number (no commas).

Smart cursor behavior:

- **Backspace/Delete skip separators** — pressing Backspace next to a comma deletes the nearest significant digit instead of the comma. For example, in `1,234,567` with the cursor after the first comma, Backspace deletes the `1` and the value reformats to `234,567`.
- **Cursor position is preserved** — after formatting changes the text, the cursor stays in the correct logical position relative to the digits around it.
- **Copy strips separators** — selecting and copying `1,234` puts `1234` on the clipboard.
