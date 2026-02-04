import * as React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle
} from 'react-native';

export type DemoScreenScrollProps = Omit<ScrollViewProps, 'contentContainerStyle'> & {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function DemoScreenScroll({
  children,
  keyboardShouldPersistTaps = 'handled',
  contentContainerStyle,
  ...rest
}: DemoScreenScrollProps) {
  return (
    <ScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerStyle={contentContainerStyle}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
