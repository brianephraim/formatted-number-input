import { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  type CheckedState,
  type OptionKey,
  type Platform,
  defaultCheckedState,
  generatePermutations,
} from './permutations';
import { PermutationCard } from './PermutationCard';
import { PermutationControls } from './PermutationControls';
import { flattenRnStyle, translateRnStyleToCss } from '../adapters/rnStyleToCss';

/** Shared style for all inputs so FormattedNumberInput and base inputs render identically. */
const sharedInputStyle = {
  width: '100%' as const,
  borderWidth: 1,
  borderColor: '#999',
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 12,
  fontSize: 16,
  color: '#eee',
  backgroundColor: 'transparent',
};

export type PermutationsDemoProps = {
  platform: Platform;
  initialChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
};

function BaseInputExamples({
  platform,
  inputStyle,
}: {
  platform: Platform;
  inputStyle: typeof sharedInputStyle;
}) {
  const [htmlValue, setHtmlValue] = useState('1234567.89');
  const [rnValue, setRnValue] = useState('1234567.89');

  const htmlCssStyle = {
    ...translateRnStyleToCss(flattenRnStyle(inputStyle)),
    boxSizing: 'border-box' as const,
  };

  return (
    <View style={styles.examplesContainer}>
      <Text style={styles.examplesTitle}>Base input examples</Text>

      {platform === 'web' ? (
        <View style={styles.card}>
          <Text style={styles.label}>{'Basic HTML <input type="number" />'}</Text>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="Type here"
            value={htmlValue}
            onChange={(event) => setHtmlValue(event.currentTarget.value)}
            style={htmlCssStyle}
          />
          <Text style={styles.value}>value: {JSON.stringify(htmlValue)}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.label}>
          {platform === 'web'
            ? 'Basic RN TextInput (react-native-web)'
            : 'Basic RN TextInput'}
        </Text>
        <TextInput
          value={rnValue}
          onChangeText={setRnValue}
          placeholder="Type here"
          keyboardType={platform === 'web' ? undefined : 'decimal-pad'}
          inputMode={platform === 'web' ? 'decimal' : undefined}
          style={inputStyle}
        />
        <Text style={styles.value}>value: {JSON.stringify(rnValue)}</Text>
      </View>
    </View>
  );
}

export function PermutationsDemo({
  platform,
  initialChecked,
  onCheckedChange,
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permutations</Text>

      <PermutationControls
        platform={platform}
        checked={checked}
        onChange={handleChange}
      />

      <BaseInputExamples platform={platform} inputStyle={sharedInputStyle} />

      <Text style={styles.count}>
        Showing {permutations.length} permutation{permutations.length !== 1 ? 's' : ''}
      </Text>

      {permutations.map((perm) => (
        <PermutationCard
          key={JSON.stringify(perm)}
          perm={perm}
          platform={platform}
          inputStyle={sharedInputStyle}
        />
      ))}
    </View>
  );  
}

const styles = StyleSheet.create({
  scroll: {
    borderColor: '#4a90d9',
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
  examplesContainer: {
    marginBottom: 12,
  },
  examplesTitle: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#ccc',
    opacity: 0.85,
    marginBottom: 8,
  },
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
