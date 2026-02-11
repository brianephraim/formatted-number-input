import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { DemoScreenShell } from './DemoScreenShell';
import { DemoScreenScroll } from './DemoScreenScroll';

export type DemoScreenProps = {
  children: React.ReactNode;

  /** ScrollView contentContainerStyle */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Called after a tap that triggers the blur side-effect. Handy for counters/telemetry. */
  onBackgroundTap?: () => void;

  /** Enable/disable blur-on-tap behavior (default: true). */
  enabledBlurOnTap?: boolean;
};

export function DemoScreen({
  children,
  contentContainerStyle,
  onBackgroundTap,
  enabledBlurOnTap = true
}: DemoScreenProps) {
  return (
    <DemoScreenShell>
      <DemoScreenScroll contentContainerStyle={contentContainerStyle}>

          {children}
      </DemoScreenScroll>
    </DemoScreenShell>
  );
}
