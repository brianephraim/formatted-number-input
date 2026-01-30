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
   * If provided, values will be rounded to this precision.
   */
  maxDecimalPlaces?: number;

  /**
   * Format the controlled `value` for display while NOT focused.
   *
   * Example: (n) => n.toLocaleString('en-US')
   */
  formatDisplay?: (value: number) => string;
};

function defaultFormatDisplay(value: number) {
  // Keep it conservative: avoid locale surprises in tests.
  return value.toLocaleString('en-US');
}

function roundToPlaces(value: number, places: number) {
  if (!Number.isFinite(value)) return value;
  const p = Math.max(0, Math.floor(places));
  const factor = 10 ** p;
  return Math.round(value * factor) / factor;
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
  formatDisplay = defaultFormatDisplay,
  style,
  onFocus,
  onBlur,
  ...rest
}: NumberInputProps) {
  const { containerStyle, inputTextStyle } = splitNumberInputStyle(style);
  const [isFocused, setIsFocused] = React.useState(false);
  const [focusCount, setFocusCount] = React.useState(0);
  const [blurCount, setBlurCount] = React.useState(0);

  const typingKey = `${focusCount}_${blurCount}`;

  const normalizedValue =
    typeof maxDecimalPlaces === 'number' ? roundToPlaces(value, maxDecimalPlaces) : value;

  const rawValueText = String(normalizedValue);
  const formattedValueText = formatDisplay(normalizedValue);

  return (
    <View style={[styles.root, containerStyle]}>
      {/*
        TypingInput: uncontrolled editor.
        It stays mounted beneath the overlay, but we remount it on focus/blur to resync defaultValue.
      */}
      <TextInput
        key={typingKey}
        defaultValue={rawValueText}
        onChangeText={(text) => {
          // Edge cases later; for now:
          // - allow decimals
          // - if multiple '.', keep the first and collapse the rest into the decimal portion
          // - optional rounding via maxDecimalPlaces
          const cleaned = sanitizeNumericText(text);
          const next = Number(cleaned);
          if (Number.isNaN(next)) return;

          const rounded =
            typeof maxDecimalPlaces === 'number' ? roundToPlaces(next, maxDecimalPlaces) : next;
          onChangeNumber(rounded);
        }}
        onFocus={(e) => {
          // Remount on first focus so defaultValue is re-applied at the start of an edit session.
          // Guard: after remount, the new input will focus again; don't increment focusCount twice.
          if (!isFocused) setFocusCount((c) => c + 1);
          setIsFocused(true);
          onFocus?.(e);
        }}
        autoFocus={isFocused}
        onBlur={(e) => {
          setIsFocused(false);
          setBlurCount((c) => c + 1);
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
        <View pointerEvents="none" style={styles.displayOverlay}>
          <TextInput
            value={formattedValueText}
            editable={false}
            style={[styles.inputBase, styles.displayInputFill, inputTextStyle]}
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

  typingInputHiddenText: {
    // Prevent double-rendered text when the display overlay is visible.
    color: 'transparent'
  }
});
