import { HashRouter, Link, Route, Routes } from 'react-router-dom';

import BenchmarkPage from './pages/BenchmarkPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <HashRouter>
      <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
          <Link to="/">Demo</Link>
          <Link to="/benchmark">Benchmark</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/benchmark" element={<BenchmarkPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
