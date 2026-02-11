import { SafeAreaView, StyleSheet } from 'react-native';
import { PermutationsDemo } from '@rn-number-input/core/src/demo';
import {DemoScreen} from './components/DemoScreen';

export default function App() {
  return (
    <DemoScreen >
      <PermutationsDemo platform="native" />
    </DemoScreen>
  );
}
