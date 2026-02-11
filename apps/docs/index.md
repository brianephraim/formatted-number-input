---
layout: home

hero:
  name: rn-number-input
  text: React Native-compatible number input
  tagline: Formatted numeric input with overlay or live comma display modes
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
import { NumberInput } from '@rn-number-input/core';

const [value, setValue] = useState(1234567);

<NumberInput value={value} onChangeNumber={setValue} />
```

## Features

- **Overlay mode** — commas shown only when blurred; raw typing when focused
- **Live mode** — commas visible while typing; smart Backspace/Delete over separators
- **React Native** — use web or native via adapters (`HtmlInput`, `DivWrapper`)
- **Configurable** — `maxDecimalPlaces`, rounding modes, custom formatters
