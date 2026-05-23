import { useState, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  type CheckedState,
  type OptionKey,
  type Platform,
  defaultCheckedState,
  generatePermutations,
} from './permutations';
import { PermutationCard } from './PermutationCard';
import { PermutationControls } from './PermutationControls';
import {
  flattenRnStyle,
  translateRnStyleToCss,
} from '../adapters/rnStyleToCss';
import { FormattedNumberInput } from '../FormattedNumberInput';

const E2E_SET_VALUE = '1234.987654321';
const E2E_SET_LABEL = `Set ${E2E_SET_VALUE}`;

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

function ControlledHtmlTextInputExample({
  platform,
  inputStyle,
}: {
  platform: Platform;
  inputStyle: typeof sharedInputStyle;
}) {
  const [canonValue, setCanonValue] = useState('1234567.89');
  const [numberizedCanonValue, setNumberizedCanonValue] = useState(+canonValue);

  const emitNumberChange = useCallback((nextValue: number) => {
    setNumberizedCanonValue(nextValue);
  }, []);

  const setCanonValueAndEmitNumber = useCallback(
    (nextCanonValue: string) => {
      setCanonValue(nextCanonValue);
      emitNumberChange(+nextCanonValue);
    },
    [emitNumberChange]
  );

  if (platform !== 'web') return null;

  const htmlCssStyle = {
    ...translateRnStyleToCss(flattenRnStyle(inputStyle)),
    boxSizing: 'border-box' as const,
    color: '#ff6fb1',
  };
  return (
    <View style={styles.examplesContainer}>
      <Text style={styles.examplesTitle}>Controlled HTML text input</Text>
      <View style={styles.card}>
        <Text style={styles.label}>
          {'Basic controlled HTML <input type="text" />'}
        </Text>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Type here"
          value={canonValue}
          onChange={(event) =>
            setCanonValueAndEmitNumber(event.currentTarget.value)
          }
          style={htmlCssStyle}
          data-testid="controlled-html-text-input"
        />
        <View style={styles.actions}>
          <Pressable
            onPress={() => setCanonValueAndEmitNumber(E2E_SET_VALUE)}
            style={styles.setButton}
            testID="controlled-html-text-input__set"
          >
            <Text style={styles.setButtonText}>{E2E_SET_LABEL}</Text>
          </Pressable>
          <Text
            style={styles.value}
            testID="controlled-html-text-input__canonValue"
          >
            canonValue: {JSON.stringify(canonValue)}
          </Text>
          <Text
            style={styles.value}
            testID="controlled-html-text-input__number"
          >
            numberizedCanonValue: {JSON.stringify(numberizedCanonValue)}
          </Text>
          <Text
            style={styles.value}
            testID="controlled-html-text-input__roundtrip"
          >
            String(numberizedCanonValue):{' '}
            {JSON.stringify(String(numberizedCanonValue))}
          </Text>
        </View>
      </View>
    </View>
  );
}

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
          <Text style={styles.label}>
            {'Basic HTML <input type="number" />'}
          </Text>
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

function UncontrolledFormattedNumberInputExamples({
  platform,
  inputStyle,
}: {
  platform: Platform;
  inputStyle: typeof sharedInputStyle;
}) {
  const [liveEmittedNumber, setLiveEmittedNumber] = useState<number | null>(
    null
  );
  const [overlayEmittedNumber, setOverlayEmittedNumber] = useState<
    number | null
  >(null);

  if (platform !== 'web') return null;

  return (
    <View style={styles.examplesContainer}>
      <Text style={styles.examplesTitle}>
        Uncontrolled formatted-number-input examples
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          {'defaultValue only | RN TextInput | liveCommas: true'}
        </Text>
        <FormattedNumberInput
          defaultValue={1234567.89}
          onChangeNumber={setLiveEmittedNumber}
          inputComponent={TextInput}
          maxDecimalPlaces={undefined}
          decimalRoundingMode="displayAndOutput"
          showCommasWhileEditing
          placeholder="Type here"
          style={inputStyle}
          testID="uncontrolled-live-rn"
          debugPrecision
        />
        <Text style={styles.value} testID="uncontrolled-live-rn__value">
          emitted number: {JSON.stringify(liveEmittedNumber)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          {'defaultValue only | RN TextInput | liveCommas: false'}
        </Text>
        <FormattedNumberInput
          defaultValue={1234567.89}
          onChangeNumber={setOverlayEmittedNumber}
          inputComponent={TextInput}
          maxDecimalPlaces={undefined}
          decimalRoundingMode="displayAndOutput"
          showCommasWhileEditing={false}
          placeholder="Type here"
          style={inputStyle}
          testID="uncontrolled-overlay-rn"
          debugPrecision
        />
        <Text style={styles.value} testID="uncontrolled-overlay-rn__value">
          emitted number: {JSON.stringify(overlayEmittedNumber)}
        </Text>
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
    () => initialChecked ?? defaultCheckedState(platform)
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
    [onCheckedChange]
  );

  const permutations = useMemo(
    () => generatePermutations(checked, platform),
    [checked, platform]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="permutations-title">
        Permutations
      </Text>

      <ControlledHtmlTextInputExample
        platform={platform}
        inputStyle={sharedInputStyle}
      />

      <PermutationControls
        platform={platform}
        checked={checked}
        onChange={handleChange}
      />

      <BaseInputExamples platform={platform} inputStyle={sharedInputStyle} />

      <UncontrolledFormattedNumberInputExamples
        platform={platform}
        inputStyle={sharedInputStyle}
      />

      <Text style={styles.count}>
        Showing {permutations.length} permutation
        {permutations.length !== 1 ? 's' : ''}
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  setButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#4a90d9',
  },
  setButtonText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#fff',
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
