import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FormattedNumberInput } from '../FormattedNumberInput';
import {
  type Permutation,
  type Platform,
  getFormattedNumberInputPropsForPermutation,
  getPermutationLabel,
  getTestIdForPermutation,
} from './permutations';

const E2E_SET_VALUE = 1234.987654321;

export function PermutationCard({
  perm,
  platform,
  inputStyle,
}: {
  perm: Permutation;
  platform: Platform;
  inputStyle: TextInputProps['style'];
}) {
  const [value, setValue] = useState(1234567.89);
  const props = getFormattedNumberInputPropsForPermutation(perm);
  const label = getPermutationLabel(perm, platform);
  const testId = getTestIdForPermutation(perm);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <FormattedNumberInput
        value={value}
        onChangeNumber={setValue}
        placeholder="Type here"
        style={inputStyle}
        {...props}
      />
      <View style={styles.actions}>
        <Pressable
          onPress={() => setValue(E2E_SET_VALUE)}
          style={styles.setButton}
          testID={testId ? `${testId}__set` : undefined}
        >
          <Text style={styles.setButtonText}>Set</Text>
        </Pressable>
        <Text
          style={styles.value}
          testID={testId ? `${testId}__value` : undefined}
        >
          value: {JSON.stringify(value)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#181818',
  },
  label: {
    fontSize: 11,
    opacity: 0.65,
    marginBottom: 8,
    fontFamily: 'monospace',
    color: '#ccc',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  setButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#4a90d9',
  },
  setButtonText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#fff',
  },
  value: {
    fontSize: 11,
    opacity: 0.8,
    fontFamily: 'monospace',
    color: '#ccc',
  },
});
