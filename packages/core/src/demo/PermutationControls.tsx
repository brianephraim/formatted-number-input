import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  type CheckedState,
  type OptionKey,
  type Platform,
  getOptionsForPlatform,
} from './permutations';

function Checkbox({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.checkbox, value && styles.checkboxChecked]}
    >
      {value && <Text style={styles.checkmark}>{'\u2713'}</Text>}
    </Pressable>
  );
}

function OptionGroup({
  optionKey,
  label,
  values,
  checked,
  onChange,
}: {
  optionKey: OptionKey;
  label: string;
  values: Record<string, string>;
  checked: Set<string>;
  onChange: (optionKey: OptionKey, value: string, on: boolean) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      {Object.entries(values).map(([val, display]) => {
        const isOn = checked.has(val);
        return (
          <Pressable
            key={val}
            style={styles.row}
            onPress={() => onChange(optionKey, val, !isOn)}
          >
            <Checkbox value={isOn} onToggle={() => onChange(optionKey, val, !isOn)} />
            <Text style={styles.rowLabel}>{display}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function PermutationControls({
  platform,
  checked,
  onChange,
}: {
  platform: Platform;
  checked: CheckedState;
  onChange: (optionKey: OptionKey, value: string, on: boolean) => void;
}) {
  const opts = getOptionsForPlatform(platform);

  return (
    <View style={styles.container}>
      {Object.entries(opts).map(([key, opt]) => (
        <OptionGroup
          key={key}
          optionKey={key}
          label={opt.label}
          values={opt.values}
          checked={checked[key] ?? new Set()}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  group: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 6,
    padding: 10,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
    color: '#ccc',
    marginBottom: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#4a90d9',
    borderColor: '#4a90d9',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  rowLabel: {
    fontSize: 13,
    color: '#ccc',
  },
});
