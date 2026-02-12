import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PermutationsDemo } from 'formatted-number-input/src/demo';
import { DemoScreen } from './components/DemoScreen';
import { SimpleTextInputsScreen } from './components/SimpleTextInputsScreen';

type ScreenName = 'permutations' | 'simple-text-inputs';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('permutations');
  if (screen !== 'permutations') {
    return (
      <SimpleTextInputsScreen
        onGoToPermutations={() => setScreen('permutations')}
      />
    );
  }
  return (
    <DemoScreen>
      <View style={styles.container}>
        <Pressable
          style={styles.navButton}
          onPress={() => setScreen('simple-text-inputs')}
        >
          <Text style={styles.navButtonText}>
            Open simple TextInputs screen
          </Text>
        </Pressable>
        <PermutationsDemo platform="native" />
      </View>
    </DemoScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#333333',
  },
  navButton: {
    borderWidth: 1,
    borderColor: '#4a90d9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});
