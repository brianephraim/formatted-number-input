import * as React from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { NumberInput } from '@rn-number-input/core';

type DemoBlockProps = {
  label: string;
  initialValue: number;
  maxDecimalPlaces?: number;
  decimalRoundingMode?: 'displayAndOutput' | 'displayOnly';
  formatDisplay?: (value: number) => string;
};

function DemoBlock({
  label,
  initialValue,
  maxDecimalPlaces,
  decimalRoundingMode,
  formatDisplay
}: DemoBlockProps) {
  const [value, setValue] = React.useState(initialValue);
  const fixedValue = Number.isFinite(value) ? value.toFixed(6) : String(value);
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <NumberInput
        value={value}
        onChangeNumber={setValue}
        inputComponent={TextInput}
        wrapperComponent={View}
        maxDecimalPlaces={maxDecimalPlaces}
        decimalRoundingMode={decimalRoundingMode}
        formatDisplay={formatDisplay}
        style={styles.input}
        placeholder="Enter a number"
      />
      <Text style={styles.value}>Value: {String(value)}</Text>
      <Text style={styles.valueMuted}>Fixed(6): {fixedValue}</Text>
    </View>
  );
}

export default function App() {
  const [bgPressCount, setBgPressCount] = React.useState(0);

  const blurFocusedInput = React.useCallback(() => {
    // Works even when a hardware keyboard is connected (Keyboard.dismiss alone may do nothing).
    //
    // React Native tracks "currently focused TextInput" globally via an internal focus manager.
    // It’s exposed (somewhat oddly) as a static `TextInput.State.currentlyFocusedInput()` API.
    // We use it here to blur the active input without manually wiring refs everywhere.
    const focused = (TextInput as any).State?.currentlyFocusedInput?.();
    focused?.blur?.();
    Keyboard.dismiss();
  }, []);

  const blurFocusedInputOnTapCapture = React.useCallback(
    (e: any) => {
      // Capture-phase hook so we can blur even when the tap is handled by a child Pressable/Button.
      //
      // IMPORTANT: Don’t blur when the user is tapping *inside* the focused input (caret placement).
      const focused = (TextInput as any).State?.currentlyFocusedInput?.();
      const focusedTag = focused?._nativeTag;
      if (focused && focusedTag != null && e?.target === focusedTag) {
        return false;
      }

      blurFocusedInput();
      setBgPressCount((c) => c + 1);
      return false; // don’t steal responder; allow children (buttons, scroll) to work normally
    },
    [blurFocusedInput]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <View onStartShouldSetResponderCapture={blurFocusedInputOnTapCapture}>
          <Pressable
            onPress={() => {
              console.log("pressed button");
            }}
            style={{ padding: 10, backgroundColor: 'red' }}
          >
            <Text>Tapping this SHOULD blur the focused input</Text>
          </Pressable>

          <Text style={styles.title}>RN Number Input {bgPressCount}</Text>
          <Text style={styles.subtitle}>Tap into a field, type, blur, and compare behavior.</Text>

          <DemoBlock label="No rounding" initialValue={123.48} />
          <DemoBlock label="maxDecimalPlaces=2 (displayAndOutput)" initialValue={123.48} maxDecimalPlaces={2} />
          <DemoBlock
            label="maxDecimalPlaces=2 (displayOnly)"
            initialValue={123.48}
            maxDecimalPlaces={2}
            decimalRoundingMode="displayOnly"
          />
          <DemoBlock
            label="Custom formatDisplay"
            initialValue={1234.56}
            maxDecimalPlaces={2}
            formatDisplay={(n) => n.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          />
        </View>
      </ScrollView>
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
  subtitle: {
    fontSize: 14,
    color: '#5F6368'
  },
  block: {
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF'
  },
  label: {
    fontSize: 16,
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
  },
  valueMuted: {
    fontSize: 12,
    color: '#6B6B6B'
  }
});
