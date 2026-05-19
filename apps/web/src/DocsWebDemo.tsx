import { useState } from 'react';

import { PermutationsDemo } from 'formatted-number-input/demo';

import './App.css';
import BenchmarkPage from './pages/BenchmarkPage';

type TabKey = 'permutations' | 'benchmark';

export default function DocsWebDemo() {
  const [activeTab, setActiveTab] = useState<TabKey>('permutations');

  return (
    <div className="web-demo-shell web-demo-shell--embedded">
      <div className="web-demo-header">
        <div>
          <p className="web-demo-eyebrow">Web Demo</p>
          <h2 className="web-demo-title">formatted-number-input</h2>
          <p className="web-demo-description">
            Explore the permutation matrix or run the benchmark harness without
            leaving the docs page.
          </p>
        </div>
      </div>

      <div className="web-demo-nav" aria-label="Web demo sections">
        <button
          type="button"
          className={
            activeTab === 'permutations'
              ? 'web-demo-nav__link is-active'
              : 'web-demo-nav__link'
          }
          onClick={() => setActiveTab('permutations')}
        >
          Permutations
        </button>
        <button
          type="button"
          className={
            activeTab === 'benchmark'
              ? 'web-demo-nav__link is-active'
              : 'web-demo-nav__link'
          }
          onClick={() => setActiveTab('benchmark')}
        >
          Benchmark
        </button>
      </div>

      {activeTab === 'permutations' ? (
        <PermutationsDemo platform="web" />
      ) : (
        <BenchmarkPage />
      )}
    </div>
  );
}
