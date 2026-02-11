# Display modes

The component has two display modes, controlled by the `showCommasWhileEditing` prop.

## Overlay mode (default)

```tsx
<FormattedNumberInput value={value} onChangeNumber={setValue} />
```

Commas are shown only when the input is **blurred**. While focused, the user types into a raw numeric input (no commas). An absolutely-positioned display overlay shows the formatted value on top when blurred.

## Live formatting mode

```tsx
<FormattedNumberInput
  value={value}
  onChangeNumber={setValue}
  showCommasWhileEditing
/>
```

Commas remain visible **while the user is typing**. The `onChangeNumber` callback still receives a plain number (no commas).

Backspace and Delete intelligently skip over comma separators to delete the nearest significant digit. For example, in `1,234,567` with the cursor just before or after the comma between `1` and `234`, pressing Backspace deletes the `1` and the value reformats to `234,567`.
