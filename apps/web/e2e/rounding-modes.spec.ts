import { expect, test } from '@playwright/test';

test('rounding: displayAndOutput rounds the emitted value as you type', async ({
  page,
}) => {
  await page.goto('/');

  const input = page.getByTestId('number-input-decimals-html');
  const display = page.getByTestId('number-input-decimals-html__display');
  const readout = page.getByTestId('number-input-decimals-html__value');

  // Focus through display overlay.
  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  // Type a value with many decimals.
  await input.fill('1.239999999');

  // In displayAndOutput mode, value should be rounded to 2 decimals.
  await expect(readout).toContainText('1.24');
});

test('rounding: displayOnly does not round the emitted value (but overlay will round on blur)', async ({
  page,
}) => {
  await page.goto('/');

  const input = page.getByTestId('number-input-displayonly-html');
  const display = page.getByTestId('number-input-displayonly-html__display');
  const readout = page.getByTestId('number-input-displayonly-html__value');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.fill('1.239999999');

  // In displayOnly mode, the controlled value readout should keep the full precision.
  await expect(readout).toContainText('1.239999999');

  // Blur back to show overlay; it should display rounded value.
  await page.click('h1');
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(/1\.24|1\.23/);
});
