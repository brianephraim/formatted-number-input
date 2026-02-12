# formatted-number-input

A drop-in replacement for `<input type="number">` (web) and React Native `TextInput` with automatic comma formatting, decimal rounding, and smart cursor management.

## Install

```bash
npm install formatted-number-input
```

## Usage

```tsx
import { FormattedNumberInputHtmlLike } from 'formatted-number-input';

<FormattedNumberInputHtmlLike value={value} onChangeNumber={setValue} />
```

Or use the cross-platform API:

```tsx
import { FormattedNumberInput } from 'formatted-number-input';

<FormattedNumberInput value={value} onChangeNumber={setValue} />
```

## Docs

- Documentation: https://brianephraim.github.io/formatted-number-input/
- GitHub: https://github.com/brianephraim/formatted-number-input
- npm: https://www.npmjs.com/package/formatted-number-input

## License

MIT
