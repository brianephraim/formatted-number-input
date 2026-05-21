import { useMemo, useCallback } from 'react';
import {
  PermutationsDemo,
  type CheckedState,
  parseCheckedFromParams,
  checkedToParams,
} from 'formatted-number-input/demo';

export default function PermutationsPage() {
  const initialChecked = useMemo(
    () =>
      parseCheckedFromParams(
        new URLSearchParams(window.location.search),
        'web'
      ),
    // Only compute once on mount — URL params are the initial state.
    []
  );

  const handleCheckedChange = useCallback((checked: CheckedState) => {
    const next = checkedToParams(checked, 'web');
    const nextUrl = `${window.location.pathname}?${next.toString()}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, []);

  return (
    <PermutationsDemo
      platform="web"
      initialChecked={initialChecked}
      onCheckedChange={handleCheckedChange}
    />
  );
}
