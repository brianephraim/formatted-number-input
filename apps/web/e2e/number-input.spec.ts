import { expect, test } from '@playwright/test';

test('default row: controlled set button updates readout and overlay toggles on focus/blur (html adapters)', async ({
  page,
}) => {
  await page.goto('/');

  const input = page.getByTestId('number-input-default-html').first();
  const display = page
    .getByTestId('number-input-default-html__display')
    .first();
  const setBtn = page.getByTestId('number-input-default-html__set').first();
  const readout = page.getByTestId('number-input-default-html__value').first();

  // Initially blurred: display overlay should exist
  await expect(display).toBeVisible();

  await setBtn.click();
  await expect(readout).toContainText('1234.987654321');

  // Click the display overlay (it's on top while blurred). It should forward focus
  // to the real typing input and unmount the overlay.
  await display.click();
  await expect(input).toBeFocused();
  await expect(display).toHaveCount(0);

  // Blur should bring overlay back
  await page.getByTestId('permutations-title').click();
  await expect(display).toBeVisible();
});

test('caret mapping: clicking display roughly maps to typing selectionStart (comma formatted, right-aligned)', async ({
  page,
}) => {
  await page.goto('/');

  const display = page
    .getByTestId('number-input-fixedwidth-html__display')
    .first();
  const typing = page.getByTestId('number-input-fixedwidth-html').first();

  // Ensure blurred overlay is visible
  await expect(display).toBeVisible();

  // Click near the left side of the overlay text area.
  const box = await display.boundingBox();
  expect(box).not.toBeNull();

  // A click a bit in from the left edge should map to a caret near the start,
  // not always at the end.
  await display.click({ position: { x: 10, y: box!.height / 2 } });

  await expect(typing).toBeFocused({ timeout: 10_000 });

  const selectionStart = await typing.evaluate(
    (el) => (el as HTMLInputElement).selectionStart
  );
  expect(selectionStart).not.toBeNull();

  // We keep this loose because font metrics vary.
  // The key regression we want to avoid is always ending up at the end.
  const valueLen = await typing.evaluate(
    (el) => (el as HTMLInputElement).value.length
  );
  expect(selectionStart!).toBeLessThan(valueLen);
});
