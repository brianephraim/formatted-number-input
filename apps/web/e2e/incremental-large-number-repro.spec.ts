import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
  test,
} from '@playwright/test';

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

function insertOnesBeforeDecimal(text: string, count: number) {
  const decimalIndex = text.indexOf('.');
  if (decimalIndex === -1) return `${text}${'1'.repeat(count)}`;
  return `${text.slice(0, decimalIndex)}${'1'.repeat(count)}${text.slice(decimalIndex)}`;
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

async function screenshot(page: Page, testInfo: TestInfo, label: string) {
  await testInfo.attach(label, {
    body: await page.screenshot({ fullPage: false }),
    contentType: 'image/png',
  });
}

test('live commas RN web: incremental large integer growth stays stable while focused', async ({
  page,
}, testInfo) => {
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

  const startingText = '111111111111111.22';
  const input = page.getByTestId('number-input-rn-html-rn');

  await input.click();
  await input.press('Meta+A');
  await typeOneKeyAtATime(input, startingText);
  await expectStableValue(input, addCommasToNumericText(startingText));
  await screenshot(page, testInfo, 'live-commas-starting-value');

  for (let insertedCount = 1; insertedCount <= 3; insertedCount += 1) {
    const expectedRawText = insertOnesBeforeDecimal(
      startingText,
      insertedCount
    );
    const expectedDisplayText = addCommasToNumericText(expectedRawText);

    await placeCaretBeforeDecimal(input);
    await input.press('1');
    await expectStableValue(input, expectedDisplayText);
    await screenshot(
      page,
      testInfo,
      `live-commas-after-${insertedCount}-integer-inserts`
    );
  }

  await page.getByText('Notes', { exact: true }).click();
  await expectStableValue(
    input,
    addCommasToNumericText(insertOnesBeforeDecimal(startingText, 3))
  );
  await screenshot(page, testInfo, 'live-commas-after-blur');

  await input.click();
  await expectStableValue(
    input,
    addCommasToNumericText(insertOnesBeforeDecimal(startingText, 3))
  );
  await screenshot(page, testInfo, 'live-commas-after-refocus');
});

test('overlay RN web: incremental large integer growth survives blur and refocus', async ({
  page,
}, testInfo) => {
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
  const finalRawText = insertOnesBeforeDecimal(startingText, 3);
  const finalDisplayText = addCommasToNumericText(finalRawText);
  const input = page.getByTestId('number-input-rn-html-rn');
  const display = page.getByTestId('number-input-rn-html-rn__display');

  await display.click();
  await expect(input).toBeFocused();
  await input.press('Meta+A');
  await typeOneKeyAtATime(input, startingText);
  await expectStableValue(input, startingText);
  await screenshot(page, testInfo, 'overlay-starting-value');

  for (let insertedCount = 1; insertedCount <= 3; insertedCount += 1) {
    const expectedRawText = insertOnesBeforeDecimal(
      startingText,
      insertedCount
    );

    await placeCaretBeforeDecimal(input);
    await input.press('1');
    await expectStableValue(input, expectedRawText);
    await screenshot(
      page,
      testInfo,
      `overlay-after-${insertedCount}-integer-inserts`
    );
  }

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expectStableValue(display, finalDisplayText);
  await screenshot(page, testInfo, 'overlay-after-blur');

  await display.click();
  await expect(input).toBeFocused();
  await expectStableValue(input, finalRawText);
  await screenshot(page, testInfo, 'overlay-after-refocus');

  await page.getByText('Notes', { exact: true }).click();
  await expect(display).toBeVisible();
  await expectStableValue(display, finalDisplayText);
  await screenshot(page, testInfo, 'overlay-after-second-blur');
});
