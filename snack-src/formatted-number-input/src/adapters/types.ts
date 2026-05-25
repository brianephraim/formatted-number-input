import type * as React from 'react';
import type { TextInputProps } from 'react-native';

/*
 * Shared adapter types for this package.
 * These exist because React Native and DOM event + ref typings don't line up cleanly.
 */

export type StyleObject = Record<string, unknown>;

// Note: We intentionally allow a permissive ref handle so both RN TextInput refs
// and our HTML <input> adapter can be used.
export type InputHandle = {
  focus?: () => void;
  setSelectionRange?: (start: number, end: number) => void;
  getSelectionStart?: () => number | null;
};

export type RNPointerEvents = 'auto' | 'none' | 'box-none' | 'box-only';

export type WrapperProps = {
  children?: React.ReactNode;
  style?: TextInputProps['style'];
  pointerEvents?: RNPointerEvents;
};

export type WrapperComponent = React.ComponentType<WrapperProps>;
export type InputComponent = React.ElementType;

export type AutoCompleteProp = TextInputProps extends { autoComplete?: infer T }
  ? T
  : string;

export type InputFocusEvent =
  | React.FocusEvent<HTMLInputElement>
  | Parameters<NonNullable<TextInputProps['onFocus']>>[0];

export type InputBlurEvent =
  | React.FocusEvent<HTMLInputElement>
  | Parameters<NonNullable<TextInputProps['onBlur']>>[0];

export type SelectionRangeTarget = {
  selectionStart?: number | null;
  selectionEnd?: number | null;
};

export type InputSelectionChangeEvent =
  | React.SyntheticEvent<HTMLInputElement>
  | Parameters<NonNullable<TextInputProps['onSelectionChange']>>[0];

export type InputKeyDownEvent = {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  target?: EventTarget | SelectionRangeTarget | null;
  preventDefault: () => void;
};

export type InputCopyEvent = {
  target?:
    | EventTarget
    | {
        ownerDocument?: {
          getSelection?: () => { toString: () => string } | null;
        } | null;
      }
    | null;
  clipboardData?: {
    setData: (format: string, data: string) => void;
  } | null;
  preventDefault: () => void;
};

export type RNishInputProps = Pick<
  TextInputProps,
  | 'value'
  | 'defaultValue'
  | 'placeholder'
  | 'editable'
  | 'style'
  | 'inputMode'
  | 'testID'
> & {
  onChangeText?: (text: string) => void;

  onFocus?: (e: InputFocusEvent) => void;
  onBlur?: (e: InputBlurEvent) => void;
  onSelectionChange?: (e: InputSelectionChangeEvent) => void;

  // react-native-web supports this; RN native ignores.
  caretHidden?: boolean;

  // Accept but ignore on web adapter.
  keyboardType?: TextInputProps['keyboardType'];

  // Allow consuming code to pass through.
  autoComplete?: AutoCompleteProp;

  // Key event handler for live-formatting mode (comma-skipping backspace/delete).
  onKeyDown?: (e: InputKeyDownEvent) => void;

  // Copy event handler for live-formatting mode (strip commas from clipboard).
  onCopy?: (e: InputCopyEvent) => void;
};
