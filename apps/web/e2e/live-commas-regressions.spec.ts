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

test('live commas: controlled number feedback keeps fractional zeros the user typed', async ({
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
  const readout = page.getByTestId('number-input-livecommas-html__value');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.type('12.3400');

  await expect(input).toHaveValue('12.3400');
  await expect(readout).toContainText('12.34');

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue('12.3400');

  await input.click();
  await expect(input).toHaveValue('12.3400');
});

test('live commas: max decimal places still preserves large text when typed decimals are within the limit', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'true',
    })
  );

  const exactText = '111111111111111111.22';
  const input = page.getByTestId('number-input-livecommas-html');
  const readout = page.getByTestId('number-input-livecommas-html__value');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.type(exactText);

  await expect(input).toHaveValue('111,111,111,111,111,111.22');
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue('111,111,111,111,111,111.22');
});

test('live commas: max decimal places rounds fractional text without rounding the large integer', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'none',
      showCommasWhileEditing: 'true',
    })
  );

  const input = page.getByTestId('number-input-livecommas-html');
  const readout = page.getByTestId('number-input-livecommas-html__value');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.type('111111111111111111.223');
  await expect(input).toHaveValue('111,111,111,111,111,111.22');
  await expect(readout).toContainText('111111111111111100');

  await input.press('Meta+A');
  await input.type('111111111111111111.226');
  await expect(input).toHaveValue('111,111,111,111,111,111.23');
  await expect(readout).toContainText('111111111111111100');
});

test('live commas: custom separator max decimal rounding stays string based for large integers', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'bananas',
      showCommasWhileEditing: 'true',
    })
  );

  const input = page.getByTestId('number-input-livecommas-html');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.type('111111111111111111.226');

  await expect(input).toHaveValue('111🍌111🍌111🍌111🍌111🍌111.23');
});

test('live commas: custom separator format preserves large text when typed decimals are within the limit', async ({
  page,
}) => {
  await page.goto(
    isolatedPermutationPath({
      inputComponent: 'html',
      wrapperComponent: 'html',
      maxDecimalPlaces: '2',
      decimalRoundingMode: 'displayAndOutput',
      formatDisplay: 'bananas',
      showCommasWhileEditing: 'true',
    })
  );

  const input = page.getByTestId('number-input-livecommas-html');
  const readout = page.getByTestId('number-input-livecommas-html__value');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.type('111111111111111111.22');

  await expect(input).toHaveValue('111🍌111🍌111🍌111🍌111🍌111.22');
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue('111🍌111🍌111🍌111🍌111🍌111.22');
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

test('live commas: large decimal editing preserves the focused text past number precision limits', async ({
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
  const readout = page.getByTestId('number-input-livecommas-html__value');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.fill('111111111111111.22');
  await input.evaluate((el) => {
    const node = el as HTMLInputElement;
    const decimalIndex = node.value.indexOf('.');
    node.setSelectionRange(decimalIndex, decimalIndex);
  });

  await input.press('1');
  await expect(input).toHaveValue('1,111,111,111,111,111.22');

  await input.evaluate((el) => {
    const node = el as HTMLInputElement;
    const decimalIndex = node.value.indexOf('.');
    node.setSelectionRange(decimalIndex, decimalIndex);
  });
  await input.press('1');
  await expect(input).toHaveValue('11,111,111,111,111,111.22');

  await input.evaluate((el) => {
    const node = el as HTMLInputElement;
    const decimalIndex = node.value.indexOf('.');
    node.setSelectionRange(decimalIndex, decimalIndex);
  });
  await input.press('1');
  await expect(input).toHaveValue('111,111,111,111,111,111.22');
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue('111,111,111,111,111,111.22');

  await input.click();
  await expect(input).toHaveValue('111,111,111,111,111,111.22');
});

test('live commas: key-by-key large decimal editing does not collapse precision', async ({
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
  await input.type('111111111111111.22');
  await expect(input).toHaveValue('111,111,111,111,111.22');

  for (let i = 0; i < 3; i += 1) {
    await input.evaluate((el) => {
      const node = el as HTMLInputElement;
      const decimalIndex = node.value.indexOf('.');
      node.setSelectionRange(decimalIndex, decimalIndex);
    });
    await input.press('1');
  }

  await expect(input).toHaveValue('111,111,111,111,111,111.22');

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue('111,111,111,111,111,111.22');

  await input.click();
  await expect(input).toHaveValue('111,111,111,111,111,111.22');
});

test('live commas RN web: key-by-key large decimal editing does not collapse precision', async ({
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
  await input.type('111111111111111.22');
  await expect(input).toHaveValue('111,111,111,111,111.22');

  for (let i = 0; i < 3; i += 1) {
    await input.evaluate((el) => {
      const node = el as HTMLInputElement;
      const decimalIndex = node.value.indexOf('.');
      node.setSelectionRange(decimalIndex, decimalIndex);
    });
    await input.press('1');
  }

  await expect(input).toHaveValue('111,111,111,111,111,111.22');

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue('111,111,111,111,111,111.22');

  await input.click();
  await expect(input).toHaveValue('111,111,111,111,111,111.22');
});

test('live commas RN web: extreme key-by-key decimal editing does not collapse precision', async ({
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

  const exactText =
    '12341234123412341234123412341234123412341234123412341234123412341234.22';
  const exactDisplayText = exactText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const input = page.getByTestId('number-input-rn-html-rn');
  await expect(input).toHaveCount(1);

  await input.click();
  await input.press('Meta+A');
  await input.type(exactText);
  await expect(input).toHaveValue(exactDisplayText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(input).toHaveValue(exactDisplayText);

  await input.click();
  await expect(input).toHaveValue(exactDisplayText);
});
