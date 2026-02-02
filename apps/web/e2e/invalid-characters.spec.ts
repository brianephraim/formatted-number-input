import { expect, test } from '@playwright/test';

test('invalid characters: letters do not reappear after blur/refocus (reseeds on blur)', async ({ page }) => {
  await page.goto('/');

  const input = page.getByTestId('number-input-default-html');
  const display = page.getByTestId('number-input-default-html__display');

  // Focus through overlay.
  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  // Type a mix; while focused, the uncontrolled input will contain it.
  await input.fill('12abc34');

  // Blur so overlay is visible again.
  await page.click('h1');
  await expect(display).toBeVisible();

  // Refocus; the typing input should be reseeded from controlled value (letters removed).
  await display.click();
  await expect(input).toBeFocused();

  await expect(input).toHaveValue('1234');
});
