import { expect, test } from '@playwright/test';

function isolatedPermutationPath(params: Record<string, string>) {
  return `/web.html?${new URLSearchParams(params).toString()}`;
}

function addCommasToNumericText(text: string) {
  const [intPart, fractionPart] = text.split('.');
  const groupedIntPart = intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fractionPart == null
    ? groupedIntPart
    : `${groupedIntPart}.${fractionPart}`;
}

test('overlay mode: large decimal text survives blur and refocus without scientific notation', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: 'none',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const exactText =
    '1234123412341234123412341234123412341234123412341234123412341234.22';
  const exactDisplayText = addCommasToNumericText(exactText);
  const input = page.getByTestId('number-input-default-html');
  const display = page.getByTestId('number-input-default-html__display');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.fill(exactText);
  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);
});

test('overlay mode: controlled number feedback keeps fractional zeros through blur and refocus', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: 'none',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const exactText = '12.3400';
  const input = page.getByTestId('number-input-default-html');
  const display = page.getByTestId('number-input-default-html__display');
  const readout = page.getByTestId('number-input-default-html__value');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type(exactText);
  await expect(input).toHaveValue(exactText);
  await expect(readout).toContainText('12.34');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactText);

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactText);
});

test('overlay mode: max decimal places still preserves large text when typed decimals are within the limit', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const exactText = '111111111111111111.22';
  const exactDisplayText = '111,111,111,111,111,111.22';
  const input = page.getByTestId('number-input-decimals-html');
  const display = page.getByTestId('number-input-decimals-html__display');
  const readout = page.getByTestId('number-input-decimals-html__value');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type(exactText);
  await expect(input).toHaveValue(exactText);
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(exactText);
});

test('overlay mode: max decimal places rounds fractional text on blur without rounding the large integer', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const input = page.getByTestId('number-input-decimals-html');
  const display = page.getByTestId('number-input-decimals-html__display');
  const readout = page.getByTestId('number-input-decimals-html__value');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type('111111111111111111.223');
  await expect(input).toHaveValue('111111111111111111.223');
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue('111,111,111,111,111,111.22');

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('111111111111111111.22');

  await input.press('Meta+A');
  await input.type('111111111111111111.226');
  await expect(input).toHaveValue('111111111111111111.226');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue('111,111,111,111,111,111.23');

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('111111111111111111.23');
});

test('overlay mode: decimal rounding can carry across huge integer text', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const input = page.getByTestId('number-input-decimals-html');
  const display = page.getByTestId('number-input-decimals-html__display');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type('999999999999999999.999');
  await expect(input).toHaveValue('999999999999999999.999');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue('1,000,000,000,000,000,000.00');

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('1000000000000000000.00');
});

test('overlay mode: custom separator format preserves large text when typed decimals are within the limit', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'bananas',
      showCommasWhileEditing: 'false',
    })
  );

  const exactText = '111111111111111111.22';
  const exactDisplayText = '111🍌111🍌111🍌111🍌111🍌111.22';
  const input = page.getByTestId('number-input-emoji-html');
  const display = page.getByTestId('number-input-emoji-html__display');
  const readout = page.getByTestId('number-input-emoji-html__value');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type(exactText);
  await expect(input).toHaveValue(exactText);
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(exactText);
});

test('overlay mode: key-by-key large decimal editing survives blur and refocus', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: 'none',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const startingText = '111111111111111.22';
  const exactText = '111111111111111111.22';
  const exactDisplayText = addCommasToNumericText(exactText);
  const input = page.getByTestId('number-input-default-html');
  const display = page.getByTestId('number-input-default-html__display');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type(startingText);
  await expect(input).toHaveValue(startingText);

  for (let i = 0; i < 3; i += 1) {
    await input.evaluate((el) => {
      const node = el as HTMLInputElement;
      const decimalIndex = node.value.indexOf('.');
      node.setSelectionRange(decimalIndex, decimalIndex);
    });
    await input.press('1');
  }

  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);
});

test('overlay RN web mode: key-by-key large decimal editing survives blur and refocus', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'rn',
      wrapperComponent: 'html',
      maxDecimalPlaces: 'none',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const startingText = '111111111111111.22';
  const exactText = '111111111111111111.22';
  const exactDisplayText = addCommasToNumericText(exactText);
  const input = page.getByTestId('number-input-rn-html-rn');
  const display = page.getByTestId('number-input-rn-html-rn__display');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type(startingText);
  await expect(input).toHaveValue(startingText);

  for (let i = 0; i < 3; i += 1) {
    await input.evaluate((el) => {
      const node = el as HTMLInputElement;
      const decimalIndex = node.value.indexOf('.');
      node.setSelectionRange(decimalIndex, decimalIndex);
    });
    await input.press('1');
  }

  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);
});

test('overlay RN web mode: extreme key-by-key decimal editing avoids zero padding and scientific notation', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'rn',
      wrapperComponent: 'html',
      maxDecimalPlaces: 'none',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'false',
    })
  );

  const exactText =
    '12341234123412341234123412341234123412341234123412341234123412341234.22';
  const exactDisplayText = addCommasToNumericText(exactText);
  const input = page.getByTestId('number-input-rn-html-rn');
  const display = page.getByTestId('number-input-rn-html-rn__display');

  await expect(display).toBeVisible();
  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type(exactText);
  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);

  await display.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(exactText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expect(display).toHaveValue(exactDisplayText);
});
