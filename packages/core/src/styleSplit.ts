import { StyleSheet, type TextInputProps } from 'react-native';
import type { StyleObject } from './adapters/types';

function omitUndefined<T extends StyleObject>(obj: T): Partial<T> {
  const next: StyleObject = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) next[k] = v;
  }
  return next as Partial<T>;
}

export function splitNumberInputStyle(style: TextInputProps['style']): {
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
