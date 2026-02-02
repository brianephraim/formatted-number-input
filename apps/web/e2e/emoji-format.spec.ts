import { expect, test } from '@playwright/test';

test('caret mapping: emoji-separated display forwards focus to typing input', async ({ page }) => {
  await page.goto('/');

  const display = page.getByTestId('number-input-emoji-html__display');
  const typing = page.getByTestId('number-input-emoji-html');

  await expect(display).toBeVisible();

  // Click somewhere in the display value; we mainly want to ensure focus forwarding works
  // even with non-digit separators in the formatted string.
  const box = await display.boundingBox();
  expect(box).not.toBeNull();

  await display.click({ position: { x: box!.width / 2, y: box!.height / 2 } });
  await expect(typing).toBeFocused();

  const selectionStart = await typing.evaluate((el) => (el as HTMLInputElement).selectionStart);
  expect(selectionStart).not.toBeNull();
});
