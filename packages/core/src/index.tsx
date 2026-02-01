import * as React from 'react';
import { Platform, StyleSheet, type TextInputProps } from 'react-native';

/*
 * This file intentionally contains a small, best-effort RN→Web adapter.
 * Keeping it permissive avoids fighting cross-platform typings.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

type StyleObject = Record<string, any>;

function toPx(n: unknown): string | undefined {
  if (typeof n === 'number') return `${n}px`;
  if (typeof n === 'string') return n;
  return undefined;
}

function translateRnStyleToCss(style: StyleObject): React.CSSProperties {
  // Best-effort RN-style-object → CSSProperties mapping for react-native-web demo.
  // This is intentionally incomplete; add keys as needed.
  const css: any = {};

  // layout/box
  if (style.width != null) css.width = toPx(style.width);
  if (style.height != null) css.height = toPx(style.height);
  if (style.minWidth != null) css.minWidth = toPx(style.minWidth);
  if (style.maxWidth != null) css.maxWidth = toPx(style.maxWidth);
  if (style.minHeight != null) css.minHeight = toPx(style.minHeight);
  if (style.maxHeight != null) css.maxHeight = toPx(style.maxHeight);

  if (style.position != null) css.position = style.position;
  if (style.top != null) css.top = toPx(style.top);
  if (style.right != null) css.right = toPx(style.right);
  if (style.bottom != null) css.bottom = toPx(style.bottom);
  if (style.left != null) css.left = toPx(style.left);

  if (style.padding != null) css.padding = toPx(style.padding);
  if (style.paddingTop != null) css.paddingTop = toPx(style.paddingTop);
  if (style.paddingRight != null) css.paddingRight = toPx(style.paddingRight);
  if (style.paddingBottom != null) css.paddingBottom = toPx(style.paddingBottom);
  if (style.paddingLeft != null) css.paddingLeft = toPx(style.paddingLeft);

  if (style.margin != null) css.margin = toPx(style.margin);
  if (style.marginTop != null) css.marginTop = toPx(style.marginTop);
  if (style.marginRight != null) css.marginRight = toPx(style.marginRight);
  if (style.marginBottom != null) css.marginBottom = toPx(style.marginBottom);
  if (style.marginLeft != null) css.marginLeft = toPx(style.marginLeft);

  // border
  if (style.borderWidth != null) {
    css.borderStyle = style.borderStyle ?? 'solid';
    css.borderWidth = toPx(style.borderWidth);
  }
  if (style.borderColor != null) css.borderColor = style.borderColor;
  if (style.borderRadius != null) css.borderRadius = toPx(style.borderRadius);

  // background
  if (style.backgroundColor != null) css.backgroundColor = style.backgroundColor;

  // text
  if (style.color != null) css.color = style.color;
  if (style.fontSize != null) css.fontSize = toPx(style.fontSize);
  if (style.fontFamily != null) css.fontFamily = style.fontFamily;
  if (style.fontWeight != null) css.fontWeight = style.fontWeight;
  if (style.fontStyle != null) css.fontStyle = style.fontStyle;
  if (style.letterSpacing != null) css.letterSpacing = toPx(style.letterSpacing);
  if (style.lineHeight != null) css.lineHeight = toPx(style.lineHeight);
  if (style.textAlign != null) css.textAlign = style.textAlign;

  // misc
  if (style.opacity != null) css.opacity = style.opacity;
  if (style.overflow != null) css.overflow = style.overflow;

  // RN pointerEvents on View maps to CSS pointer-events.
  if (style.pointerEvents != null) css.pointerEvents = style.pointerEvents;

  return css;
}

type RNishInputProps = Pick<
  TextInputProps,
  'value' | 'defaultValue' | 'placeholder' | 'editable' | 'style' | 'onFocus' | 'onBlur' | 'inputMode'
> & {
  onChangeText?: (text: string) => void;

  // react-native-web supports this; RN native ignores.
  caretHidden?: boolean;

  // Accept but ignore on web adapter.
  keyboardType?: any;

  // Allow consuming code to pass through.
  autoComplete?: any;
};

// Note: We intentionally allow `ref` to be passed through to the underlying component.
// `react-native` components support refs, while HTML adapters use forwardRef.
// Typing these perfectly across both worlds is tricky, so we keep this loose.
type InputComponent = any;

type WrapperComponent = any;

const HtmlInput = React.forwardRef<any, RNishInputProps>(function HtmlInput(
  { onChangeText, editable = true, style, caretHidden, inputMode, value, defaultValue, ...rest },
  ref
) {
  const elRef = React.useRef<HTMLInputElement | null>(null);

  React.useImperativeHandle(ref, () => elRef.current);

  const flat = (StyleSheet.flatten(style) ?? {}) as StyleObject;
  const css = {
    // Reset browser defaults so styling matches RN TextInput expectations.
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    fontStyle: 'inherit',
    ...translateRnStyleToCss(flat)
  } as any;

  // Avoid caret flash when we intentionally hide caret.
  if (caretHidden) css.caretColor = 'transparent';

  return (
    <input
      ref={elRef}
      value={value as any}
      defaultValue={defaultValue as any}
      placeholder={rest.placeholder as any}
      inputMode={inputMode as any}
      readOnly={!editable}
      style={css}
      onInput={(e: React.FormEvent<HTMLInputElement>) =>
        onChangeText?.((e.currentTarget as HTMLInputElement).value)
      }
      onFocus={(e: React.FocusEvent<HTMLInputElement>) => rest.onFocus?.(e as any)}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => rest.onBlur?.(e as any)}
      autoComplete={rest.autoComplete as any}
    />
  );
});

type RNPointerEvents = 'auto' | 'none' | 'box-none' | 'box-only';

function mapPointerEvents(
  pointerEvents: RNPointerEvents | undefined
): React.CSSProperties['pointerEvents'] {
  if (pointerEvents === 'none') return 'none';
  // RN's box-none/box-only aren't directly representable in CSS without extra wrappers.
  return 'auto';
}

const DivWrapper: WrapperComponent = ({
  children,
  style,
  pointerEvents
}: {
  children?: React.ReactNode;
  style?: any;
  pointerEvents?: any;
}) => {
  const flat = (StyleSheet.flatten(style) ?? {}) as StyleObject;
  const css = translateRnStyleToCss(flat);
  if (pointerEvents != null) css.pointerEvents = mapPointerEvents(pointerEvents);
  return <div style={css}>{children}</div>;
};

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
    <Wrapper style={[styles.root, containerStyle] as any}>
      {/*
        TypingInput: uncontrolled editor.
        It stays mounted beneath the overlay, but we remount it on focus/blur to resync defaultValue.
      */}
      <Input
        ref={typingInputRef as any}
        key={remountKeyForTypingInput}
        defaultValue={rawValueText as any}
        onChangeText={(text: any) => {
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
        onFocus={(e: any) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e: any) => {
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
        style={[styles.inputBase, inputTextStyle, !isFocused && styles.typingInputHiddenText] as any}
        caretHidden={!isFocused}
        {...(rest as any)}
      />

      {/*
        DisplayInput: controlled overlay (pointerEvents none).
        Hidden while focused so the user edits the raw value without formatting/caret issues.
      */}
      {!isFocused ? (
        <Wrapper pointerEvents={isWeb ? 'auto' : 'none'} style={styles.displayOverlay as any}>
          <Input
            ref={displayInputRef as any}
            value={formattedValueText as any}
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
            style={[
              styles.inputBase,
              styles.displayInputFill,
              inputTextStyle,
              styles.displayInputWebCaretHidden
            ] as any}
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

  // Web-only style. `caretColor` isn't in RN types, but react-native-web supports it.
  displayInputWebCaretHidden: ({ caretColor: 'transparent' } as any),

  typingInputHiddenText: {
    // Prevent double-rendered text when the display overlay is visible.
    color: 'transparent'
  }
});
