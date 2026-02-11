import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { FormattedNumberInput } from '../FormattedNumberInput';
import {
  type Permutation,
  type Platform,
  getFormattedNumberInputPropsForPermutation,
  getPermutationLabel,
} from './permutations';

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
      <Text style={styles.value}>value: {JSON.stringify(value)}</Text>
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
  value: {
    fontSize: 11,
    opacity: 0.8,
    marginTop: 6,
    fontFamily: 'monospace',
    color: '#ccc',
  },
});
