import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentFile: '' });

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setResults([]);
    setProgress({ current: 0, total: files.length, currentFile: '' });

    const allResults = [];

    // Upload files one by one to show per-file progress
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({
        current: i + 1,
        total: files.length,
        currentFile: file.name
      });

      const formData = new FormData();
      formData.append('resumes', file);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        allResults.push(...res.data.results);
      } catch (err) {
        allResults.push({ file: file.name, status: 'error', error: err.message });
      }
    }

    setResults(allResults);
    setUploading(false);
    setProgress({ current: 0, total: 0, currentFile: '' });
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
     <h1 style={{ marginBottom: 16, fontSize: 32, fontWeight: 'bold', lineHeight: 1.2 }}>
  Upload Resumes
</h1>
<p style={{ color: '#64748b', marginBottom: 24, marginTop: 0, lineHeight: 1.6 }}>
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
        {uploading ? `Processing ${progress.current} of ${progress.total}...` : 'Upload & Process'}
      </button>

      {uploading && (
        <div style={{
          marginTop: 16,
          padding: 16,
          backgroundColor: '#eff6ff',
          borderRadius: 8,
          color: '#1e40af'
        }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Processing resume {progress.current} of {progress.total}
          </div>
          <div style={{ fontSize: 13, color: '#3b82f6', marginBottom: 12 }}>
            📄 {progress.currentFile}
          </div>
          {/* Progress bar */}
          <div style={{
            backgroundColor: '#bfdbfe',
            borderRadius: 999,
            height: 8,
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#1e40af',
              height: '100%',
              width: `${(progress.current / progress.total) * 100}%`,
              transition: 'width 0.3s ease',
              borderRadius: 999
            }} />
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, textAlign: 'right' }}>
            {Math.round((progress.current / progress.total) * 100)}%
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Extracting text → Scrubbing PII → Sending to Groq AI...
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16
          }}>
            <div style={{
              flex: 1,
              padding: 12,
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: 8,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#16a34a' }}>
                {successCount}
              </div>
              <div style={{ fontSize: 12, color: '#16a34a' }}>Successful</div>
            </div>
            <div style={{
              flex: 1,
              padding: 12,
              backgroundColor: errorCount > 0 ? '#fef2f2' : '#f8fafc',
              border: `1px solid ${errorCount > 0 ? '#fca5a5' : '#e2e8f0'}`,
              borderRadius: 8,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: errorCount > 0 ? '#dc2626' : '#94a3b8' }}>
                {errorCount}
              </div>
              <div style={{ fontSize: 12, color: errorCount > 0 ? '#dc2626' : '#94a3b8' }}>Failed</div>
            </div>
          </div>

          {results.map((r, i) => (
            <div key={i} style={{
              padding: 12,
              marginBottom: 8,
              borderRadius: 8,
              backgroundColor: r.status === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${r.status === 'success' ? '#86efac' : '#fca5a5'}`
            }}>
              {r.status === 'success' ? '✅' : '❌'} {r.file} — {r.status}
              {r.error && (
                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>
                  {r.error}
                </div>
              )}
            </div>
          ))}

          {successCount > 0 && (
            <a href="/search" style={{
              display: 'block',
              marginTop: 16,
              textAlign: 'center',
              color: '#1e40af',
              textDecoration: 'none',
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderRadius: 8,
              fontWeight: 'bold'
            }}>
              → View {successCount} candidate(s) in Search
            </a>
          )}
        </div>
      )}
    </div>
  );
}
