import { expect, test } from '@playwright/test';

test('live commas: typing in the middle keeps caret near insertion point', async ({
  page,
}) => {
  await page.goto('/');

  const input = page.getByTestId('number-input-livecommas-html');

  await expect(input).toBeVisible();
  await input.click();
  await expect(input).toBeFocused();

  // Seed with a value that formats with commas while editing.
  await input.fill('1234567');

  // Put caret near the start and type into the middle.
  await input.click({ position: { x: 12, y: 10 } });
  await page.keyboard.type('9');

  const selectionStart = await input.evaluate(
    (el) => (el as HTMLInputElement).selectionStart
  );
  const valueLen = await input.evaluate(
    (el) => (el as HTMLInputElement).value.length
  );

  expect(selectionStart).not.toBeNull();
  expect(selectionStart!).toBeLessThan(valueLen);
});
