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

// All prop keys that HtmlInput consumes directly and should NOT pass through to the DOM.
const CONSUMED_PROPS = new Set([
  'onChangeText',
  'editable',
  'style',
  'caretHidden',
  'inputMode',
  'value',
  'defaultValue',
  'onKeyDown',
  'onCopy',
  'placeholder',
  'testID',
  'onFocus',
  'onBlur',
  'onSelectionChange',
  'autoComplete',
  'keyboardType',
]);

export const HtmlInput = React.forwardRef<InputHandle, RNishInputProps>(
  function HtmlInput(props, ref) {
    const {
      onChangeText,
      editable = true,
      style,
      caretHidden,
      inputMode,
      value,
      defaultValue,
      onKeyDown,
      onCopy,
      placeholder,
      testID,
      onFocus,
      onBlur,
      autoComplete,
    } = props;

    // onSelectionChange comes from TextInputProps via ModeProps, not RNishInputProps.
    const onSelectionChange = (props as Record<string, unknown>)
      .onSelectionChange as ((e: unknown) => void) | undefined;

    // Collect any extra props not in RNishInputProps (e.g. name, id, className,
    // aria-*, data-*) so they pass through to the underlying <input> element.
    const passthroughProps: Record<string, unknown> = {};
    for (const key in props) {
      if (!CONSUMED_PROPS.has(key)) {
        passthroughProps[key] = (props as Record<string, unknown>)[key];
      }
    }

    const elRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => elRef.current?.focus(),
        setSelectionRange: (start: number, end: number) =>
          elRef.current?.setSelectionRange(start, end),
        getSelectionStart: () => elRef.current?.selectionStart ?? null,
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
      ...translateRnStyleToCss(flat),
    };

    // Avoid caret flash when we intentionally hide caret.
    if (caretHidden) css.caretColor = 'transparent';

    return (
      <input
        {...(passthroughProps as React.InputHTMLAttributes<HTMLInputElement>)}
        ref={elRef}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        inputMode={toDomInputMode(inputMode)}
        readOnly={!editable}
        data-testid={testID}
        style={css}
        onInput={(e: React.FormEvent<HTMLInputElement>) =>
          onChangeText?.(e.currentTarget.value)
        }
        onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLInputElement>}
        onCopy={onCopy as React.ClipboardEventHandler<HTMLInputElement>}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => onFocus?.(e)}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => onBlur?.(e)}
        onSelect={(e: React.SyntheticEvent<HTMLInputElement>) =>
          onSelectionChange?.(e)
        }
        autoComplete={
          typeof autoComplete === 'string' ? autoComplete : undefined
        }
      />
    );
  }
);
