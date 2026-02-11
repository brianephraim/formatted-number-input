import { TextInput, View } from 'react-native';

/* ------------------------------------------------------------------ */
/*  Option definitions                                                 */
/* ------------------------------------------------------------------ */

type OptionDef = {
  label: string;
  platform: 'all' | 'web';
  values: Record<string, string>;
};

export const OPTIONS: Record<string, OptionDef> = {
  inputComponent: {
    label: 'inputComponent',
    platform: 'web',
    values: {
      html: 'HTML <input>',
      rn: 'RN TextInput',
    },
  },
  wrapperComponent: {
    label: 'wrapperComponent',
    platform: 'web',
    values: {
      html: 'HTML <div>',
      rn: 'RN View',
    },
  },
  maxDecimalPlaces: {
    label: 'maxDecimalPlaces',
    platform: 'all',
    values: {
      none: 'undefined',
      '2': '2',
      '5': '5',
    },
  },
  decimalRoundingMode: {
    label: 'decimalRoundingMode',
    platform: 'all',
    values: {
      displayAndOutput: 'displayAndOutput',
      displayOnly: 'displayOnly',
    },
  },
  formatDisplay: {
    label: 'formatDisplay',
    platform: 'all',
    values: {
      none: 'undefined (default)',
      bananas: 'banana emoji separators',
    },
  },
  showCommasWhileEditing: {
    label: 'showCommasWhileEditing',
    platform: 'all',
    values: {
      true: 'true',
      false: 'false',
    },
  },
};

export type OptionKey = string;

/* ------------------------------------------------------------------ */
/*  Permutation type                                                    */
/* ------------------------------------------------------------------ */

export type Permutation = {
  inputComponent: 'html' | 'rn';
  wrapperComponent: 'html' | 'rn';
  maxDecimalPlaces: 'none' | '2' | '5';
  decimalRoundingMode: 'displayAndOutput' | 'displayOnly';
  formatDisplay: 'none' | 'bananas';
  showCommasWhileEditing: 'true' | 'false';
};

/* ------------------------------------------------------------------ */
/*  Platform-aware option filtering                                    */
/* ------------------------------------------------------------------ */

export type Platform = 'web' | 'native';

export function getOptionsForPlatform(platform: Platform): Record<string, OptionDef> {
  const result: Record<string, OptionDef> = {};
  for (const [key, opt] of Object.entries(OPTIONS)) {
    if (opt.platform === 'all' || opt.platform === platform) {
      result[key] = opt;
    }
  }
  return result;
}

export function getOptionKeys(platform: Platform): OptionKey[] {
  return Object.keys(getOptionsForPlatform(platform));
}

/* ------------------------------------------------------------------ */
/*  Checked-state helpers                                              */
/* ------------------------------------------------------------------ */

export type CheckedState = Record<string, Set<string>>;

export function defaultCheckedState(platform: Platform): CheckedState {
  const opts = getOptionsForPlatform(platform);
  const result: CheckedState = {};
  for (const key of Object.keys(opts)) {
    result[key] = new Set(Object.keys(opts[key].values));
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Permutation generator                                              */
/* ------------------------------------------------------------------ */

export function generatePermutations(checked: CheckedState, platform: Platform): Permutation[] {
  const keys = getOptionKeys(platform);
  const arrays = keys.map((k) => [...(checked[k] ?? [])]);

  const results: Permutation[] = [];
  function recurse(depth: number, current: Record<string, string>) {
    if (depth === keys.length) {
      // For native platform, force rn adapters
      const perm = { ...current } as Record<string, string>;
      if (platform === 'native') {
        perm.inputComponent = 'rn';
        perm.wrapperComponent = 'rn';
      }
      results.push(perm as unknown as Permutation);
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

export const bananaFormat = (n: number): string =>
  n.toLocaleString('en-US', { maximumFractionDigits: 20 }).replace(/,/g, '\u{1F34C}');

/* ------------------------------------------------------------------ */
/*  Map a Permutation to NumberInput props                              */
/* ------------------------------------------------------------------ */

export function getNumberInputPropsForPermutation(perm: Permutation): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  if (perm.inputComponent === 'rn') props.inputComponent = TextInput;
  if (perm.wrapperComponent === 'rn') props.wrapperComponent = View;
  if (perm.maxDecimalPlaces !== 'none') props.maxDecimalPlaces = Number(perm.maxDecimalPlaces);
  props.decimalRoundingMode = perm.decimalRoundingMode;
  if (perm.formatDisplay === 'bananas') props.formatDisplay = bananaFormat;
  props.showCommasWhileEditing = perm.showCommasWhileEditing === 'true';

  return props;
}

/* ------------------------------------------------------------------ */
/*  Label builder                                                      */
/* ------------------------------------------------------------------ */

export function getPermutationLabel(perm: Permutation, platform: Platform): string {
  const parts: string[] = [];
  if (platform === 'web') {
    parts.push(`input: ${perm.inputComponent}`);
    parts.push(`wrapper: ${perm.wrapperComponent}`);
  }
  parts.push(`maxDec: ${perm.maxDecimalPlaces}`);
  parts.push(`rounding: ${perm.decimalRoundingMode}`);
  parts.push(`format: ${perm.formatDisplay}`);
  parts.push(`liveCommas: ${perm.showCommasWhileEditing}`);
  return parts.join(' | ');
}

/* ------------------------------------------------------------------ */
/*  Query-param helpers (web only, but pure functions)                 */
/* ------------------------------------------------------------------ */

export function parseCheckedFromParams(
  searchParams: URLSearchParams,
  platform: Platform,
): CheckedState {
  const opts = getOptionsForPlatform(platform);
  const result: CheckedState = {};
  for (const key of Object.keys(opts)) {
    const raw = searchParams.get(key);
    if (raw) {
      result[key] = new Set(raw.split(','));
    } else {
      result[key] = new Set(Object.keys(opts[key].values));
    }
  }
  return result;
}

export function checkedToParams(checked: CheckedState, platform: Platform): Record<string, string> {
  const opts = getOptionsForPlatform(platform);
  const params: Record<string, string> = {};
  for (const key of Object.keys(opts)) {
    const allValues = Object.keys(opts[key].values);
    const selected = checked[key];
    if (selected.size !== allValues.length || !allValues.every((v) => selected.has(v))) {
      params[key] = [...selected].join(',');
    }
  }
  return params;
}
