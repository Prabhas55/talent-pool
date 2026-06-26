import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SearchPage() {
  const [candidates, setCandidates] = useState([]);
  const [skill, setSkill] = useState('');
  const [minExp, setMinExp] = useState('');
  const [location, setLocation] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const params = {};
    if (skill) params.skill = skill;
    if (minExp) params.min_exp = minExp;
    if (location) params.location = location;
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/candidates`,
      { params }
    );
    setCandidates(res.data);
    setLoading(false);
  };

  useEffect(() => { search(); }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ marginBottom: 8 }}>Talent Pool</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        {candidates.length} candidate(s) found
      </p>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap'
      }}>
        <input
          placeholder="🔍 Skill (e.g. React)"
          value={skill}
          onChange={e => setSkill(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
        />
        <input
          placeholder="Min Years Experience"
          type="number"
          value={minExp}
          onChange={e => setMinExp(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, width: 180 }}
        />
        <input
          placeholder="📍 Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
        />
        <button
          onClick={search}
          style={{
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Search
        </button>
        <button
          onClick={() => { setSkill(''); setMinExp(''); setLocation(''); setTimeout(search, 100); }}
          style={{
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            padding: '10px 24px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Clear
        </button>
      </div>

      {/* Candidate Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Loading...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16
        }}>
          {candidates.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                backgroundColor: 'white',
                transition: 'box-shadow 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                backgroundColor: '#1e40af', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: 18, marginBottom: 12
              }}>
                {(c.name || '?')[0].toUpperCase()}
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{c.name}</h3>
              <p style={{ margin: '0 0 4px', color: '#475569', fontSize: 14 }}>
                {c.most_recent_title || 'Unknown Title'}
              </p>
              <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: 13 }}>
                📍 {c.location || 'Unknown'} · {c.years_experience || 0} yrs
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(c.skills || []).slice(0, 4).map((s, i) => (
                  <span key={i} style={{
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontSize: 12
                  }}>{s}</span>
                ))}
                {(c.skills || []).length > 4 && (
                  <span style={{ color: '#94a3b8', fontSize: 12 }}>
                    +{c.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Panel */}
      {selected && (
        <div style={{
          position: 'fixed', top: 0, right: 0,
          width: 420, height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          padding: 32, overflowY: 'auto',
          zIndex: 1000
        }}>
          <button
            onClick={() => setSelected(null)}
            style={{
              float: 'right', background: 'none',
              border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748b'
            }}
          >✕</button>

          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            backgroundColor: '#1e40af', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: 24, marginBottom: 16
          }}>
            {(selected.name || '?')[0].toUpperCase()}
          </div>

          <h2 style={{ margin: '0 0 4px' }}>{selected.name}</h2>
          <p style={{ color: '#475569', marginBottom: 24 }}>{selected.most_recent_title}</p>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <h4 style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>CONTACT DETAILS</h4>
            <p>📧 {selected.email || 'N/A'}</p>
            <p>📞 {selected.phone || 'N/A'}</p>
            {selected.linkedin_url && <p>💼 {selected.linkedin_url}</p>}
            {selected.github_url && <p>💻 {selected.github_url}</p>}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 16 }}>
            <h4 style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>EXPERIENCE</h4>
            <p>📍 {selected.location || 'N/A'}</p>
            <p>⏱ {selected.years_experience || 0} years experience</p>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 16 }}>
            <h4 style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>SKILLS</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(selected.skills || []).map((s, i) => (
                <span key={i} style={{
                  backgroundColor: '#eff6ff', color: '#1e40af',
                  padding: '4px 12px', borderRadius: 20, fontSize: 13
                }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}