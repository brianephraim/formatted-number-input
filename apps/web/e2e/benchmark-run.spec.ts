import { expect, test } from '@playwright/test';
import fs from 'node:fs';

type Variant =
  | 'number-input'
  | 'html-controlled-number'
  | 'rn-controlled-number'
  | 'html-controlled-string'
  | 'rn-controlled-string';

async function focusBenchInput(page: any) {
  const display = page.getByTestId('bench-input__display');
  if (await display.count()) {
    await display.click();
    return page.getByTestId('bench-input');
  }
  const input = page.getByTestId('bench-input');
  await input.click();
  return input;
}

async function clearInput(page: any) {
  await page.keyboard.press('Meta+A');
  await page.keyboard.press('Backspace');
}

test('benchmark run (automated): collects metrics for key variants', async ({ page }, testInfo) => {
  await page.goto('/#/benchmark');

  const payload = '1234567890'.repeat(20); // 200 chars
  const iterations = 5;

  await page.getByTestId('bench-payload').fill(payload);
  await page.getByTestId('bench-iterations').fill(String(iterations));
  await page.getByTestId('bench-stress').uncheck();

  const variants: Variant[] = ['html-controlled-number', 'rn-controlled-number', 'number-input'];
  const outputs: any[] = [];

  for (const variant of variants) {
    await page.getByTestId('bench-variant').selectOption(variant);
    await page.getByTestId('bench-reset').click();

    // start recording
    await page.getByTestId('bench-record-start').click();

    const input = await focusBenchInput(page);

    // Run iterations: clear → type payload
    for (let i = 0; i < iterations; i++) {
      await clearInput(page);
      await input.type(payload, { delay: 0 });
    }

    // Let pending requestAnimationFrame samples flush.
    await page.evaluate(async () => {
      const api = (window as any).__NUMBER_INPUT_BENCH__;
      if (api?.flushRaf) await api.flushRaf(3);
    });

    await page.getByTestId('bench-record-stop').click();

    const text = await page.getByTestId('bench-results').textContent();
    expect(text).toBeTruthy();

    const parsed = JSON.parse(text!);

    // Sanity: ensure we are actually recording measurements.
    expect(parsed.variant).toBe(variant);
    expect(parsed.label).toBeTruthy();
    expect(Number(parsed?.msPerChar?.mean ?? 0)).toBeGreaterThan(0);
    expect(Number(parsed?.eventToRaf?.n ?? 0)).toBeGreaterThan(0);

    outputs.push(parsed);
  }

  // Ensure we have distinct variants.
  expect(new Set(outputs.map((o) => o.variant)).size).toBe(outputs.length);

  const outPath = testInfo.outputPath('bench-results.json');
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        payloadLen: payload.length,
        iterations,
        results: outputs
      },
      null,
      2
    )
  );
});
