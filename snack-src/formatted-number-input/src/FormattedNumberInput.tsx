import * as React from 'react';
import { OverlayNumberInput } from './modes/overlay/OverlayNumberInput';
import { LiveNumberInput } from './modes/live/LiveNumberInput';
import type { ModeProps } from './modes/types';

export type FormattedNumberInputProps = Omit<
  ModeProps,
  'value' | 'onChangeNumber'
> & {
  /**
   * Controlled numeric value. Omit this and provide `defaultValue` for
   * uncontrolled usage.
   */
  value?: number;

  /**
   * Initial numeric value for uncontrolled usage.
   */
  defaultValue?: number;

  /**
   * Called whenever the parsed numeric value changes. In uncontrolled usage,
   * the component also stores this number internally.
   */
  onChangeNumber?: (next: number) => void;
  debugPrecision?: boolean;

  /**
   * When true, commas (group separators) remain visible while the input is focused
   * and the user is typing. Backspace/Delete intelligently skip over separators
   * to delete the nearest significant digit.
   *
   * When false (default), commas are only shown in the display overlay while blurred.
   */
  showCommasWhileEditing?: boolean;
};

/**
 * Hub component that routes to the appropriate mode implementation.
 */
export function FormattedNumberInput({
  showCommasWhileEditing = false,
  value,
  defaultValue = 0,
  onChangeNumber,
  ...modeProps
}: FormattedNumberInputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const resolvedValue = isControlled ? value : uncontrolledValue;

  const handleChangeNumber = React.useCallback(
    (next: number) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onChangeNumber?.(next);
    },
    [isControlled, onChangeNumber]
  );

  const resolvedModeProps = {
    ...modeProps,
    value: resolvedValue,
    onChangeNumber: handleChangeNumber,
  };

  if (showCommasWhileEditing) {
    return <LiveNumberInput {...resolvedModeProps} />;
  }
  return <OverlayNumberInput {...resolvedModeProps} />;
}
