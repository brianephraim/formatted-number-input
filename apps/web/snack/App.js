import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FormattedNumberInput } from './formatted-number-input/src/FormattedNumberInput';

export default function App() {
  const [overlayValue, setOverlayValue] = useState(1234567.89);
  const [liveValue, setLiveValue] = useState(9876543.21);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>Expo Snack Demo</Text>
      <Text style={styles.title}>formatted-number-input</Text>
      <Text style={styles.copy}>
        This Snack is built from source files in the repository instead of the
        published npm package.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Overlay mode (default)</Text>
        <FormattedNumberInput
          value={overlayValue}
          onChangeNumber={setOverlayValue}
          inputComponent={TextInput}
          wrapperComponent={View}
          style={styles.input}
          placeholder="Enter amount"
        />
        <Text style={styles.value}>value: {String(overlayValue)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Live formatting with 2 decimals</Text>
        <FormattedNumberInput
          value={liveValue}
          onChangeNumber={setLiveValue}
          inputComponent={TextInput}
          wrapperComponent={View}
          style={styles.input}
          placeholder="Enter amount"
          showCommasWhileEditing
          maxDecimalPlaces={2}
        />
        <Text style={styles.value}>value: {String(liveValue)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#0f172a',
  },
  eyebrow: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  copy: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    backgroundColor: '#111827',
    color: '#f8fafc',
    fontSize: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  value: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
  },
});
