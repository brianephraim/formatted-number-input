import { expect, test } from '@playwright/test';

function isolatedPermutationPath(params: Record<string, string>) {
  return `/web.html?${new URLSearchParams(params).toString()}`;
}

test('live commas: typing a decimal point keeps the transient decimal state', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: 'none',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'true',
    })
  );

  const input = page.getByTestId('number-input-livecommas-html');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.press('1');
  await input.press('2');
  await input.press('.');

  await expect(input).toHaveValue('12.');

  await input.press('3');
  await expect(input).toHaveValue('12.3');
});

test('live commas: RN web input keeps advancing the caret while typing', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'rn',
      wrapperComponent: 'html',
      maxDecimalPlaces: 'none',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'true',
    })
  );

  const input = page.getByTestId('number-input-rn-html-rn');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.press('1');
  await input.press('2');
  await input.press('3');
  await input.press('4');

  await expect(input).toHaveValue('1,234');

  const selection = await input.evaluate((el) => ({
    selectionStart: (el as HTMLInputElement).selectionStart,
    selectionEnd: (el as HTMLInputElement).selectionEnd,
    valueLength: (el as HTMLInputElement).value.length,
  }));

  expect(selection.selectionStart).toBe(selection.valueLength);
  expect(selection.selectionEnd).toBe(selection.valueLength);
});
