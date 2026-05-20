import { useEffect, useState } from 'react';
import BenchmarkPage from './pages/BenchmarkPage';
import PermutationsPage from './pages/PermutationsPage';
import './App.css';

type TabKey = 'permutations' | 'benchmark';

function getTabFromHash(): TabKey {
  return window.location.hash === '#/benchmark' ? 'benchmark' : 'permutations';
}

export default function DocsWebDemo() {
  const [activeTab, setActiveTab] = useState<TabKey>(getTabFromHash);

  useEffect(() => {
    function syncTab() {
      setActiveTab(getTabFromHash());
    }

    window.addEventListener('hashchange', syncTab);
    return () => window.removeEventListener('hashchange', syncTab);
  }, []);

  function setTab(nextTab: TabKey) {
    const nextHash = nextTab === 'benchmark' ? '#/benchmark' : '#/';
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setActiveTab(nextTab);
    }
  }

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
          onClick={() => setTab('permutations')}
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
          onClick={() => setTab('benchmark')}
        >
          Benchmark
        </button>
      </div>

      {activeTab === 'permutations' ? (
        <PermutationsPage />
      ) : (
        <BenchmarkPage />
      )}
    </div>
  );
}
