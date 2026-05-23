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
