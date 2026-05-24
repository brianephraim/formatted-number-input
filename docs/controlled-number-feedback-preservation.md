# Preserving Typed Numeric Text Through Controlled Number Feedback

## Summary

The fix preserves the exact text a user typed while still keeping the public API
numeric:

- `value` remains a `number`.
- `onChangeNumber` still emits a `number`.
- Internally, the component keeps the user's latest sanitized text.
- When the parent feeds back the same lossy number we just emitted, the component
  keeps displaying the preserved text instead of reformatting from `Number`.

This is what lets the input show:

```text
111,111,111,111,111,111.22
```

even though the controlled numeric value is:

```text
111111111111111100
```

## The Bug

JavaScript `number` cannot represent arbitrary long decimal/integer text exactly.
That creates a bad controlled-input feedback loop:

1. User types exact text, for example `111111111111111111.22`.
2. The component parses it with `Number(...)`.
3. JavaScript rounds it to `111111111111111100`.
4. `onChangeNumber` emits that rounded number.
5. The parent stores the number and passes it back as `value`.
6. The input formats from the rounded `value`.
7. The displayed text changes to a rounded/zero-padded/exponential form.

This was most visible with `showCommasWhileEditing=true`, because live mode
reformatted on every keystroke. Overlay mode had the same underlying issue on
blur/refocus because the display overlay also formatted from the numeric prop.

## Why HTML Inputs Seemed Better

A browser input's `.value` is a string, even for `type="number"`. The browser can
keep a huge typed value as text in the DOM while exposing `.valueAsNumber` as a
lossy number.

The library API is different: it intentionally accepts `value?: number` and emits
`onChangeNumber(next: number)`. So the fix could not simply change the public API
to a string-controlled input. Instead, the component had to emulate the useful
part of browser behavior internally: keep a text display value while still
emitting numbers.

## The Working Model

The final approach was based on the proof-of-concept `LargeNumberInput` pattern:

```ts
const [canonicalValue, setCanonicalValue] = useState(...)
const lastEmittedValue = useRef<number | undefined>(value)

function handleChange(raw: string) {
  const nextNumber = Number(raw)
  lastEmittedValue.current = nextNumber
  setCanonicalValue(raw)
  onChange?.(nextNumber)
}

useEffect(() => {
  if (value === lastEmittedValue.current) return
  setCanonicalValue(String(value))
}, [value])
```

In this library, the same idea is implemented separately in both modes:

- Live mode stores `rawNumericTextRef` and `lastEmittedNumberRef`.
- Overlay mode stores `rawNumericTextRef` and `lastEmittedNumberRef`.
- If incoming `value` equals `lastEmittedNumberRef.current`, the component treats
  that value as an echo of its own last emission and preserves the raw text.
- If incoming `value` differs, the component treats it as a real external update
  and syncs display from the number prop.

That distinction is the core of the fix.

## Live Mode

Live mode has one controlled text input. It formats as the user types.

On each change:

1. Sanitize the visible text into numeric text.
2. Store it in `rawNumericTextRef`.
3. Parse it to a number.
4. Apply output rounding if `decimalRoundingMode="displayAndOutput"`.
5. Store the emitted number in `lastEmittedNumberRef`.
6. Emit `onChangeNumber(outputValue)`.
7. If the raw text can be preserved, format the raw string directly.
8. Otherwise, format from the numeric value.

Formatting the raw string directly avoids precision loss because it does not call
`Number(...)` again.

## Overlay Mode

Overlay mode has:

- a raw typing input underneath
- a formatted display input over it while blurred

The typing input is mostly uncontrolled while focused, which already helps avoid
mid-typing value snaps. The bug still appeared when the overlay display or remount
seed was derived from the rounded controlled `value`.

Overlay mode now uses the same echo guard:

1. Store raw text as the user types.
2. Store the emitted number.
3. On blur/display sync, check whether incoming `value` equals the last emitted
   number.
4. If yes, format the preserved raw text for the overlay.
5. If no, treat the prop as a real external value and sync from the number.

## Max Decimal Places

The first attempt disabled preservation whenever `maxDecimalPlaces` was set. That
was too strict.

For example, with `maxDecimalPlaces={2}`, this value should preserve:

```text
111111111111111111.22
```

It already has only two fractional digits. The integer portion may be too large
for JavaScript `number`, but the decimal-place rule is not being violated.

The final rule is:

- Preserve raw text if the fractional digit count is within `maxDecimalPlaces`.
- Do not preserve raw text if the user typed more fractional digits than allowed,
  because display/output rounding is expected in that case.

This keeps `12.3400` with `maxDecimalPlaces={2}` behaving as a rounded two-decimal
value, while preserving huge `.22` inputs.

## Custom Separators

The second missed case was `formatDisplay`, especially the demo formatter that
uses banana emoji separators.

The original preservation path was disabled for all custom formatters because an
arbitrary formatter cannot be safely recreated from raw text. For example, a
formatter might add currency symbols, units, colors, prefixes, suffixes, or
locale-specific behavior.

The final fix supports a safe subset of custom formatters:

1. Call the formatter with a reference value: `1234567.89`.
2. If the output looks like `1<sep>234<sep>567.89`, infer `<sep>` as the grouping
   separator.
3. Format preserved raw text with that separator directly.
4. If the formatter does not match that shape, fall back to numeric formatting.

This lets the banana formatter preserve raw text:

```text
111🍌111🍌111🍌111🍌111🍌111.22
```

without pretending arbitrary `formatDisplay` functions can always be applied to
raw strings.

## What This Fix Does Not Do

This fix cannot recover precision that has already been lost before the value
reaches the component.

For example:

```ts
value={123456789123412348765}
```

is already rounded by JavaScript before React passes it to the component. The
component cannot know the original source text.

The preservation guarantee applies to text that originated from user editing
inside this input instance.

## Important Helpers

- `countFractionDigits(text)` checks whether raw text is within
  `maxDecimalPlaces` without normalizing away meaningful typed zeros.
- `getNumberRoundTripInfo(text)` records how `Number(text)` changes text and is
  useful for debugging/logging precision behavior.
- `formatSanitizedNumericTextWithGroupSeparator(text, separator)` formats exact
  raw text without converting through `Number`.
- `inferGroupingSeparatorFromFormattedNumber(formatted)` detects simple custom
  grouping separators from `formatDisplay(1234567.89)`.

## Verification Coverage

The fix is covered by unit tests and browser e2e tests.

Unit coverage:

- fraction digit counting
- number round-trip diagnostics
- exact raw-text grouping with commas and custom separators
- inference of simple custom grouping separators

E2E coverage:

- live commas preserves decimal entry states
- live commas preserves huge typed text through controlled number feedback
- live commas preserves huge typed text with `maxDecimalPlaces`
- live commas preserves huge typed text with banana separators
- overlay mode preserves huge typed text through blur/refocus
- overlay mode preserves huge typed text with `maxDecimalPlaces`
- overlay mode preserves huge typed text with banana separators
- uncontrolled demos preserve display text independently of numeric readouts

Manual browser verification was also performed against the local web demo for:

```text
input: html | wrapper: html | maxDec: 2 | rounding: displayAndOutput | format: none | liveCommas: true
```

and:

```text
input: html | wrapper: html | maxDec: 2 | rounding: displayAndOutput | format: bananas | liveCommas: true
```

Both now preserve the user's typed display text while the numeric readout remains
the expected lossy JavaScript number.
