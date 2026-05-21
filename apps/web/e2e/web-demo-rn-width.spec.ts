import { expect, test } from '@playwright/test';

function isolatedPermutationPath(params: Record<string, string>) {
  return `/web.html?${new URLSearchParams(params).toString()}`;
}

test('web demo: RN input fills the bordered wrapper width when focused', async ({
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

  const input = page.getByTestId('number-input-rn-html-rn');
  const display = page.getByTestId('number-input-rn-html-rn__display');

  await expect(input).toHaveCount(1);
  await expect(display).toHaveCount(1);

  await display.click();
  await expect(input).toBeFocused();

  await input.press('Meta+A');
  await input.type('1234567.8912341234');

  const bounds = await input.evaluate((el) => {
    const wrapper = el.parentElement as HTMLDivElement | null;
    return {
      inputWidth: el.getBoundingClientRect().width,
      wrapperWidth: wrapper?.getBoundingClientRect().width ?? 0,
    };
  });

  expect(bounds.wrapperWidth).toBeGreaterThan(0);
  expect(bounds.inputWidth / bounds.wrapperWidth).toBeGreaterThan(0.95);
});
