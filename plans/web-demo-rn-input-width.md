# Plan: Web Demo RN Input Width

## Goal

Make the React Native Web demo inputs fill the bordered container width in both focused and unfocused states so long values are not artificially clipped by a narrow inner field.

## Reproduction

1. Open the web demo with `inputComponent=rn`, `wrapperComponent=html`, and `showCommasWhileEditing=false`.
2. Focus the input and type a long number.
3. Observe that the focused input outline is much narrower than the full bordered container.

## Root-Cause Hypothesis

The style split intentionally keeps layout and border styles on the wrapper, but the RN-web input receives only text-and-padding styles. Unlike the HTML adapter, the RN-web input does not add its own `width: 100%`, so it shrinks to intrinsic content width.

## Fix Approach

1. Add an explicit fill-width style to the live and overlay typing inputs.
2. Preserve the existing wrapper-based border and layout ownership.
3. Verify that both the focused editor and the display overlay span the full container width.

## Verification

1. Add a web e2e width regression that compares the input width to its bordered container.
2. Re-check the isolated RN-web permutation in the browser with a long value while focused.
3. Confirm the outline aligns with the container width.
