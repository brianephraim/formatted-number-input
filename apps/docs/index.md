---
layout: home

hero:
  name: formatted-number-input
  text: Drop-in formatted number input
  tagline: A replacement for <input> and React Native TextInput with automatic comma formatting, decimal rounding, and smart cursor management
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: API
      link: /api/props
---

## Quick start

```tsx
import { FormattedNumberInputHtmlLike } from 'formatted-number-input';

const [value, setValue] = useState(1234567);

<FormattedNumberInputHtmlLike
  value={value}
  onChangeNumber={setValue}
  className="my-input"
/>;
```

## Features

- **Drop-in replacement** — swap out `<input>` or RN `TextInput` with minimal changes
- **Overlay mode** — commas shown only when blurred; raw typing when focused
- **Live mode** — commas visible while typing; smart Backspace/Delete skips separators
- **Decimal control** — `maxDecimalPlaces` with `displayAndOutput` or `displayOnly` rounding
- **Custom formatters** — emoji separators, spaces, or any custom format function
- **Cross-platform** — works on web and React Native via adapter props
- **Lightweight** — no external dependencies; uses native `Intl.NumberFormat`
