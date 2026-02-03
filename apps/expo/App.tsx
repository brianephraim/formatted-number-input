import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NumberInput } from '@rn-number-input/core';

export default function App() {
  const [value, setValue] = React.useState(1234.56);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>RN Number Input</Text>
        <NumberInput
          value={value}
          onChangeNumber={setValue}
          inputComponent={TextInput}
          wrapperComponent={View}
          maxDecimalPlaces={2}
          style={styles.input}
          placeholder="Enter a number"
        />
        <Text style={styles.value}>Current value: {value}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F2'
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#9AA0A6',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 18
  },
  value: {
    fontSize: 16,
    color: '#333333'
  }
});
