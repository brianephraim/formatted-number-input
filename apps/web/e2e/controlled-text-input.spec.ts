import { expect, test } from '@playwright/test';

function isolatedPermutationPath(params: Record<string, string>) {
  return `/web.html?${new URLSearchParams(params).toString()}`;
}

test('controlled HTML text input preserves huge text separately from number conversion', async ({
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

  const exactText = '123123123123435688';
  const input = page.getByTestId('controlled-html-text-input');
  const canonValueReadout = page.getByTestId(
    'controlled-html-text-input__canonValue'
  );
  const numberReadout = page.getByTestId('controlled-html-text-input__number');
  const roundtripReadout = page.getByTestId(
    'controlled-html-text-input__roundtrip'
  );

  await expect(input).toBeVisible();
  await input.click();
  await input.press('Meta+A');
  await input.type(exactText);

  await expect(input).toHaveValue(exactText);
  await expect(canonValueReadout).toContainText(JSON.stringify(exactText));
  await expect(numberReadout).toContainText('123123123123435680');
  await expect(roundtripReadout).toContainText(
    JSON.stringify('123123123123435680')
  );

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue(exactText);
});

test('controlled HTML text input set button updates the string value', async ({
  page,
}) => {
  await page.goto('/web.html');

  const input = page.getByTestId('controlled-html-text-input');
  const setButton = page.getByTestId('controlled-html-text-input__set');
  const canonValueReadout = page.getByTestId(
    'controlled-html-text-input__canonValue'
  );

  await setButton.click();
  await expect(input).toHaveValue('1234.987654321');
  await expect(canonValueReadout).toContainText('"1234.987654321"');
});
