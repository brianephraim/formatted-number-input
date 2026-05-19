import * as React from 'react';
import { flattenRnStyle, translateRnStyleToCss } from './rnStyleToCss';
import type { RNPointerEvents, WrapperComponent, WrapperProps } from './types';

function mapPointerEvents(
  pointerEvents: RNPointerEvents | undefined
): React.CSSProperties['pointerEvents'] {
  if (pointerEvents === 'none') return 'none';
  // RN's box-none/box-only aren't directly representable in CSS without extra wrappers.
  return 'auto';
}

export const DivWrapper: WrapperComponent = ({
  children,
  style,
  pointerEvents,
}: WrapperProps) => {
  const flat = flattenRnStyle(style);
  const css = translateRnStyleToCss(flat);
  if (pointerEvents != null)
    css.pointerEvents = mapPointerEvents(pointerEvents);
  return <div style={css}>{children}</div>;
};
