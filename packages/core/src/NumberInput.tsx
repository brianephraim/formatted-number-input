import * as React from 'react';
import { Platform, StyleSheet, type TextInputProps } from 'react-native';
import { DivWrapper } from './adapters/DivWrapper';
import { HtmlInput } from './adapters/HtmlInput';
import type { InputComponent, InputHandle, WrapperComponent } from './adapters/types';
import { safeFocus, safeGetSelectionStart, safeSetSelectionRange } from './safeSelection';
import {
  defaultFormatDisplay,
  formattedIndexToRawIndex,
  roundToPlaces,
  sanitizeNumericText
} from './numberFormatting';
import { splitNumberInputStyle } from './styleSplit';

export type NumberInputProps = Omit<
  TextInputProps,
  'value' | 'defaultValue' | 'onChangeText' | 'keyboardType' | 'inputMode' | 'onFocus' | 'onBlur'
> & {
  /**
   * Controlled numeric value from the parent.
   */
  value: number;

  /**
   * Called whenever the user types something that parses to a number.
   */
  onChangeNumber: (next: number) => void;

  /**
   * Underlying input component used for TypingInput and DisplayInput.
   *
   * - Should be compatible with react-native TextInput props (not DOM input props).
   * - Defaults to a small HTML <input> adapter that supports onChangeText and selection APIs on web.
   */
  inputComponent?: InputComponent;

  /**
   * Wrapper component (View-like). Defaults to an adapted <div>.
   */
  wrapperComponent?: WrapperComponent;

  /**
   * Cross-platform focus/blur events are not type-compatible (DOM vs RN).
   * If you need a specific event type, use platform-specific props on your inputComponent.
   */
  onFocus?: (e: unknown) => void;
  onBlur?: (e: unknown) => void;

  /**
   * Max number of digits allowed after the decimal point.
   */
  maxDecimalPlaces?: number;

  /**
   * How maxDecimalPlaces should be applied.
   * - displayAndOutput: rounds the outgoing value (onChangeNumber) AND the display overlay
   * - displayOnly: rounds only the display overlay; outgoing value remains unrounded
   */
  decimalRoundingMode?: 'displayAndOutput' | 'displayOnly';

  /**
   * Format the controlled `value` for display while NOT focused.
   *
   * Example: (n) => n.toLocaleString('en-US')
   */
  formatDisplay?: (value: number) => string;
};

/**
 * Fancy number input with a display overlay.
 *
 * - Outer API is controlled: `value` + `onChangeNumber`.
 * - Inner typing field is intentionally uncontrolled (defaultValue + remount on focus/blur)
 *   to avoid controlled-input perf/caret issues while typing.
 */
export function NumberInput({
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
}: NumberInputProps) {
  const baseTestID = (rest as { testID?: string } | undefined)?.testID;
  const { containerStyle, inputTextStyle } = splitNumberInputStyle(style);
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

  const formattedValueText = formatDisplay
    ? formatDisplay(displayValue)
    : defaultFormatDisplay(displayValue, maxDecimalPlaces);

  return (
    <Wrapper style={[styles.root, containerStyle]}>
      {/*
        TypingInput: uncontrolled editor.
        It stays mounted beneath the overlay, but we remount it on focus/blur to resync defaultValue.
      */}
      <Input
        ref={typingInputRef}
        key={remountKeyForTypingInput}
        defaultValue={rawValueText}
        testID={baseTestID}
        onChangeText={(text: string) => {
          // - allow decimals
          // - if multiple '.', keep the first and collapse the rest into the decimal portion
          const cleaned = sanitizeNumericText(String(text));
          const next = Number(cleaned);
          if (Number.isNaN(next)) return;

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

          // In displayAndOutput mode, the user can type extra decimals that round to the same
          // numeric value. In that case the controlled value may not change, so our blurred
          // seed-change effect won't remount. Force a remount on blur so the next focus starts
          // from the rounded/defaultValue text.
          if (typeof maxDecimalPlaces === 'number' && decimalRoundingMode === 'displayAndOutput') {
            lastSeedValueForTypingInputRef.current = seedValueForTypingInput;
            setRemountKeyForTypingInput((k) => k + 1);
          }

          onBlur?.(e);
        }}
        keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
        inputMode={Platform.OS === 'web' ? 'numeric' : undefined}
        style={[styles.inputBase, inputTextStyle, !isFocused && styles.typingInputHiddenText]}
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
            style={[styles.inputBase, styles.displayInputFill, inputTextStyle]}
          />
        </Wrapper>
      ) : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    position: 'relative',

    // Defaults to mimic a plain React Native TextInput box.
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    backgroundColor: 'transparent'
  },

  // Base input styles that should apply to BOTH the typing input and display overlay.
  // Visual box styles (border/background/radius/margins/layout) are handled by the wrapper.
  inputBase: {
    width: '100%',

    paddingVertical: 10,
    paddingHorizontal: 12,

    fontSize: 16,
    backgroundColor: 'transparent'
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
