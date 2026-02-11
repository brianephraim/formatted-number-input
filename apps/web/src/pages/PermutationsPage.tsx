import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PermutationsDemo,
  type CheckedState,
  parseCheckedFromParams,
  checkedToParams,
} from '@rn-number-input/core/demo';

export default function PermutationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialChecked = useMemo(
    () => parseCheckedFromParams(searchParams, 'web'),
    // Only compute once on mount — URL params are the initial state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleCheckedChange = useCallback(
    (checked: CheckedState) => {
      setSearchParams(checkedToParams(checked, 'web'), { replace: true });
    },
    [setSearchParams],
  );

  return (
    <PermutationsDemo
      platform="web"
      initialChecked={initialChecked}
      onCheckedChange={handleCheckedChange}
    />
  );
}
