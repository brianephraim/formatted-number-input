import * as React from 'react';
import type { TextInputProps } from 'react-native';
import { flattenRnStyle, translateRnStyleToCss } from './rnStyleToCss';
import type { InputHandle, RNishInputProps } from './types';

function toDomInputMode(
  inputMode: TextInputProps['inputMode']
): React.HTMLAttributes<HTMLInputElement>['inputMode'] | undefined {
  // RN and DOM inputMode strings mostly line up; we only pass through known DOM values.
  if (typeof inputMode !== 'string') return undefined;
  switch (inputMode) {
    case 'none':
    case 'text':
    case 'tel':
    case 'url':
    case 'email':
    case 'numeric':
    case 'decimal':
    case 'search':
      return inputMode;
    default:
      return undefined;
  }
}

export const HtmlInput = React.forwardRef<InputHandle, RNishInputProps>(function HtmlInput(
  { onChangeText, editable = true, style, caretHidden, inputMode, value, defaultValue, onKeyDown, ...rest },
  ref
) {
  const elRef = React.useRef<HTMLInputElement | null>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => elRef.current?.focus(),
      setSelectionRange: (start: number, end: number) => elRef.current?.setSelectionRange(start, end),
      getSelectionStart: () => elRef.current?.selectionStart ?? null
    }),
    []
  );

  const flat = flattenRnStyle(style);
  const css: React.CSSProperties = {
    // Reset browser defaults so styling matches RN TextInput expectations.
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    fontStyle: 'inherit',
    ...translateRnStyleToCss(flat)
  };

  // Avoid caret flash when we intentionally hide caret.
  if (caretHidden) css.caretColor = 'transparent';

  return (
    <input
      ref={elRef}
      value={value}
      defaultValue={defaultValue}
      placeholder={rest.placeholder}
      inputMode={toDomInputMode(inputMode)}
      readOnly={!editable}
      data-testid={rest.testID}
      style={css}
      onInput={(e: React.FormEvent<HTMLInputElement>) => onChangeText?.(e.currentTarget.value)}
      onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLInputElement>}
      onFocus={(e: React.FocusEvent<HTMLInputElement>) => rest.onFocus?.(e)}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => rest.onBlur?.(e)}
      onSelect={(e: React.SyntheticEvent<HTMLInputElement>) => rest.onSelectionChange?.(e)}
      autoComplete={typeof rest.autoComplete === 'string' ? rest.autoComplete : undefined}
    />
  );
});
