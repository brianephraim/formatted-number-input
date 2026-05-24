import { expect, test } from '@playwright/test';

test('invalid characters: letters do not reappear after blur/refocus (reseeds on blur)', async ({
  page,
}) => {
  await page.goto('/web.html');

  const input = page.getByTestId('number-input-default-html').first();
  const display = page
    .getByTestId('number-input-default-html__display')
    .first();

  // Focus through overlay.
  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  // Type a mix; while focused, the uncontrolled input will contain it.
  await input.fill('12abc34');

  // Blur so overlay is visible again.
  await page.getByTestId('permutations-title').click();
  await expect(display).toBeVisible();

  // Refocus; the typing input should be reseeded from controlled value (letters removed).
  await display.click();
  await expect(input).toBeFocused();

  await expect(input).toHaveValue('1234');
});

test('overlay mode: leading zeros do not reappear after blur/refocus', async ({
  page,
}) => {
  await page.goto(
    '/web.html?inputComponent=html&wrapperComponent=html&maxDecimalPlaces=none&decimalRoundingMode=displayAndOutput&formatDisplay=none&showCommasWhileEditing=false'
  );

  const input = page.getByTestId('number-input-default-html');
  const display = page.getByTestId('number-input-default-html__display');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type('00012.3400');
  await expect(input).toHaveValue('00012.3400');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue('12.3400');

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('12.3400');
});
