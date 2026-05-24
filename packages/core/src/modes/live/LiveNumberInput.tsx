import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { DivWrapper } from '../../adapters/DivWrapper';
import { HtmlInput } from '../../adapters/HtmlInput';
import type { InputHandle } from '../../adapters/types';
import { getDefaultWebInputMode } from '../../inputMode';
import {
  safeGetSelectionStart,
  safeSetSelectionRange,
} from '../../safeSelection';
import {
  countFractionDigits,
  defaultFormatDisplay,
  formatSanitizedNumericTextWithGroupSeparator,
  getNumberRoundTripInfo,
  inferGroupingSeparatorFromFormattedNumber,
  roundNumericTextToDecimalPlaces,
  roundToPlaces,
  sanitizeNumericText,
  digitsToRightOfCursor,
  cursorPosForDigitsFromRight,
  findDigitToDelete,
  preserveEditingStateInFormattedText,
} from '../../numberFormatting';
import { splitFormattedNumberInputStyle } from '../../styleSplit';
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
  debugPrecision,
  style,
  onFocus,
  onBlur,
  ...rest
}: ModeProps) {
  const externalOnSelectionChange = (
    rest as { onSelectionChange?: (e: unknown) => void }
  ).onSelectionChange;
  const baseTestID = (rest as { testID?: string } | undefined)?.testID;
  const { containerStyle, inputTextStyle } =
    splitFormattedNumberInputStyle(style);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputRef = React.useRef<InputHandle | null>(null);
  const lastSelectionStartRef = React.useRef<number | null>(null);
  const rawNumericTextRef = React.useRef<string | null>(null);
  const lastEmittedNumberRef = React.useRef<number | undefined>(value);

  const displayValue =
    typeof maxDecimalPlaces === 'number'
      ? roundToPlaces(value, maxDecimalPlaces)
      : value;
  const webInputMode = getDefaultWebInputMode(maxDecimalPlaces);

  const format = React.useCallback(
    (n: number) => {
      if (formatDisplay) return formatDisplay(n);
      return defaultFormatDisplay(n, maxDecimalPlaces);
    },
    [formatDisplay, maxDecimalPlaces]
  );

  const rawDisplayGroupSeparator = React.useMemo(() => {
    if (!formatDisplay) return ',';
    return inferGroupingSeparatorFromFormattedNumber(formatDisplay(1234567.89));
  }, [formatDisplay]);

  const formatRawDisplayText = React.useCallback(
    (text: string) =>
      formatSanitizedNumericTextWithGroupSeparator(
        text,
        rawDisplayGroupSeparator ?? ','
      ),
    [rawDisplayGroupSeparator]
  );

  // Internal formatted text state — only used while focused.
  const [formattedText, setFormattedText] = React.useState(() =>
    format(displayValue)
  );

  // Pending cursor position to apply after render.
  const pendingCursorRef = React.useRef<number | null>(null);

  const debugLog = React.useCallback(
    (event: string, details: Record<string, unknown>) => {
      if (!debugPrecision) return;
      console.log(`[FormattedNumberInput precision][live] ${event}`, details);
    },
    [debugPrecision]
  );

  const canPreserveRawDisplay = React.useCallback(
    (cleaned: string) => {
      const roundTripInfo = getNumberRoundTripInfo(cleaned);
      const hasCustomFormat = !!formatDisplay;
      const canFormatRawCustomDisplay = rawDisplayGroupSeparator != null;
      const fractionDigitCount = countFractionDigits(cleaned);
      const isWithinMaxDecimalPlaces =
        typeof maxDecimalPlaces !== 'number' ||
        fractionDigitCount <= maxDecimalPlaces;
      const canPreserve =
        cleaned !== '' && canFormatRawCustomDisplay && isWithinMaxDecimalPlaces;

      debugLog('raw-display-preserve-check', {
        cleaned,
        ...roundTripInfo,
        hasCustomFormat,
        rawDisplayGroupSeparator,
        canFormatRawCustomDisplay,
        maxDecimalPlaces,
        fractionDigitCount,
        isWithinMaxDecimalPlaces,
        canPreserve,
        stringFormattedCleaned: formatRawDisplayText(cleaned),
        stringFormattedNormalized: roundTripInfo.normalized
          ? formatRawDisplayText(roundTripInfo.normalized)
          : '',
      });

      return canPreserve;
    },
    [
      debugLog,
      formatDisplay,
      formatRawDisplayText,
      maxDecimalPlaces,
      rawDisplayGroupSeparator,
    ]
  );

  const getPreservedEchoDisplayText = React.useCallback(
    (nextValue: number) => {
      const rawNumericText = rawNumericTextRef.current;
      const lastEmittedNumber = lastEmittedNumberRef.current;

      if (lastEmittedNumber === undefined || nextValue !== lastEmittedNumber) {
        debugLog('preserved-echo-skip', {
          reason: 'incoming-value-not-last-emitted-number',
          rawNumericText,
          incomingValue: nextValue,
          lastEmittedNumber,
        });
        return null;
      }

      if (!rawNumericText || !canPreserveRawDisplay(rawNumericText)) {
        debugLog('preserved-echo-skip', {
          reason: rawNumericText ? 'raw-text-not-preserved' : 'no-raw-text',
          rawNumericText,
          incomingValue: nextValue,
          lastEmittedNumber,
        });
        return null;
      }

      const roundTripInfo = getNumberRoundTripInfo(rawNumericText);
      const parsedRawNumericText = roundTripInfo.parsed;
      if (Number.isNaN(parsedRawNumericText)) {
        debugLog('preserved-echo-skip', {
          reason: 'parsed-raw-is-nan',
          rawNumericText,
          incomingValue: nextValue,
          lastEmittedNumber,
        });
        return null;
      }
      if (parsedRawNumericText !== lastEmittedNumber) {
        debugLog('preserved-echo-skip', {
          reason: 'last-emitted-number-differs-from-raw-text',
          rawNumericText,
          ...roundTripInfo,
          parsedRawNumericText,
          incomingValue: nextValue,
          lastEmittedNumber,
        });
        return null;
      }

      const preservedDisplayText = formatRawDisplayText(rawNumericText);
      debugLog('preserved-echo-use', {
        rawNumericText,
        ...roundTripInfo,
        parsedRawNumericText,
        incomingValue: nextValue,
        lastEmittedNumber,
        preservedDisplayText,
        reason:
          'incoming value equals the number this input just emitted, so keep rendering the string-formatted raw text',
      });
      return preservedDisplayText;
    },
    [canPreserveRawDisplay, debugLog, formatRawDisplayText]
  );

  // Sync formatted text from external value changes while blurred.
  React.useEffect(() => {
    if (!isFocused) {
      const preservedEchoDisplayText = getPreservedEchoDisplayText(value);
      if (preservedEchoDisplayText != null) {
        debugLog('blurred-sync-preserve-display', {
          incomingValue: value,
          preservedEchoDisplayText,
        });
        setFormattedText(preservedEchoDisplayText);
        return;
      }

      debugLog('blurred-sync-from-number', {
        incomingValue: value,
        displayValue,
        formattedText: format(displayValue),
        rawNumericText: rawNumericTextRef.current,
      });
      rawNumericTextRef.current = null;
      lastEmittedNumberRef.current = value;
      setFormattedText(format(displayValue));
    }
  }, [
    debugLog,
    isFocused,
    value,
    displayValue,
    format,
    getPreservedEchoDisplayText,
  ]);

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
    if (cleaned === '') return;
    const displayText =
      typeof maxDecimalPlaces === 'number'
        ? roundNumericTextToDecimalPlaces(cleaned, maxDecimalPlaces)
        : cleaned;
    rawNumericTextRef.current = displayText;
    debugLog('raw-text-captured', {
      rawText,
      cleaned,
      displayText,
      digitsRight,
    });

    const next = Number(cleaned);
    if (Number.isNaN(next)) {
      const transientText = preserveEditingStateInFormattedText(cleaned, '');
      setFormattedText(transientText);
      pendingCursorRef.current = cursorPosForDigitsFromRight(
        transientText,
        digitsRight
      );
      return;
    }

    const outputValue =
      typeof maxDecimalPlaces === 'number' &&
      decimalRoundingMode === 'displayAndOutput'
        ? Number(displayText)
        : next;

    debugLog('emit-number', {
      cleaned,
      displayText,
      parsed: next,
      outputValue,
      decimalRoundingMode,
      maxDecimalPlaces,
    });
    lastEmittedNumberRef.current = outputValue;
    onChangeNumber(outputValue);

    // Reformat and compute cursor.
    const shouldPreserve = canPreserveRawDisplay(displayText);
    const numberForFallbackFormat =
      typeof maxDecimalPlaces === 'number' ? Number(displayText) : next;
    const formattedFromNumber = preserveEditingStateInFormattedText(
      displayText,
      format(numberForFallbackFormat)
    );
    const newFormatted = shouldPreserve
      ? formatRawDisplayText(displayText)
      : formattedFromNumber;
    debugLog('format-after-change', {
      cleaned,
      displayText,
      shouldPreserve,
      formattedFromRawText: formatRawDisplayText(displayText),
      formattedFromNumber,
      chosenFormattedText: newFormatted,
    });
    setFormattedText(newFormatted);
    pendingCursorRef.current = cursorPosForDigitsFromRight(
      newFormatted,
      digitsRight
    );
  }

  const handleKeyDown = React.useCallback(
    (e: unknown) => {
      const event = e as KeyboardEvent;
      const currentText = formattedText;
      const cursorPos =
        safeGetSelectionStart(inputRef.current) ??
        lastSelectionStartRef.current ??
        currentText.length;

      if (/^\d$/.test(event.key) && typeof maxDecimalPlaces === 'number') {
        const target = event.target as
          | { selectionStart?: number | null; selectionEnd?: number | null }
          | undefined;
        const selectionStart = target?.selectionStart ?? cursorPos;
        const selectionEnd = target?.selectionEnd ?? selectionStart;
        const cleanedCurrentText = sanitizeNumericText(currentText);
        const isExtraFractionalDigitAtEnd =
          cleanedCurrentText.includes('.') &&
          countFractionDigits(cleanedCurrentText) >= maxDecimalPlaces &&
          selectionStart === selectionEnd &&
          selectionStart === currentText.length;

        if (isExtraFractionalDigitAtEnd) {
          event.preventDefault();
          debugLog('ignore-extra-fractional-digit', {
            key: event.key,
            currentText,
            cleanedCurrentText,
            maxDecimalPlaces,
            selectionStart,
            selectionEnd,
          });
          return;
        }
      }

      if (event.key !== 'Backspace' && event.key !== 'Delete') return;

      event.preventDefault();

      const direction = event.key === 'Backspace' ? 'back' : 'forward';
      const deleteIdx = findDigitToDelete(currentText, cursorPos, direction);
      if (deleteIdx === -1) return;

      // Count significant digits to the right of the char being deleted.
      const digitsRight = digitsToRightOfCursor(currentText, deleteIdx + 1);

      // Remove the character at deleteIdx from the raw (non-formatted) representation.
      const rawText =
        currentText.slice(0, deleteIdx) + currentText.slice(deleteIdx + 1);

      applyChange(rawText, digitsRight);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debugLog, formattedText, maxDecimalPlaces]
  );

  const handleCopy = React.useCallback((e: unknown) => {
    const event = e as ClipboardEvent;
    const selection = (
      event.target as HTMLInputElement
    )?.ownerDocument?.getSelection?.();
    const text = selection?.toString() ?? '';
    if (text && event.clipboardData) {
      event.preventDefault();
      event.clipboardData.setData('text/plain', text.replace(/,/g, ''));
    }
  }, []);

  const handleChangeText = React.useCallback(
    (text: string) => {
      // Normal typing or paste — the browser has already applied the keystroke.
      // We need to figure out how many digits are to the right of where the cursor
      // will end up. Since `text` is the new value and the cursor is wherever the
      // browser put it, we read cursorPos from the input.
      const cursorPos =
        safeGetSelectionStart(inputRef.current) ??
        lastSelectionStartRef.current ??
        text.length;
      const digitsRight = digitsToRightOfCursor(text, cursorPos);

      applyChange(text, digitsRight);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Wrapper style={containerStyle}>
      <Input
        ref={inputRef}
        value={formattedText}
        testID={baseTestID}
        onChangeText={handleChangeText}
        onKeyDown={handleKeyDown}
        onCopy={handleCopy}
        onFocus={(e: unknown) => {
          setIsFocused(true);
          const preservedEchoDisplayText = getPreservedEchoDisplayText(value);
          const formattedFromNumber = format(displayValue);
          debugLog('focus-reseed', {
            incomingValue: value,
            displayValue,
            preservedEchoDisplayText,
            formattedFromNumber,
            chosenFormattedText:
              preservedEchoDisplayText ?? formattedFromNumber,
          });
          setFormattedText(preservedEchoDisplayText ?? formattedFromNumber);
          onFocus?.(e);
        }}
        onBlur={(e: unknown) => {
          setIsFocused(false);
          lastSelectionStartRef.current = null;
          onBlur?.(e);
        }}
        onSelectionChange={(e: unknown) => {
          const maybeNative = (
            e as { nativeEvent?: { selection?: { start?: number } } }
          ).nativeEvent;
          const nativeStart = maybeNative?.selection?.start;
          const domStart = (
            e as { target?: { selectionStart?: number | null } }
          ).target?.selectionStart;
          if (typeof nativeStart === 'number') {
            lastSelectionStartRef.current = nativeStart;
          } else if (typeof domStart === 'number') {
            lastSelectionStartRef.current = domStart;
          }
          externalOnSelectionChange?.(e);
        }}
        keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
        inputMode={Platform.OS === 'web' ? webInputMode : undefined}
        style={[styles.inputFillWidth, inputTextStyle]}
        {...rest}
      />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  inputFillWidth: {
    width: '100%',
  },
});
