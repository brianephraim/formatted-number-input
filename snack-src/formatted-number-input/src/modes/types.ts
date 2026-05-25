import type { TextInputProps } from 'react-native';
import type {
  InputBlurEvent,
  InputComponent,
  InputFocusEvent,
  InputSelectionChangeEvent,
  WrapperComponent,
} from '../adapters/types';

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
  | 'onSelectionChange'
> & {
  value: number;
  onChangeNumber: (next: number) => void;
  inputComponent?: InputComponent;
  wrapperComponent?: WrapperComponent;
  onFocus?: (e: InputFocusEvent) => void;
  onBlur?: (e: InputBlurEvent) => void;
  onSelectionChange?: (e: InputSelectionChangeEvent) => void;
  maxDecimalPlaces?: number;
  decimalRoundingMode?: 'displayAndOutput' | 'displayOnly';
  formatDisplay?: (value: number) => string;
  debugPrecision?: boolean;
};
