import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { DivWrapper } from '../../adapters/DivWrapper';
import { HtmlInput } from '../../adapters/HtmlInput';
import type { InputHandle } from '../../adapters/types';
import { safeSetSelectionRange } from '../../safeSelection';
import {
  defaultFormatDisplay,
  roundToPlaces,
  sanitizeNumericText,
  digitsToRightOfCursor,
  cursorPosForDigitsFromRight,
  findDigitToDelete
} from '../../numberFormatting';
import { splitNumberInputStyle } from '../../styleSplit';
import type { ModeProps } from '../types';

/**
 * Live-formatting mode: single controlled input with commas visible while typing.
 *
 * Intercepts Backspace/Delete to skip over separator characters and delete
 * the nearest significant digit instead.
 */
export function LiveNumberInput({
  value,
  onChangeNumber,
  inputComponent: Input = HtmlInput,
  wrapperComponent: Wrapper = DivWrapper,
  maxDecimalPlaces,
  decimalRoundingMode = 'displayAndOutput',
  formatDisplay,
  style,
  onFocus,
  onBlur,
  ...rest
}: ModeProps) {
  const externalOnSelectionChange = (rest as { onSelectionChange?: (e: unknown) => void })
    .onSelectionChange;
  const baseTestID = (rest as { testID?: string } | undefined)?.testID;
  const { containerStyle, inputTextStyle } = splitNumberInputStyle(style);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputRef = React.useRef<InputHandle | null>(null);
  const lastSelectionStartRef = React.useRef<number | null>(null);

  const displayValue =
    typeof maxDecimalPlaces === 'number' ? roundToPlaces(value, maxDecimalPlaces) : value;

  const format = React.useCallback(
    (n: number) => {
      if (formatDisplay) return formatDisplay(n);
      return defaultFormatDisplay(n, maxDecimalPlaces);
    },
    [formatDisplay, maxDecimalPlaces]
  );

  // Internal formatted text state — only used while focused.
  const [formattedText, setFormattedText] = React.useState(() => format(displayValue));

  // Pending cursor position to apply after render.
  const pendingCursorRef = React.useRef<number | null>(null);

  // Sync formatted text from external value changes while blurred.
  React.useEffect(() => {
    if (!isFocused) {
      setFormattedText(format(displayValue));
    }
  }, [isFocused, displayValue, format]);

  // Apply pending cursor position after React renders the new value.
  React.useEffect(() => {
    if (pendingCursorRef.current !== null) {
      const pos = pendingCursorRef.current;
      pendingCursorRef.current = null;
      safeSetSelectionRange(inputRef.current, pos, pos);
      lastSelectionStartRef.current = pos;
    }
  });

  function applyChange(rawText: string, digitsRight: number) {
    const cleaned = sanitizeNumericText(rawText);
    const next = Number(cleaned);
    if (Number.isNaN(next)) return;

    const outputValue =
      typeof maxDecimalPlaces === 'number' && decimalRoundingMode === 'displayAndOutput'
        ? roundToPlaces(next, maxDecimalPlaces)
        : next;

    onChangeNumber(outputValue);

    // Reformat and compute cursor.
    const newFormatted = format(
      typeof maxDecimalPlaces === 'number' ? roundToPlaces(next, maxDecimalPlaces) : next
    );
    setFormattedText(newFormatted);
    pendingCursorRef.current = cursorPosForDigitsFromRight(newFormatted, digitsRight);
  }

  const handleKeyDown = React.useCallback(
    (e: unknown) => {
      const event = e as KeyboardEvent;
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;

      event.preventDefault();

      const currentText = formattedText;
      const cursorPos =
        inputRef.current?.getSelectionStart?.() ?? lastSelectionStartRef.current ?? currentText.length;

      const direction = event.key === 'Backspace' ? 'back' : 'forward';
      const deleteIdx = findDigitToDelete(currentText, cursorPos, direction);
      if (deleteIdx === -1) return;

      // Count significant digits to the right of the char being deleted.
      const digitsRight = digitsToRightOfCursor(currentText, deleteIdx + 1);

      // Remove the character at deleteIdx from the raw (non-formatted) representation.
      const rawText = currentText.slice(0, deleteIdx) + currentText.slice(deleteIdx + 1);

      applyChange(rawText, digitsRight);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formattedText]
  );

  const handleChangeText = React.useCallback(
    (text: string) => {
      // Normal typing or paste — the browser has already applied the keystroke.
      // We need to figure out how many digits are to the right of where the cursor
      // will end up. Since `text` is the new value and the cursor is wherever the
      // browser put it, we read cursorPos from the input.
      const cursorPos =
        inputRef.current?.getSelectionStart?.() ?? lastSelectionStartRef.current ?? text.length;
      const digitsRight = digitsToRightOfCursor(text, cursorPos);

      applyChange(text, digitsRight);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Wrapper style={[styles.root, containerStyle]}>
      <Input
        ref={inputRef}
        value={formattedText}
        testID={baseTestID}
        onChangeText={handleChangeText}
        onKeyDown={handleKeyDown}
        onFocus={(e: unknown) => {
          setIsFocused(true);
          setFormattedText(format(displayValue));
          onFocus?.(e);
        }}
        onBlur={(e: unknown) => {
          setIsFocused(false);
          lastSelectionStartRef.current = null;
          onBlur?.(e);
        }}
        onSelectionChange={(e: unknown) => {
          const maybeNative = (e as { nativeEvent?: { selection?: { start?: number } } }).nativeEvent;
          const nativeStart = maybeNative?.selection?.start;
          const domStart = (e as { target?: { selectionStart?: number | null } }).target?.selectionStart;
          if (typeof nativeStart === 'number') {
            lastSelectionStartRef.current = nativeStart;
          } else if (typeof domStart === 'number') {
            lastSelectionStartRef.current = domStart;
          }
          externalOnSelectionChange?.(e);
        }}
        keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
        inputMode={Platform.OS === 'web' ? 'numeric' : undefined}
        style={[styles.inputBase, inputTextStyle]}
        {...rest}
      />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    position: 'relative',

    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    backgroundColor: 'transparent'
  },

  inputBase: {
    width: '100%',

    paddingVertical: 10,
    paddingHorizontal: 12,

    fontSize: 16,
    backgroundColor: 'transparent'
  }
});
