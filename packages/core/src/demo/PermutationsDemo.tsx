import { useState, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  type CheckedState,
  type OptionKey,
  type Platform,
  defaultCheckedState,
  generatePermutations,
} from './permutations';
import { PermutationCard } from './PermutationCard';
import { PermutationControls } from './PermutationControls';

export type PermutationsDemoProps = {
  platform: Platform;
  initialChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  scrollable?: boolean;
};

export function PermutationsDemo({
  platform,
  initialChecked,
  onCheckedChange,
  scrollable = true,
}: PermutationsDemoProps) {
  const [checked, setChecked] = useState<CheckedState>(
    () => initialChecked ?? defaultCheckedState(platform),
  );

  const handleChange = useCallback(
    (optionKey: OptionKey, value: string, on: boolean) => {
      setChecked((prev) => {
        const set = new Set(prev[optionKey]);
        if (on) set.add(value);
        else set.delete(value);
        const next = { ...prev, [optionKey]: set };
        onCheckedChange?.(next);
        return next;
      });
    },
    [onCheckedChange],
  );

  const permutations = useMemo(
    () => generatePermutations(checked, platform),
    [checked, platform],
  );

  const content = (
    <View style={styles.container}>
      <Text style={styles.title}>Permutations</Text>

      <PermutationControls
        platform={platform}
        checked={checked}
        onChange={handleChange}
      />

      <Text style={styles.count}>
        Showing {permutations.length} permutation{permutations.length !== 1 ? 's' : ''}
      </Text>

      {permutations.map((perm) => (
        <PermutationCard
          key={JSON.stringify(perm)}
          perm={perm}
          platform={platform}
        />
      ))}
    </View>
  );

  if (!scrollable) return content;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#eee',
    marginBottom: 16,
  },
  count: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 12,
    color: '#ccc',
  },
});
