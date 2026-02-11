import * as React from 'react';
import { SafeAreaView, StyleProp, ViewStyle } from 'react-native';

export type DemoScreenShellProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function DemoScreenShell({ children, style }: DemoScreenShellProps) {
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: '#F5F5F2',
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
