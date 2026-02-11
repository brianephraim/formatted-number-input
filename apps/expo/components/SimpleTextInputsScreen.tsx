import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export type SimpleTextInputsScreenProps = {
  onGoToPermutations: () => void;
};

type InputConfig = {
  label: string;
  placeholder: string;
  defaultValue: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  inputMode?: 'text' | 'numeric' | 'decimal';
};

const INPUTS: InputConfig[] = [
  {
    label: 'Full name',
    placeholder: 'Type a full name',
    defaultValue: 'Jane Doe',
  },
  {
    label: 'City',
    placeholder: 'Type a city',
    defaultValue: '',
  },
  {
    label: 'Age',
    placeholder: 'Type age',
    defaultValue: '34',
    keyboardType: 'number-pad',
    inputMode: 'numeric',
  },
  {
    label: 'Zip code',
    placeholder: 'Type zip code',
    defaultValue: '10001',
    keyboardType: 'number-pad',
    inputMode: 'numeric',
  },
  {
    label: 'Price',
    placeholder: 'Type price',
    defaultValue: '19.99',
    keyboardType: 'decimal-pad',
    inputMode: 'decimal',
  },
  {
    label: 'Quantity',
    placeholder: 'Type quantity',
    defaultValue: '',
    keyboardType: 'number-pad',
    inputMode: 'numeric',
  },
];

export function SimpleTextInputsScreen({
  onGoToPermutations,
}: SimpleTextInputsScreenProps) {
  const [values, setValues] = useState<string[]>(() =>
    INPUTS.map((input) => input.defaultValue)
  );

  const updateValue = (index: number, next: string) => {
    setValues((prev) => prev.map((value, i) => (i === index ? next : value)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple TextInputs</Text>

      <Pressable style={styles.navButton} onPress={onGoToPermutations}>
        <Text style={styles.navButtonText}>Go to permutations screen</Text>
      </Pressable>

      {values.map((value, index) => {
        const config = INPUTS[index];
        return (
          <View key={config.label} style={styles.field}>
            <Text style={styles.label}>{config.label}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(next) => updateValue(index, next)}
              placeholder={config.placeholder}
              keyboardType={config.keyboardType ?? 'default'}
              inputMode={config.inputMode ?? 'text'}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
    marginBottom: 6,
  },
  navButton: {
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  navButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
});
