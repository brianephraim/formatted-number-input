import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { DivWrapper } from '../../adapters/DivWrapper';
import { HtmlInput } from '../../adapters/HtmlInput';
import type { InputHandle } from '../../adapters/types';
import { safeFocus, safeGetSelectionStart, safeSetSelectionRange } from '../../safeSelection';
import {
  defaultFormatDisplay,
  formattedIndexToRawIndex,
  roundToPlaces,
  sanitizeNumericText
} from '../../numberFormatting';
import { splitFormattedNumberInputStyle } from '../../styleSplit';
import type { ModeProps } from '../types';

/**
 * Overlay mode: dual-input architecture.
 *
 * - TypingInput (bottom): uncontrolled, holds raw numeric text.
 * - DisplayInput (top): controlled overlay showing formatted text (commas, etc.).
 * - On focus the overlay hides so the user types into the raw input.
 */
export function OverlayNumberInput({
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
  const baseTestID = (rest as { testID?: string } | undefined)?.testID;
  const { containerStyle, inputTextStyle } = splitFormattedNumberInputStyle(style);
  const [isFocused, setIsFocused] = React.useState(false);

  const isWeb = Platform.OS === 'web';
  const typingInputRef = React.useRef<InputHandle | null>(null);
  const displayInputRef = React.useRef<InputHandle | null>(null);

  const displayValue =
    typeof maxDecimalPlaces === 'number' ? roundToPlaces(value, maxDecimalPlaces) : value;

  // What should be injected into TypingInput.defaultValue (when it remounts).
  // In displayAndOutput mode, we want the DOM value to match the rounded value.
  const seedValueForTypingInput = decimalRoundingMode === 'displayAndOutput' ? displayValue : value;

  const [remountKeyForTypingInput, setRemountKeyForTypingInput] = React.useState(0);
  const lastSeedValueForTypingInputRef = React.useRef(seedValueForTypingInput);

  // Only bump the remount key while blurred.
  // This preserves click-to-position caret behavior and prevents remounts while typing.
  React.useEffect(() => {
    if (isFocused) return;
    if (Object.is(lastSeedValueForTypingInputRef.current, seedValueForTypingInput)) return;
    lastSeedValueForTypingInputRef.current = seedValueForTypingInput;
    setRemountKeyForTypingInput((k) => k + 1);
  }, [isFocused, seedValueForTypingInput]);

  const rawValueText = String(seedValueForTypingInput);

  // IMPORTANT: React Native TextInput may treat `defaultValue` as an updatable prop (not purely initial),
  // which can cause the typing text to "snap" to the controlled/rounded value while focused.
  // We freeze the defaultValue for the lifetime of each TypingInput mount, and only update it when we
  // intentionally remount via `remountKeyForTypingInput`.
  const defaultValueForTypingInput = React.useMemo(
    () => String(seedValueForTypingInput),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [remountKeyForTypingInput]
  );

  // Track the last successfully-parsed numeric value from typing.
  // Used for blur-time commit logic and debugging parity across platforms.
  const lastParsedNumberRef = React.useRef<number>(seedValueForTypingInput);
  React.useEffect(() => {
    // Keep in sync with external updates while blurred.
    if (isFocused) return;
    lastParsedNumberRef.current = seedValueForTypingInput;
  }, [isFocused, seedValueForTypingInput]);

  const formattedValueText = formatDisplay
    ? formatDisplay(displayValue)
    : defaultFormatDisplay(displayValue, maxDecimalPlaces);

  return (
    <Wrapper style={[styles.overlayRoot, containerStyle]}>
      {/*
        TypingInput: uncontrolled editor.
        It stays mounted beneath the overlay, but we remount it on focus/blur to resync defaultValue.
      */}
      <Input
        ref={typingInputRef}
        key={remountKeyForTypingInput}
        defaultValue={defaultValueForTypingInput}
        testID={baseTestID}
        onChangeText={(text: string) => {
          // - allow decimals
          // - if multiple '.', keep the first and collapse the rest into the decimal portion
          const cleaned = sanitizeNumericText(String(text));
          const next = Number(cleaned);
          if (Number.isNaN(next)) return;

          lastParsedNumberRef.current = next;

          // In displayAndOutput mode, the *output value* should be rounded as the user types.
          // The TypingInput text remains "raw" (unrounded) because it is uncontrolled.
          if (typeof maxDecimalPlaces === 'number' && decimalRoundingMode === 'displayAndOutput') {
            onChangeNumber(roundToPlaces(next, maxDecimalPlaces));
            return;
          }

          onChangeNumber(next);
        }}
        onFocus={(e: unknown) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e: unknown) => {
          setIsFocused(false);

          // No-op for rounding here: in displayAndOutput mode we already emit rounded values as the user types.
          // We keep this hook for symmetry and for potential future "commit on blur" behaviors.

          // Always remount on blur so the next focus reseeds from the canonical controlled value.
          // This prevents "stale" uncontrolled DOM text (e.g. letters) from reappearing.
          lastSeedValueForTypingInputRef.current = seedValueForTypingInput;
          setRemountKeyForTypingInput((k) => k + 1);

          onBlur?.(e);
        }}
        keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
        inputMode={Platform.OS === 'web' ? 'numeric' : undefined}
        style={[inputTextStyle, !isFocused && styles.typingInputHiddenText]}
        caretHidden={!isFocused}
        {...rest}
      />

      {/*
        DisplayInput: controlled overlay (pointerEvents none).
        Hidden while focused so the user edits the raw value without formatting/caret issues.
      */}
      {!isFocused ? (
        <Wrapper pointerEvents={isWeb ? 'auto' : 'none'} style={styles.displayOverlay}>
          <Input
            ref={displayInputRef}
            value={formattedValueText}
            testID={baseTestID ? `${baseTestID}__display` : undefined}
            // On web we allow focus so we can read selectionStart and forward it.
            // On native we keep it non-interactive.
            editable={isWeb}
            onFocus={() => {
              if (!isWeb) return;

              // Let the browser compute the caret position in the formatted string,
              // then transfer focus + mapped caret to the real TypingInput.
              requestAnimationFrame(() => {
                const displayHandle = displayInputRef.current;
                const formattedIndex =
                  safeGetSelectionStart(displayHandle) ?? formattedValueText.length;

                const desiredRawIndex = formattedIndexToRawIndex(formattedValueText, formattedIndex);
                const clampedRawIndex = Math.max(0, Math.min(desiredRawIndex, rawValueText.length));

                const typingHandle = typingInputRef.current;
                safeFocus(typingHandle);

                requestAnimationFrame(() => {
                  safeSetSelectionRange(typingHandle, clampedRawIndex, clampedRawIndex);
                });
              });
            }}
            onChangeText={() => {
              // no-op: this field is display-only; focus will be forwarded immediately on web.
            }}
            caretHidden
            style={[styles.displayInputFill, inputTextStyle]}
          />
        </Wrapper>
      ) : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  // Structural: needed for overlay positioning.
  overlayRoot: {
    position: 'relative',
  },

  displayOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },

  displayInputFill: {
    // Ensures the overlay TextInput fills the overlay View.
    width: '100%',
    height: '100%'
  },

  typingInputHiddenText: {
    // Prevent double-rendered text when the display overlay is visible.
    color: 'transparent'
  }
});
