import * as React from 'react';
import { NumberInput } from './NumberInput';
import type { NumberInputProps } from './NumberInput';

/**
 * Props for NumberInputHtmlLike.
 *
 * Starts from standard HTML input attributes, removes conflicts,
 * and adds our NumberInput-specific props.
 */
export type NumberInputHtmlLikeProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  // Remove HTML props that conflict with our numeric API or are managed internally.
  'value' | 'defaultValue' | 'type' | 'onChange'
> & {
  value: number;
  onChangeNumber: (next: number) => void;
  maxDecimalPlaces?: number;
  decimalRoundingMode?: 'displayAndOutput' | 'displayOnly';
  formatDisplay?: (value: number) => string;
  showCommasWhileEditing?: boolean;
};

/**
 * HTML-like wrapper around NumberInput.
 *
 * Accepts standard HTML `<input>` props so consumers can drop it into
 * a web app that uses plain HTML inputs without refactoring prop names.
 *
 * - `disabled` → `editable={!disabled}`
 * - `style` (CSSProperties) → passed through as-is (HtmlInput handles CSS objects)
 * - `className`, `name`, `id`, `aria-*`, `data-*`, `tabIndex`, etc. → forwarded
 *   to the underlying `<input>` element via HtmlInput's prop passthrough.
 * - `value` is `number` (not string) — same as NumberInput.
 * - `onChangeNumber` is the primary change handler (not `onChange`).
 */
export function NumberInputHtmlLike({
  value,
  onChangeNumber,
  maxDecimalPlaces,
  decimalRoundingMode,
  formatDisplay,
  showCommasWhileEditing,
  // HTML props we explicitly map:
  disabled,
  placeholder,
  style,
  id,
  autoComplete,
  onFocus,
  onBlur,
  // Everything else (name, className, aria-*, data-*, tabIndex, etc.)
  // gets forwarded to the underlying <input> via the passthrough mechanism.
  ...htmlPassthrough
}: NumberInputHtmlLikeProps) {
  // Build props for NumberInput. We assemble as a plain object and cast,
  // because HTML attribute types (e.g. autoCapitalize) are wider than the
  // RN-derived NumberInputProps. The extra props pass through the mode
  // component's `...rest` and into HtmlInput's DOM passthrough.
  const numberInputProps = {
    value,
    onChangeNumber,
    maxDecimalPlaces,
    decimalRoundingMode,
    formatDisplay,
    showCommasWhileEditing,
    editable: disabled != null ? !disabled : undefined,
    placeholder,
    style,
    autoComplete,
    onFocus,
    onBlur,
    // HTML-specific props flow through to the <input> element.
    ...htmlPassthrough,
  };

  if (id != null) {
    (numberInputProps as Record<string, unknown>).id = id;
  }

  return <NumberInput {...(numberInputProps as unknown as NumberInputProps)} />;
}
