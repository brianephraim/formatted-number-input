import { expect, type Locator, test } from '@playwright/test';

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

async function typeOneKeyAtATime(input: Locator, text: string) {
  for (const char of text) {
    await input.press(char);
  }
}

async function placeCaretBeforeDecimal(input: Locator) {
  await input.evaluate((el) => {
    const node = el as HTMLInputElement;
    const decimalIndex = node.value.indexOf('.');
    node.setSelectionRange(decimalIndex, decimalIndex);
  });
}

async function expectStableValue(input: Locator, value: string) {
  await expect(input).toHaveValue(value);
  await input.page().waitForTimeout(250);
  await expect(input).toHaveValue(value);
}

test.beforeEach(async ({ page }) => {
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
});

test('uncontrolled example: live commas keeps display text independent of parent number feedback', async ({
  page,
}) => {
  const input = page.getByTestId('uncontrolled-live-rn');
  const readout = page.getByTestId('uncontrolled-live-rn__value');
  const startingText = '111111111111111.22';
  const finalText = '111111111111111111.22';
  const finalDisplayText = addCommasToNumericText(finalText);

  await input.click();
  await input.press('Meta+A');
  await typeOneKeyAtATime(input, startingText);
  await expectStableValue(input, addCommasToNumericText(startingText));

  for (let i = 0; i < 3; i += 1) {
    await placeCaretBeforeDecimal(input);
    await input.press('1');
  }

  await expectStableValue(input, finalDisplayText);
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expectStableValue(input, finalDisplayText);

  await input.click();
  await expectStableValue(input, finalDisplayText);
});

test('uncontrolled example: overlay mode keeps raw text through blur and refocus', async ({
  page,
}) => {
  const input = page.getByTestId('uncontrolled-overlay-rn');
  const display = page.getByTestId('uncontrolled-overlay-rn__display');
  const readout = page.getByTestId('uncontrolled-overlay-rn__value');
  const startingText = '111111111111111.22';
  const finalText = '111111111111111111.22';
  const finalDisplayText = addCommasToNumericText(finalText);

  await display.click();
  await expect(input).toBeFocused();
  await input.press('Meta+A');
  await typeOneKeyAtATime(input, startingText);
  await expectStableValue(input, startingText);

  for (let i = 0; i < 3; i += 1) {
    await placeCaretBeforeDecimal(input);
    await input.press('1');
  }

  await expectStableValue(input, finalText);
  await expect(readout).toContainText('111111111111111100');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expectStableValue(display, finalDisplayText);

  await display.click();
  await expect(input).toBeFocused();
  await expectStableValue(input, finalText);

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expectStableValue(display, finalDisplayText);
});
