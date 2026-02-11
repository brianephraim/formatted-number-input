import { expect, test } from '@playwright/test';

test('parsing: multiple decimal points does not crash and emits a number (collapsed)', async ({
  page,
}) => {
  await page.goto('/');

  const input = page.getByTestId('number-input-default-html');
  const display = page.getByTestId('number-input-default-html__display');
  const readout = page.getByTestId('number-input-default-html__value');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.fill('12.3.4.567');

  // readout is "value: <json>", we just want to see it becomes a numeric value (12.34567)
  await expect(readout).toContainText('12.34567');
});
