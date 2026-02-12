import * as React from 'react';
import { FormattedNumberInput } from 'formatted-number-input';
import { TextInput, View } from 'react-native';

type Variant =
  | 'html-controlled-string'
  | 'html-controlled-number'
  | 'rn-controlled-string'
  | 'rn-controlled-number'
  | 'number-input';

const VARIANT_LABEL: Record<Variant, string> = {
  'number-input': 'FormattedNumberInput',
  'html-controlled-number': 'HTML input (controlled number)',
  'rn-controlled-number': 'RN TextInput (controlled number)',
  'html-controlled-string': 'HTML input (controlled string)',
  'rn-controlled-string': 'RN TextInput (controlled string)',
};

type BenchSample = {
  variant: Variant;
  stress: boolean;
  payload: string;
  iterations: number;
  eventToRafMs: number[];
  reactCommitMs: number[];
  reactCommits: number;
  longTasks: number;
  startedAt: number;
  endedAt: number;
};

function p(arr: number[], q: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((sorted.length - 1) * q);
  return sorted[idx] ?? 0;
}

function stats(arr: number[]) {
  if (arr.length === 0) {
    return { n: 0, min: 0, max: 0, mean: 0, median: 0, p95: 0 };
  }
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0] ?? 0;
  const max = sorted[n - 1] ?? 0;
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  return {
    n,
    min,
    max,
    mean,
    median: p(sorted, 0.5),
    p95: p(sorted, 0.95),
  };
}

function summarize(sample: BenchSample) {
  const durationMs = sample.endedAt - sample.startedAt;
  const keystrokes = sample.payload.length * sample.iterations;

  return {
    variant: sample.variant,
    label: VARIANT_LABEL[sample.variant],
    stress: sample.stress,
    iterations: sample.iterations,
    payloadLen: sample.payload.length,
    durationMs,
    keystrokes,

    // Simple, easy-to-compare throughput metric.
    msPerChar: {
      mean: keystrokes ? durationMs / keystrokes : 0,
    },

    // More granular, but can be noisy; kept for diagnostic value.
    eventToRaf: stats(sample.eventToRafMs),
    reactCommit: {
      commits: sample.reactCommits,
      ...stats(sample.reactCommitMs),
    },

    longTasks: sample.longTasks,
  };
}

type BenchSummary = ReturnType<typeof summarize>;

interface BenchAPI {
  reset: () => void;
  startRecording: () => void;
  stopRecording: () => BenchSummary;
  flushRaf: (count?: number) => Promise<void>;
  runAutomatedInPage: (variantOverride?: Variant) => Promise<BenchSummary>;
  runSuiteInPage: () => Promise<void>;
  getResults: () => BenchSummary | null;
  getSuiteResults: () => BenchSummary[] | null;
}

declare global {
  interface Window {
    __NUMBER_INPUT_BENCH__?: BenchAPI;
  }
}

type ScoredSummary = BenchSummary & { score: number };

class BenchCollector {
  eventToRafMs: number[] = [];
  reactCommitMs: number[] = [];
  reactCommits = 0;
  longTasks = 0;
  private observer: PerformanceObserver | null = null;

  start() {
    this.eventToRafMs = [];
    this.reactCommitMs = [];
    this.reactCommits = 0;
    this.longTasks = 0;

    if (typeof PerformanceObserver !== 'undefined') {
      try {
        this.observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'longtask') this.longTasks += 1;
          }
        });
        this.observer.observe({ entryTypes: ['longtask'] });
      } catch {
        // ignore
      }
    }
  }

  stop() {
    try {
      this.observer?.disconnect();
    } catch {
      // ignore
    }
    this.observer = null;
  }

  markInputEvent() {
    const t0 = performance.now();
    requestAnimationFrame(() => {
      this.eventToRafMs.push(performance.now() - t0);
    });
  }

  onReactCommit(actualDuration: number) {
    this.reactCommits += 1;
    this.reactCommitMs.push(actualDuration);
  }
}

