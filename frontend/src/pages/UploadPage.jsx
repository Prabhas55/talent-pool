import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  const handleUpload = async () => {
    if (!files.length) return;
    const formData = new FormData();
    files.forEach(f => formData.append('resumes', f));
    setUploading(true);
    setResults([]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResults(res.data.results);
    } catch (err) {
      setResults([{ file: 'Error', status: 'error', error: err.message }]);
    }
    setUploading(false);
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>Upload Resumes</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Upload PDF or Word resumes. PII will be scrubbed before AI processing.
      </p>

      <div style={{
        border: '2px dashed #cbd5e1',
        borderRadius: 12,
        padding: 40,
        textAlign: 'center',
        marginBottom: 24,
        backgroundColor: '#f8fafc'
      }}>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={e => setFiles([...e.target.files])}
          style={{ marginBottom: 12 }}
        />
        <p style={{ color: '#64748b', fontSize: 14 }}>
          {files.length ? `${files.length} file(s) selected` : 'No files selected'}
        </p>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !files.length}
        style={{
          backgroundColor: uploading ? '#94a3b8' : '#1e40af',
          color: 'white',
          border: 'none',
          padding: '12px 32px',
          borderRadius: 8,
          fontSize: 16,
          cursor: uploading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {uploading ? '⏳ Processing with AI...' : 'Upload & Process'}
      </button>

      {uploading && (
        <div style={{
          marginTop: 16,
          padding: 16,
          backgroundColor: '#eff6ff',
          borderRadius: 8,
          textAlign: 'center',
          color: '#1e40af'
        }}>
          Extracting text → Scrubbing PII → Sending to Gemini AI...
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Results:</h3>
          {results.map((r, i) => (
            <div key={i} style={{
              padding: 12,
              marginBottom: 8,
              borderRadius: 8,
              backgroundColor: r.status === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${r.status === 'success' ? '#86efac' : '#fca5a5'}`
            }}>
              {r.status === 'success' ? '✅' : '❌'} {r.file} — {r.status}
              {r.error && <div style={{ fontSize: 12, color: '#ef4444' }}>{r.error}</div>}
            </div>
          ))}
          {results.every(r => r.status === 'success') && (
            <a href="/search" style={{
              display: 'block',
              marginTop: 16,
              textAlign: 'center',
              color: '#1e40af'
            }}>
              → View candidates in Search
            </a>
          )}
        </div>
      )}
    </div>
  );
}