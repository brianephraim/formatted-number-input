import type { TextInputProps } from 'react-native';
import type { StyleObject } from './adapters/types';

function omitUndefined<T extends StyleObject>(obj: T): Partial<T> {
  const next: StyleObject = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) next[k] = v;
  }
  return next as Partial<T>;
}

function flattenStyle(style: unknown): StyleObject {
  // Avoid importing react-native's StyleSheet at runtime so this module stays
  // unit-test-friendly in Node environments.
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<StyleObject>((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  if (typeof style === 'object') return style as StyleObject;
  return {};
}

export function splitFormattedNumberInputStyle(style: TextInputProps['style']): {
  containerStyle: StyleObject;
  inputTextStyle: StyleObject;
} {
  const flat = flattenStyle(style);

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
