# Plan: Live Commas RN Web Caret

## Goal

Make sequential typing in the React Native Web input path behave normally in `showCommasWhileEditing` mode so `1234` becomes `1,234`, not `4,321`.

## Reproduction

1. Open the web demo with `inputComponent=rn`, `wrapperComponent=html`, and `showCommasWhileEditing=true`.
2. Focus the input, select the existing value, and type `1234`.
3. Observe that the caret stays at the start and the text builds backwards.

## Root-Cause Hypothesis

Live mode can set selection on React Native Web inputs, but it does not read the current caret position from the DOM-backed ref. That leaves the next caret calculation to fall back to stale selection state.

## Fix Approach

1. Read `selectionStart` from both adapter-style refs and DOM-backed React Native Web refs.
2. Route live-mode caret math through that safe selection helper everywhere selection is read.
3. Keep the existing comma-skipping delete behavior intact.

## Verification

1. Add a targeted web e2e regression on the isolated RN-web permutation.
2. Add a small unit test covering selection reads from DOM-style refs.
3. Re-run the scenario in the browser and confirm the caret advances to the end after each keypress.
