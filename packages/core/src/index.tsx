import * as React from 'react';
import { Platform, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

export type NumberInputProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType'> & {
  value: string;
  onChangeValue: (next: string) => void;
};

/**
 * Minimal cross-platform number input scaffold.
 *
 * NOTE: This intentionally stays simple while you iterate on behavior.
 * It renders via react-native-web when used on web.
 */
export function NumberInput({ value, onChangeValue, style, ...rest }: NumberInputProps) {
  return (
    <View style={styles.root}>
      <TextInput
        value={value}
        onChangeText={onChangeValue}
        keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
        inputMode={Platform.OS === 'web' ? 'numeric' : undefined}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%'
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    fontSize: 16
  }
});
