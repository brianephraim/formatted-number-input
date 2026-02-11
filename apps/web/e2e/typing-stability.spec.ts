import { expect, test } from '@playwright/test';

test('typing stability: inserting in the middle does not jump caret to end (smoke)', async ({
  page,
}) => {
  await page.goto('/');

  const input = page.getByTestId('number-input-default-html').first();
  const display = page
    .getByTestId('number-input-default-html__display')
    .first();

  // Focus through overlay
  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  // Put a known value in the input text.
  await input.fill('123456');

  // Click near the start to put caret early, then type.
  await input.click({ position: { x: 8, y: 10 } });
  await page.keyboard.type('9');

  // If the input remounted or caret jumped, selectionStart tends to land at end.
  const selectionStart = await input.evaluate(
    (el) => (el as HTMLInputElement).selectionStart
  );
  const valueLen = await input.evaluate(
    (el) => (el as HTMLInputElement).value.length
  );

  expect(selectionStart).not.toBeNull();
  expect(selectionStart!).toBeLessThan(valueLen);
});
