import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{
        padding: '16px 32px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: 24,
        backgroundColor: '#1e40af'
      }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginRight: 'auto' }}>
          🎯 Talent Pool
        </span>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Upload</Link>
        <Link to="/search" style={{ color: 'white', textDecoration: 'none' }}>Search</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}