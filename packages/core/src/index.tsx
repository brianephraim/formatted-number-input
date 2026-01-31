import * as React from 'react';
import { Platform, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

type StyleObject = Record<string, any>;

function omitUndefined<T extends StyleObject>(obj: T): Partial<T> {
  const next: StyleObject = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) next[k] = v;
  }
  return next as Partial<T>;
}

function splitNumberInputStyle(style: TextInputProps['style']): {
  containerStyle: StyleObject;
  inputTextStyle: StyleObject;
} {
  const flat = (StyleSheet.flatten(style) ?? {}) as StyleObject;

  // Text + padding-related styles that must match between TypingInput and DisplayInput
  // so the overlay is pixel-identical.
  const {
    // typography
    color,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    fontVariant,
    letterSpacing,
    lineHeight,
    textAlign,
    textAlignVertical,
    textDecorationColor,
    textDecorationLine,
    textDecorationStyle,
    textTransform,
    includeFontPadding,

    // padding (keep on inputs so overlay text aligns without needing inset math)
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingHorizontal,
    paddingVertical,

    // NOTE: everything else (border/background/margin/layout/etc.) becomes container style.
    ...containerStyle
  } = flat;

  const inputTextStyle = omitUndefined({
    color,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    fontVariant,
    letterSpacing,
    lineHeight,
    textAlign,
    textAlignVertical,
    textDecorationColor,
    textDecorationLine,
    textDecorationStyle,
    textTransform,
    includeFontPadding,

    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingHorizontal,
    paddingVertical
  });

  return { containerStyle, inputTextStyle };
}

export type NumberInputProps = Omit<
  TextInputProps,
  'value' | 'defaultValue' | 'onChangeText' | 'keyboardType' | 'inputMode'
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

function defaultFormatDisplay(value: number, maxDecimalPlaces: number | undefined) {
  // Keep it conservative: avoid locale surprises in tests.
  // Note: Intl/NumberFormat will clamp maximumFractionDigits internally.
  return value.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimalPlaces ?? 100
  });
}

function roundToPlaces(value: number, places: number) {
  if (!Number.isFinite(value)) return value;
  const p = Math.max(0, Math.floor(places));
  const factor = 10 ** p;
  return Math.round(value * factor) / factor;
}

function formattedIndexToRawIndex(formattedText: string, formattedIndex: number) {
  // Best-effort mapping for formatted display strings that introduce separators
  // like commas/spaces/emoji. We count only the characters that also exist in the
  // raw numeric string (digits, '.', '-').
  let rawIndex = 0;
  const end = Math.max(0, Math.min(formattedIndex, formattedText.length));
  for (let i = 0; i < end; i++) {
    const ch = formattedText[i];
    if (ch >= '0' && ch <= '9') rawIndex++;
    else if (ch === '.' || ch === '-') rawIndex++;
  }
  return rawIndex;
}

function sanitizeNumericText(text: string) {
  // Keep digits, dot, minus; then enforce:
  // - at most one leading '-'
  // - at most one '.'
  const keep = text.replace(/[^0-9.-]/g, '');

  const negative = keep.startsWith('-');
  const noMinus = keep.replace(/-/g, '');

  const [intPartRaw, ...decimalParts] = noMinus.split('.');
  const intPart = intPartRaw ?? '';
  const decimalPart = decimalParts.join(''); // collapse extra dots

  const rebuilt = `${negative ? '-' : ''}${intPart}${decimalParts.length ? '.' : ''}${decimalPart}`;
  return rebuilt;
}

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
  maxDecimalPlaces,
  decimalRoundingMode = 'displayAndOutput',
  formatDisplay,
  style,
  onFocus,
  onBlur,
  ...rest
}: NumberInputProps) {
  const { containerStyle, inputTextStyle } = splitNumberInputStyle(style);
  const [isFocused, setIsFocused] = React.useState(false);

  const isWeb = Platform.OS === 'web';
  const typingInputRef = React.useRef<any>(null);
  const displayInputRef = React.useRef<any>(null);

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
    <View style={[styles.root, containerStyle]}>
      {/*
        TypingInput: uncontrolled editor.
        It stays mounted beneath the overlay, but we remount it on focus/blur to resync defaultValue.
      */}
      <TextInput
        ref={typingInputRef}
        key={remountKeyForTypingInput}
        defaultValue={rawValueText}
        onChangeText={(text) => {
          // - allow decimals
          // - if multiple '.', keep the first and collapse the rest into the decimal portion
          const cleaned = sanitizeNumericText(text);
          const next = Number(cleaned);
          if (Number.isNaN(next)) return;

          if (typeof maxDecimalPlaces === 'number' && decimalRoundingMode === 'displayAndOutput') {
            onChangeNumber(roundToPlaces(next, maxDecimalPlaces));
            return;
          }

          onChangeNumber(next);
        }}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
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
        <View pointerEvents={isWeb ? 'auto' : 'none'} style={styles.displayOverlay}>
          <TextInput
            ref={displayInputRef}
            value={formattedValueText}
            // On web we allow focus so we can read selectionStart and forward it.
            // On native we keep it non-interactive.
            editable={isWeb}
            onFocus={() => {
              if (!isWeb) return;

              // Let the browser compute the caret position in the formatted string,
              // then transfer focus + mapped caret to the real TypingInput.
              requestAnimationFrame(() => {
                const displayEl = displayInputRef.current as any;
                const formattedIndex =
                  typeof displayEl?.selectionStart === 'number'
                    ? displayEl.selectionStart
                    : formattedValueText.length;

                const desiredRawIndex = formattedIndexToRawIndex(formattedValueText, formattedIndex);
                const clampedRawIndex = Math.max(0, Math.min(desiredRawIndex, rawValueText.length));

                const typingEl = typingInputRef.current as any;
                typingEl?.focus?.();

                requestAnimationFrame(() => {
                  try {
                    typingEl?.setSelectionRange?.(clampedRawIndex, clampedRawIndex);
                  } catch {
                    // best-effort; some environments may not support selection APIs
                  }
                });
              });
            }}
            onChangeText={() => {
              // no-op: this field is display-only; focus will be forwarded immediately on web.
            }}
            style={[styles.inputBase, styles.displayInputFill, inputTextStyle, styles.displayInputWebCaretHidden]}
          />
        </View>
      ) : null}
    </View>
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

  // Web-only style. `caretColor` isn't in RN types, but react-native-web supports it.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  displayInputWebCaretHidden: ({ caretColor: 'transparent' } as any),

  typingInputHiddenText: {
    // Prevent double-rendered text when the display overlay is visible.
    color: 'transparent'
  }
});
