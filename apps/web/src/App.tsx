import { HashRouter, Link, Route, Routes } from 'react-router-dom';

import BenchmarkPage from './pages/BenchmarkPage';
import PermutationsPage from './pages/PermutationsPage';

export default function App() {
  return (
    <HashRouter>
      <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
        <nav
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <Link to="/">Permutations</Link>
          <Link to="/benchmark">Benchmark</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PermutationsPage />} />
          <Route path="/benchmark" element={<BenchmarkPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
