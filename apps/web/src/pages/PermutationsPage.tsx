import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NumberInput } from '@rn-number-input/core';
import { TextInput, View } from 'react-native';

/* ------------------------------------------------------------------ */
/*  Option definitions                                                 */
/* ------------------------------------------------------------------ */

const OPTIONS = {
  inputComponent: {
    label: 'inputComponent',
    values: {
      html: 'HTML <input>',
      rn: 'RN TextInput',
    },
  },
  wrapperComponent: {
    label: 'wrapperComponent',
    values: {
      html: 'HTML <div>',
      rn: 'RN View',
    },
  },
  maxDecimalPlaces: {
    label: 'maxDecimalPlaces',
    values: {
      none: 'undefined',
      '2': '2',
      '5': '5',
    },
  },
  decimalRoundingMode: {
    label: 'decimalRoundingMode',
    values: {
      displayAndOutput: 'displayAndOutput',
      displayOnly: 'displayOnly',
    },
  },
  formatDisplay: {
    label: 'formatDisplay',
    values: {
      none: 'undefined (default)',
      bananas: 'banana emoji separators',
    },
  },
  showCommasWhileEditing: {
    label: 'showCommasWhileEditing',
    values: {
      true: 'true',
      false: 'false',
    },
  },
} as const;

type OptionKey = keyof typeof OPTIONS;

/* ------------------------------------------------------------------ */
/*  Query-param helpers                                                */
/* ------------------------------------------------------------------ */

function parseChecked(searchParams: URLSearchParams): Record<string, Set<string>> {
  const result: Record<string, Set<string>> = {};
  for (const key of Object.keys(OPTIONS) as OptionKey[]) {
    const raw = searchParams.get(key);
    if (raw) {
      result[key] = new Set(raw.split(','));
    } else {
      // default: all checked
      result[key] = new Set(Object.keys(OPTIONS[key].values));
    }
  }
  return result;
}

function checkedToParams(checked: Record<string, Set<string>>): Record<string, string> {
  const params: Record<string, string> = {};
  for (const key of Object.keys(OPTIONS) as OptionKey[]) {
    const allValues = Object.keys(OPTIONS[key].values);
    const selected = checked[key];
    // only write param if not all selected (all = default)
    if (selected.size !== allValues.length || !allValues.every((v) => selected.has(v))) {
      params[key] = [...selected].join(',');
    }
  }
  return params;
}

/* ------------------------------------------------------------------ */
/*  Permutation generator                                              */
/* ------------------------------------------------------------------ */

type Permutation = {
  inputComponent: 'html' | 'rn';
  wrapperComponent: 'html' | 'rn';
  maxDecimalPlaces: 'none' | '2' | '5';
  decimalRoundingMode: 'displayAndOutput' | 'displayOnly';
  formatDisplay: 'none' | 'bananas';
  showCommasWhileEditing: 'true' | 'false';
};

function generatePermutations(checked: Record<string, Set<string>>): Permutation[] {
  const keys = Object.keys(OPTIONS) as OptionKey[];
  const arrays = keys.map((k) => [...checked[k]]);

  const results: Permutation[] = [];
  function recurse(depth: number, current: Record<string, string>) {
    if (depth === keys.length) {
      results.push(current as unknown as Permutation);
      return;
    }
    const key = keys[depth];
    for (const val of arrays[depth]) {
      recurse(depth + 1, { ...current, [key]: val });
    }
  }
  recurse(0, {});
  return results;
}

/* ------------------------------------------------------------------ */
/*  Banana formatDisplay                                               */
/* ------------------------------------------------------------------ */

const bananaFormat = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 20 }).replace(/,/g, '🍌');

/* ------------------------------------------------------------------ */
/*  Single demo card                                                   */
/* ------------------------------------------------------------------ */

function PermutationCard({ perm }: { perm: Permutation }) {
  const [value, setValue] = useState(1234567.89);

  const props: Record<string, unknown> = {};

  if (perm.inputComponent === 'rn') props.inputComponent = TextInput;
  if (perm.wrapperComponent === 'rn') props.wrapperComponent = View;
  if (perm.maxDecimalPlaces !== 'none') props.maxDecimalPlaces = Number(perm.maxDecimalPlaces);
  props.decimalRoundingMode = perm.decimalRoundingMode;
  if (perm.formatDisplay === 'bananas') props.formatDisplay = bananaFormat;
  props.showCommasWhileEditing = perm.showCommasWhileEditing === 'true';

  const label = [
    `input: ${perm.inputComponent}`,
    `wrapper: ${perm.wrapperComponent}`,
    `maxDec: ${perm.maxDecimalPlaces}`,
    `rounding: ${perm.decimalRoundingMode}`,
    `format: ${perm.formatDisplay}`,
    `liveCommas: ${perm.showCommasWhileEditing}`,
  ].join(' | ');

  return (
    <div
      style={{
        border: '1px solid #333',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        background: '#181818',
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 8, fontFamily: 'monospace' }}>
        {label}
      </div>
      <NumberInput
        value={value}
        onChangeNumber={setValue}
        placeholder="Type here"
        autoComplete="off"
        {...props}
      />
      <div
        style={{
          fontSize: 11,
          opacity: 0.8,
          marginTop: 6,
          fontFamily: 'monospace',
        }}
      >
        value: {JSON.stringify(value)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Checkbox group                                                     */
/* ------------------------------------------------------------------ */

function CheckboxGroup({
  optionKey,
  checked,
  onChange,
}: {
  optionKey: OptionKey;
  checked: Set<string>;
  onChange: (optionKey: OptionKey, value: string, on: boolean) => void;
}) {
  const opt = OPTIONS[optionKey];
  return (
    <fieldset
      style={{
        border: '1px solid #444',
        borderRadius: 6,
        padding: '6px 10px',
        margin: 0,
        minWidth: 0,
      }}
    >
      <legend style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>
        {opt.label}
      </legend>
      {(Object.entries(opt.values) as [string, string][]).map(([val, display]) => (
        <label
          key={val}
          style={{ display: 'block', fontSize: 13, cursor: 'pointer', padding: '2px 0' }}
        >
          <input
            type="checkbox"
            checked={checked.has(val)}
            onChange={(e) => onChange(optionKey, val, e.target.checked)}
            style={{ marginRight: 6 }}
          />
          {display}
        </label>
      ))}
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function PermutationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const checked = useMemo(() => parseChecked(searchParams), [searchParams]);

  const handleChange = useCallback(
    (optionKey: OptionKey, value: string, on: boolean) => {
      const next = { ...checked };
      const set = new Set(next[optionKey]);
      if (on) set.add(value);
      else set.delete(value);
      // don't allow empty
      if (set.size === 0) return;
      next[optionKey] = set;
      setSearchParams(checkedToParams(next), { replace: true });
    },
    [checked, setSearchParams],
  );

  const permutations = useMemo(() => generatePermutations(checked), [checked]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Permutations</h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {(Object.keys(OPTIONS) as OptionKey[]).map((key) => (
          <CheckboxGroup key={key} optionKey={key} checked={checked[key]} onChange={handleChange} />
        ))}
      </div>

      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
        Showing {permutations.length} permutation{permutations.length !== 1 ? 's' : ''}
      </div>

      {permutations.map((perm) => (
        <PermutationCard key={JSON.stringify(perm)} perm={perm} />
      ))}
    </div>
  );
}
