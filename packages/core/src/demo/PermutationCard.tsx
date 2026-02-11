import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NumberInput } from '../NumberInput';
import {
  type Permutation,
  type Platform,
  getNumberInputPropsForPermutation,
  getPermutationLabel,
} from './permutations';

export function PermutationCard({
  perm,
  platform,
}: {
  perm: Permutation;
  platform: Platform;
}) {
  const [value, setValue] = useState(1234567.89);
  const props = getNumberInputPropsForPermutation(perm);
  const label = getPermutationLabel(perm, platform);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <NumberInput
        value={value}
        onChangeNumber={setValue}
        placeholder="Type here"
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
