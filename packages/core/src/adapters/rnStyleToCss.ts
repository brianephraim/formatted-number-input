import type * as React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleObject } from './types';

function toPx(n: unknown): string | undefined {
  if (typeof n === 'number') return `${n}px`;
  if (typeof n === 'string') return n;
  return undefined;
}

export function translateRnStyleToCss(style: StyleObject): React.CSSProperties {
  // Best-effort RN-style-object → CSSProperties mapping for react-native-web demo.
  // This is intentionally incomplete; add keys as needed.
  const css: React.CSSProperties = {};

  // layout/box
  if (style.width != null) css.width = toPx(style.width);
  if (style.height != null) css.height = toPx(style.height);
  if (style.minWidth != null) css.minWidth = toPx(style.minWidth);
  if (style.maxWidth != null) css.maxWidth = toPx(style.maxWidth);
  if (style.minHeight != null) css.minHeight = toPx(style.minHeight);
  if (style.maxHeight != null) css.maxHeight = toPx(style.maxHeight);

  if (typeof style.position === 'string') {
    css.position = style.position as React.CSSProperties['position'];
  }
  if (style.top != null) css.top = toPx(style.top);
  if (style.right != null) css.right = toPx(style.right);
  if (style.bottom != null) css.bottom = toPx(style.bottom);
  if (style.left != null) css.left = toPx(style.left);

  if (style.padding != null) css.padding = toPx(style.padding);
  const pv = style.paddingVertical;
  const ph = style.paddingHorizontal;
  if (pv != null) {
    css.paddingTop = toPx(pv);
    css.paddingBottom = toPx(pv);
  }
  if (ph != null) {
    css.paddingLeft = toPx(ph);
    css.paddingRight = toPx(ph);
  }
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
    if (typeof style.borderStyle === 'string') {
      css.borderStyle = style.borderStyle as React.CSSProperties['borderStyle'];
    } else {
      css.borderStyle = 'solid';
    }

    css.borderWidth = toPx(style.borderWidth);
  }
  if (typeof style.borderColor === 'string') {
    css.borderColor = style.borderColor;
  }
  if (style.borderRadius != null) css.borderRadius = toPx(style.borderRadius);

  // background
  if (typeof style.backgroundColor === 'string') css.backgroundColor = style.backgroundColor;

  // text
  if (typeof style.color === 'string') css.color = style.color;
  if (style.fontSize != null) css.fontSize = toPx(style.fontSize);
  if (typeof style.fontFamily === 'string') css.fontFamily = style.fontFamily;
  if (typeof style.fontWeight === 'string') {
    css.fontWeight = style.fontWeight as React.CSSProperties['fontWeight'];
  }
  if (typeof style.fontStyle === 'string') {
    css.fontStyle = style.fontStyle as React.CSSProperties['fontStyle'];
  }
  if (style.letterSpacing != null) css.letterSpacing = toPx(style.letterSpacing);
  if (style.lineHeight != null) css.lineHeight = toPx(style.lineHeight);
  if (typeof style.textAlign === 'string') {
    css.textAlign = style.textAlign as React.CSSProperties['textAlign'];
  }

  // misc
  if (typeof style.opacity === 'number') css.opacity = style.opacity;
  if (typeof style.overflow === 'string') {
    css.overflow = style.overflow as React.CSSProperties['overflow'];
  }

  return css;
}

export function flattenRnStyle(style: unknown): StyleObject {
  return (StyleSheet.flatten(style as never) ?? {}) as StyleObject;
}