function StressTree({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  // Moderate CPU + render stress that still completes quickly in CI.
  const rows = 1500;
  const items = Array.from({ length: rows }, (_, i) => i);
  return (
    <div
      style={{
        marginTop: 16,
        maxHeight: 240,
        overflow: 'auto',
        border: '1px solid #333',
        borderRadius: 8,
      }}
    >
      {items.map((i) => (
        <div
          key={i}
          style={{
            padding: '2px 8px',
            opacity: 0.8,
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          row {i}: {String(i * 7).padStart(6, '0')}
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: 12,
        border: '1px solid #333',
        borderRadius: 10,
        marginTop: 14,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </section>
  );
}

export default function BenchmarkPage() {
  const [stress, setStress] = React.useState(false);
  const [payload, setPayload] = React.useState('1234567890'.repeat(25));
  const [iterations, setIterations] = React.useState(10);
  const [active, setActive] = React.useState<Variant>('number-input');
  const [results, setResults] = React.useState<BenchSummary | null>(null);
  const [suiteResults, setSuiteResults] = React.useState<BenchSummary[] | null>(
    null
  );
  const [suiteRunning, setSuiteRunning] = React.useState(false);

  // States for each variant (keep separate so switching variants doesn't accidentally reuse state)
  const [htmlText, setHtmlText] = React.useState('');
  const [htmlNum, setHtmlNum] = React.useState(0);
  const [rnText, setRnText] = React.useState('');
  const [rnNum, setRnNum] = React.useState(0);
  const [numValue, setNumValue] = React.useState(0);

  const htmlInputRef = React.useRef<HTMLInputElement | null>(null);

  const collectorRef = React.useRef(new BenchCollector());

  const onProfilerRender = React.useCallback((actualDuration: number) => {
    collectorRef.current.onReactCommit(actualDuration);
  }, []);

  function formatNum(n: number) {
    // Typical "controlled numeric input" approach: parse number, then format back.
    // This is intentionally naive, because that's what many implementations do.
    return Number.isFinite(n) ? String(n) : '';
  }

  const [isRecording, setIsRecording] = React.useState(false);
  const startedAtRef = React.useRef<number | null>(null);

  function getBenchDomInput(): HTMLInputElement | HTMLTextAreaElement | null {
    // For FormattedNumberInput + HTML variants, the element is directly tagged.
    const direct = document.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(`[data-testid="bench-input"]`);

    // For react-native-web TextInput, testID can land on a wrapper. Use a wrapper
    // testid and query its actual editable element.
    const wrap = document.querySelector<HTMLElement>(
      `[data-testid="bench-input-wrap"]`
    );
    const nested =
      wrap?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        'input,textarea'
      ) ?? null;

    return nested ?? direct;
  }

  function startRecording() {
    collectorRef.current.start();
    startedAtRef.current = performance.now();
    setIsRecording(true);
    setResults(null);
    setSuiteResults(null);
  }

  function stopRecording() {
    const startedAt = startedAtRef.current ?? performance.now();
    const endedAt = performance.now();
    collectorRef.current.stop();
    setIsRecording(false);

    const sample: BenchSample = {
      variant: active,
      stress,
      payload,
      iterations,
      eventToRafMs: collectorRef.current.eventToRafMs,
      reactCommitMs: collectorRef.current.reactCommitMs,
      reactCommits: collectorRef.current.reactCommits,
      longTasks: collectorRef.current.longTasks,
      startedAt,
      endedAt,
    };

    const summary = summarize(sample);
    setResults(summary);
    return summary;
  }

  function score(summary: BenchSummary): number {
    // Lower is better.
    // Heuristic: prioritize tail-ish responsiveness + long tasks.
    return (
      2 * summary.msPerChar.mean +
      summary.eventToRaf.p95 +
      summary.reactCommit.p95 +
      15 * summary.longTasks
    );
  }

  async function runAutomatedInPage(
    variantOverride?: Variant
  ): Promise<BenchSummary> {
    // Less-credible helper for quick manual testing.
    // Note: uses programmatic input events; prefer Playwright for credibility.
    const input = getBenchDomInput();
    if (!input) throw new Error('bench input DOM element not found');

    startRecording();

    input.focus();
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    for (let iter = 0; iter < iterations; iter++) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      for (const ch of payload) {
        input.value = input.value + ch;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    // allow pending rAF measurements to flush (important when driving fast)
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const summary = stopRecording();
    if (variantOverride) {
      return {
        ...summary,
        variant: variantOverride,
        label: VARIANT_LABEL[variantOverride],
      };
    }
    return summary;
  }

  async function runSuiteInPage() {
    setSuiteRunning(true);
    setResults(null);
    setSuiteResults(null);

    const variants: Variant[] = [
      'html-controlled-number',
      'rn-controlled-number',
      'number-input',
    ];
    const collected: BenchSummary[] = [];

    for (const v of variants) {
      setActive(v);
      // Wait for the component to re-render.
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      // Reset state between variants.
      setHtmlText('');
      setHtmlNum(0);
      setRnText('');
      setRnNum(0);
      setNumValue(0);

      await new Promise((r) => requestAnimationFrame(() => r(null)));

      // Run the same workload under the same settings.
      const summary = await runAutomatedInPage(v);
      collected.push(summary);

      // brief pause between variants
      await new Promise((r) => setTimeout(r, 75));
    }

    setSuiteResults(collected);
    setSuiteRunning(false);
  }

  // Expose a small API for Playwright: reset state + control recording.
  // Use a ref so the effect doesn't re-run on every render (these functions
  // capture component state via closure and are intentionally recreated).
  const benchApiRef = React.useRef<BenchAPI | null>(null);
  React.useEffect(() => {
    benchApiRef.current = {
      reset: () => {
        setHtmlText('');
        setHtmlNum(0);
        setRnText('');
        setRnNum(0);
        setNumValue(0);
        setResults(null);
        setSuiteResults(null);
      },
      startRecording,
      stopRecording,
      flushRaf: async (count: number = 2) => {
        for (let i = 0; i < count; i++) {
          await new Promise((r) => requestAnimationFrame(() => r(null)));
        }
      },
      runAutomatedInPage,
      runSuiteInPage,
      getResults: () => results,
      getSuiteResults: () => suiteResults,
    };
  });

  React.useEffect(() => {
    window.__NUMBER_INPUT_BENCH__ = {
      reset: (...args) => benchApiRef.current!.reset(...args),
      startRecording: (...args) => benchApiRef.current!.startRecording(...args),
      stopRecording: (...args) => benchApiRef.current!.stopRecording(...args),
      flushRaf: (...args) => benchApiRef.current!.flushRaf(...args),
      runAutomatedInPage: (...args) =>
        benchApiRef.current!.runAutomatedInPage(...args),
      runSuiteInPage: (...args) => benchApiRef.current!.runSuiteInPage(...args),
      getResults: (...args) => benchApiRef.current!.getResults(...args),
      getSuiteResults: (...args) =>
        benchApiRef.current!.getSuiteResults(...args),
    };
  }, []);

  // Controlled components (render only the active one to keep apples-to-apples)
  const benchInput = (() => {
    // Style shared across all benchmark variants. Typed as Record<string, unknown>
    // because these CSS properties don't align with RN's StyleProp<TextStyle>
    // (e.g. 'border' shorthand, 'boxSizing'). react-native-web handles them at runtime.
    const commonStyle: Record<string, unknown> = {
      width: '100%',
      fontSize: 16,
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #555',
      background: '#111',
      color: '#eee',
      boxSizing: 'border-box',
    };

    switch (active) {
      case 'html-controlled-string':
        return (
          <input
            ref={htmlInputRef}
            data-testid="bench-input"
            style={commonStyle}
            value={htmlText}
            onInput={(e) => {
              collectorRef.current.markInputEvent();
              setHtmlText((e.target as HTMLInputElement).value);
            }}
          />
        );

      case 'html-controlled-number':
        return (
          <input
            ref={htmlInputRef}
            data-testid="bench-input"
            style={commonStyle}
            value={formatNum(htmlNum)}
            onInput={(e) => {
              collectorRef.current.markInputEvent();
              const t = (e.target as HTMLInputElement).value;
              const cleaned = t.replace(/[^0-9.-]/g, '');
              const next = Number(cleaned);
              if (!Number.isNaN(next)) setHtmlNum(next);
              else setHtmlNum(0);
            }}
          />
        );

      case 'rn-controlled-string':
        return (
          <div data-testid="bench-input-wrap">
            <View>
              <TextInput
                testID="bench-input"
                style={commonStyle}
                value={rnText}
                onChangeText={(t) => {
                  collectorRef.current.markInputEvent();
                  setRnText(t);
                }}
              />
            </View>
          </div>
        );

      case 'rn-controlled-number':
        return (
          <div data-testid="bench-input-wrap">
            <View>
              <TextInput
                testID="bench-input"
                style={commonStyle}
                value={formatNum(rnNum)}
                onChangeText={(t) => {
                  collectorRef.current.markInputEvent();
                  const cleaned = t.replace(/[^0-9.-]/g, '');
                  const next = Number(cleaned);
                  if (!Number.isNaN(next)) setRnNum(next);
                  else setRnNum(0);
                }}
              />
            </View>
          </div>
        );

      case 'number-input':
        return (
          <FormattedNumberInput
            testID="bench-input"
            value={numValue}
            onChangeNumber={(n) => {
              collectorRef.current.markInputEvent();
              setNumValue(n);
            }}
            autoComplete="off"
            placeholder="benchmark"
            style={{
              backgroundColor: '#111',
              color: '#eee',
              borderColor: '#555',
            }}
          />
        );

      default:
        return null;
    }
  })();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Benchmark</h1>
      <p style={{ opacity: 0.8, maxWidth: 760 }}>
        This page compares keystroke responsiveness and React commit work across
        implementations. For the most credible results, run the automation via
        Playwright (it produces consistent typing patterns).
      </p>

      <Section title="Controls">
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Variant</div>
            <select
              data-testid="bench-variant"
              value={active}
              onChange={(e) => setActive(e.target.value as Variant)}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #555',
                background: '#111',
                color: '#eee',
              }}
            >
              <option value="number-input">
                FormattedNumberInput (controlled number, uncontrolled typing)
              </option>
              <option value="html-controlled-number">
                HTML input (controlled number, parse/format each input)
              </option>
              <option value="rn-controlled-number">
                RN TextInput (controlled number, parse/format each input)
              </option>
              <option value="html-controlled-string">
                HTML input (controlled string)
              </option>
              <option value="rn-controlled-string">
                RN TextInput (controlled string)
              </option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Payload</div>
            <input
              data-testid="bench-payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #555',
                background: '#111',
                color: '#eee',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Iterations</div>
            <input
              data-testid="bench-iterations"
              type="number"
              value={iterations}
              min={1}
              max={200}
              onChange={(e) => setIterations(Number(e.target.value))}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #555',
                background: '#111',
                color: '#eee',
              }}
            />
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 26,
            }}
          >
            <input
              data-testid="bench-stress"
              type="checkbox"
              checked={stress}
              onChange={(e) => setStress(e.target.checked)}
            />
            <span style={{ fontSize: 12, opacity: 0.9 }}>
              Stress mode (renders heavy subtree on every update)
            </span>
          </label>
        </div>

        <div
          style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}
        >
          <button
            data-testid="bench-reset"
            onClick={() => {
              setHtmlText('');
              setHtmlNum(0);
              setRnText('');
              setRnNum(0);
              setNumValue(0);
              setResults(null);
            }}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #555',
              background: '#111',
              color: '#eee',
            }}
          >
            Reset
          </button>

          <button
            data-testid="bench-record-start"
            disabled={isRecording}
            onClick={() => startRecording()}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #1f6feb',
              background: isRecording ? '#222' : '#0b2a66',
              color: '#fff',
            }}
          >
            Start recording
          </button>

          <button
            data-testid="bench-record-stop"
            disabled={!isRecording}
            onClick={() => stopRecording()}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #555',
              background: !isRecording ? '#222' : '#111',
              color: '#eee',
            }}
          >
            Stop + summarize
          </button>

          <button
            data-testid="bench-start"
            disabled={suiteRunning}
            onClick={() => void runAutomatedInPage()}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #555',
              background: '#111',
              color: '#eee',
            }}
          >
            Run (in-page, less credible)
          </button>

          <button
            data-testid="bench-suite-run"
            disabled={suiteRunning}
            onClick={() => void runSuiteInPage()}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #1f6feb',
              background: suiteRunning ? '#222' : '#0b2a66',
              color: '#fff',
            }}
          >
            {suiteRunning ? 'Running suite…' : 'Run suite + rank (in-page)'}
          </button>

          <div
            style={{
              fontSize: 12,
              opacity: 0.75,
              alignSelf: 'center',
              maxWidth: 520,
            }}
          >
            The suite runs variants sequentially under the same load and
            provides a simple ranking. For credible runs, prefer Playwright
            (consistent typing patterns).
          </div>
        </div>
      </Section>

      <Section title="Under test">
        <React.Profiler
          id="bench"
          onRender={(_, __, actualDuration) => onProfilerRender(actualDuration)}
        >
          {benchInput}
          <StressTree enabled={stress} />
        </React.Profiler>
      </Section>

      <Section title="Results">
        {suiteResults ? (
          <div data-testid="bench-suite-results" style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
              Ranking (lower score = better)
            </div>
            <ol style={{ marginTop: 0 }}>
              {[...suiteResults]
                .map((r): ScoredSummary => ({ ...r, score: score(r) }))
                .sort((a, b) => a.score - b.score)
                .map((r) => (
                  <li key={r.variant}>
                    <b>{r.label}</b> — <b>score {r.score.toFixed(2)}</b>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      ms/char avg: {r.msPerChar.mean.toFixed(2)}; event→rAF
                      mean/min/max: {r.eventToRaf.mean.toFixed(2)} /{' '}
                      {r.eventToRaf.min.toFixed(2)} /{' '}
                      {r.eventToRaf.max.toFixed(2)}; react commit p95:{' '}
                      {r.reactCommit.p95.toFixed(2)}; longTasks: {r.longTasks}
                    </div>
                  </li>
                ))}
            </ol>

            <div
              style={{
                fontSize: 12,
                opacity: 0.85,
                marginTop: 10,
                marginBottom: 6,
              }}
            >
              Scores (unsorted)
            </div>
            <ul style={{ marginTop: 0 }}>
              {[...suiteResults]
                .map((r) => ({ label: r.label, score: score(r) }))
                .map((r) => (
                  <li key={r.label}>
                    <code>{r.label}</code>: <b>{r.score.toFixed(2)}</b>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        <pre
          data-testid="bench-results"
          style={{ whiteSpace: 'pre-wrap', fontSize: 12, opacity: 0.9 }}
        >
          {suiteResults
            ? JSON.stringify(
                {
                  suite: suiteResults.map(
                    (r): ScoredSummary => ({ ...r, score: score(r) })
                  ),
                },
                null,
                2
              )
            : results
              ? JSON.stringify(results, null, 2)
              : 'No results yet.'}
        </pre>
      </Section>
    </div>
  );
}
