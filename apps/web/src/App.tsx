import {
  HashRouter,
  NavLink,
  Route,
  Routes,
  type NavLinkRenderProps,
} from 'react-router-dom';

import BenchmarkPage from './pages/BenchmarkPage';
import PermutationsPage from './pages/PermutationsPage';
import './App.css';

export default function App() {
  const isEmbedded =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('embed') === '1';

  const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
    isActive ? 'web-demo-nav__link is-active' : 'web-demo-nav__link';

  return (
    <HashRouter>
      <div
        className={
          isEmbedded
            ? 'web-demo-shell web-demo-shell--embedded'
            : 'web-demo-shell'
        }
      >
        <div className="web-demo-header">
          <div>
            <p className="web-demo-eyebrow">Web Demo</p>
            <h1 className="web-demo-title">formatted-number-input</h1>
            <p className="web-demo-description">
              Explore the permutation matrix or run the benchmark harness in the
              browser.
            </p>
          </div>
        </div>

        <nav className="web-demo-nav" aria-label="Web demo sections">
          <NavLink className={navLinkClassName} end to="/">
            Permutations
          </NavLink>
          <NavLink className={navLinkClassName} to="/benchmark">
            Benchmark
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<PermutationsPage />} />
          <Route path="/benchmark" element={<BenchmarkPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
