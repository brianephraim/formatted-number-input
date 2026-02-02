import * as React from 'react';
import { NumberInput } from '@rn-number-input/core';
import { TextInput, View } from 'react-native';

type Variant = 'html-controlled-string' | 'html-controlled-number' | 'rn-controlled-string' | 'rn-controlled-number' | 'number-input';

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

function summarize(sample: BenchSample) {
  const durationMs = sample.endedAt - sample.startedAt;
  return {
    variant: sample.variant,
    stress: sample.stress,
    iterations: sample.iterations,
    payloadLen: sample.payload.length,
    durationMs,
    keystrokes: sample.payload.length * sample.iterations,
    eventToRaf: {
      n: sample.eventToRafMs.length,
      median: p(sample.eventToRafMs, 0.5),
      p95: p(sample.eventToRafMs, 0.95)
    },
    react: {
      commits: sample.reactCommits,
      medianCommitMs: p(sample.reactCommitMs, 0.5),
      p95CommitMs: p(sample.reactCommitMs, 0.95)
    },
    longTasks: sample.longTasks
  };
}

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
        (this.observer as unknown as PerformanceObserver).observe({ entryTypes: ['longtask'] as any });
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
    <div style={{ marginTop: 16, maxHeight: 240, overflow: 'auto', border: '1px solid #333', borderRadius: 8 }}>
      {items.map((i) => (
        <div key={i} style={{ padding: '2px 8px', opacity: 0.8, fontFamily: 'ui-monospace, monospace' }}>
          row {i}: {String(i * 7).padStart(6, '0')}
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: 12, border: '1px solid #333', borderRadius: 10, marginTop: 14 }}>
      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 10 }}>{title}</div>
      {children}
    </section>
  );
}

export default function BenchmarkPage() {
  const [stress, setStress] = React.useState(false);
  const [payload, setPayload] = React.useState('1234567890'.repeat(25));
  const [iterations, setIterations] = React.useState(10);
  const [active, setActive] = React.useState<Variant>('number-input');
  const [results, setResults] = React.useState<object | null>(null);

  // States for each variant (keep separate so switching variants doesn't accidentally reuse state)
  const [htmlText, setHtmlText] = React.useState('');
  const [htmlNum, setHtmlNum] = React.useState(0);
  const [rnText, setRnText] = React.useState('');
  const [rnNum, setRnNum] = React.useState(0);
  const [numValue, setNumValue] = React.useState(0);

  const htmlInputRef = React.useRef<HTMLInputElement | null>(null);

  const collectorRef = React.useRef(new BenchCollector());

  // Expose a small API for Playwright: reset state + control recording.
  React.useEffect(() => {
    (window as any).__NUMBER_INPUT_BENCH__ = {
      reset: () => {
        setHtmlText('');
        setHtmlNum(0);
        setRnText('');
        setRnNum(0);
        setNumValue(0);
        setResults(null);
      },
      startRecording,
      stopRecording,
      getResults: () => results
    };
  }, [results]);

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

  function startRecording() {
    collectorRef.current.start();
    startedAtRef.current = performance.now();
    setIsRecording(true);
    setResults(null);
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
      endedAt
    };

    setResults(summarize(sample));
  }

  async function runAutomatedInPage() {
    // Less-credible helper for quick manual testing.
    const input = document.querySelector<HTMLInputElement>(`[data-testid="bench-input"]`);
    if (!input) throw new Error('bench input not found');

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
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
    }

    await new Promise((r) => setTimeout(r, 0));
    stopRecording();
  }

  // Controlled components (render only the active one to keep apples-to-apples)
  const benchInput = (() => {
    const commonStyle = {
      width: '100%',
      fontSize: 16,
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #555',
      background: '#111',
      color: '#eee',
      boxSizing: 'border-box' as const
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
          <View>
            <TextInput
              testID="bench-input"
              style={commonStyle as any}
              value={rnText}
              onChangeText={(t) => {
                collectorRef.current.markInputEvent();
                setRnText(t);
              }}
            />
          </View>
        );

      case 'rn-controlled-number':
        return (
          <View>
            <TextInput
              testID="bench-input"
              style={commonStyle as any}
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
        );

      case 'number-input':
        return (
          <NumberInput
            testID="bench-input"
            value={numValue}
            onChangeNumber={(n) => {
              collectorRef.current.markInputEvent();
              setNumValue(n);
            }}
            autoComplete="off"
            placeholder="benchmark"
            style={{ backgroundColor: '#111', color: '#eee', borderColor: '#555' }}
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
        This page compares keystroke responsiveness and React commit work across implementations. For the most credible
        results, run the automation via Playwright (it produces consistent typing patterns).
      </p>

      <Section title="Controls">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Variant</div>
            <select
              data-testid="bench-variant"
              value={active}
              onChange={(e) => setActive(e.target.value as Variant)}
              style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #555', background: '#111', color: '#eee' }}
            >
              <option value="number-input">NumberInput (controlled number, uncontrolled typing)</option>
              <option value="html-controlled-number">HTML input (controlled number, parse/format each input)</option>
              <option value="rn-controlled-number">RN TextInput (controlled number, parse/format each input)</option>
              <option value="html-controlled-string">HTML input (controlled string)</option>
              <option value="rn-controlled-string">RN TextInput (controlled string)</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Payload</div>
            <input
              data-testid="bench-payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #555', background: '#111', color: '#eee' }}
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
              style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #555', background: '#111', color: '#eee' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 26 }}>
            <input
              data-testid="bench-stress"
              type="checkbox"
              checked={stress}
              onChange={(e) => setStress(e.target.checked)}
            />
            <span style={{ fontSize: 12, opacity: 0.9 }}>Stress mode (renders heavy subtree on every update)</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
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
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #555', background: '#111', color: '#eee' }}
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
              color: '#fff'
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
              color: '#eee'
            }}
          >
            Stop + summarize
          </button>

          <button
            data-testid="bench-start"
            onClick={() => void runAutomatedInPage()}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #555', background: '#111', color: '#eee' }}
          >
            Run (in-page, less credible)
          </button>

          <div style={{ fontSize: 12, opacity: 0.75, alignSelf: 'center' }}>
            For credible runs: use Playwright to click <b>Start recording</b>, type payload N times, then click{' '}
            <b>Stop</b>.
          </div>
        </div>
      </Section>

      <Section title="Under test">
        <React.Profiler id="bench" onRender={(_, __, actualDuration) => onProfilerRender(actualDuration)}>
          {benchInput}
          <StressTree enabled={stress} />
        </React.Profiler>
      </Section>

      <Section title="Results">
        <pre data-testid="bench-results" style={{ whiteSpace: 'pre-wrap', fontSize: 12, opacity: 0.9 }}>
          {results ? JSON.stringify(results, null, 2) : 'No results yet.'}
        </pre>
      </Section>
    </div>
  );
}
