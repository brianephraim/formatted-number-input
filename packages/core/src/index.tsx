import * as React from 'react';
import { Platform, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

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
  formatDisplay = defaultFormatDisplay,
  style,
  onFocus,
  onBlur,
  ...rest
}: NumberInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [focusCount, setFocusCount] = React.useState(0);
  const [blurCount, setBlurCount] = React.useState(0);

  const typingKey = `${focusCount}_${blurCount}`;

  const rawValueText = String(value);
  const formattedValueText = formatDisplay(value);

  return (
    <View style={styles.root}>
      {/*
        TypingInput: uncontrolled editor.
        It stays mounted beneath the overlay, but we remount it on focus/blur to resync defaultValue.
      */}
      <TextInput
        key={typingKey}
        defaultValue={rawValueText}
        onChangeText={(text) => {
          // Edge cases later; for now, parse aggressively.
          const cleaned = text.replace(/[^0-9.-]/g, '');
          const next = Number(cleaned);
          if (!Number.isNaN(next)) onChangeNumber(next);
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
        style={[styles.input, style, !isFocused && styles.typingInputHiddenText]}
        caretHidden={!isFocused}
        {...rest}
      />

      {/*
        DisplayInput: controlled overlay (pointerEvents none).
        Hidden while focused so the user edits the raw value without formatting/caret issues.
      */}
      {!isFocused ? (
        <View pointerEvents="none" style={styles.displayOverlay}>
          <TextInput value={formattedValueText} editable={false} style={[styles.input, style]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    position: 'relative'
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    fontSize: 16
  },
  displayOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  typingInputHiddenText: {
    // Prevent double-rendered text when the display overlay is visible.
    color: 'transparent'
  }
});
