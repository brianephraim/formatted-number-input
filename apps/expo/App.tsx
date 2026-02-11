import { SafeAreaView, StyleSheet } from 'react-native';
import { PermutationsDemo } from '@rn-number-input/core/src/demo';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <PermutationsDemo platform="native" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});
