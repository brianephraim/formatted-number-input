import type { TextInputProps } from 'react-native';
import type { InputComponent, WrapperComponent } from '../adapters/types';

/**
 * Props shared by both mode components (overlay and live).
 * This is FormattedNumberInputProps minus `showCommasWhileEditing` (consumed by the hub).
 */
export type ModeProps = Omit<
  TextInputProps,
  | 'value'
  | 'defaultValue'
  | 'onChangeText'
  | 'keyboardType'
  | 'inputMode'
  | 'onFocus'
  | 'onBlur'
> & {
  value: number;
  onChangeNumber: (next: number) => void;
  inputComponent?: InputComponent;
  wrapperComponent?: WrapperComponent;
  onFocus?: (e: unknown) => void;
  onBlur?: (e: unknown) => void;
  maxDecimalPlaces?: number;
  decimalRoundingMode?: 'displayAndOutput' | 'displayOnly';
  formatDisplay?: (value: number) => string;
};
