/**
 * Profile — §20 / Legal Professional Profile (/app/profile)
 * Fields: Name, Email, Password change (current + new), Role/title (free text).
 * No avatar upload. No org fields.
 * Save button. Success state.
 */
import { useState } from 'react';
import { Check } from 'lucide-react';
import DemoTag from '../components/ui/DemoTag';

export default function Profile() {
  const [name, setName] = useState('Senior Counsel');
  const [email, setEmail] = useState('counsel@caseintel.legal');
  const [title, setTitle] = useState('Lead Dispute Resolution Counsel');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setCurrentPw('');
    setNewPw('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: 'var(--paper-100)' }}>
      {/* ── Header Band (Black) ── */}
      <header
        style={{
          background: 'var(--ink-950)',
          borderBottom: '1px solid var(--ink-700)',
          padding: '1.25rem 2rem',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <span className="meta-label on-black" style={{ fontSize: '0.6875rem' }}>
              COUNSEL ACCOUNT
            </span>
            <DemoTag />
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--paper-0)',
              margin: 0,
            }}
          >
            User Profile
          </h1>
        </div>
      </header>

      {/* ── Main Form ── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div
          style={{
            background: 'var(--paper-0)',
            border: '1px solid var(--paper-200)',
            borderRadius: '2px',
            padding: '2rem 2.5rem',
            boxShadow: 'var(--shadow-paper-rest)',
          }}
        >
          {success && (
            <div
              style={{
                background: 'var(--state-ok-bg)',
                border: '1px solid var(--state-ok-text)',
                color: 'var(--state-ok-text)',
                padding: '0.75rem 1rem',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                marginBottom: '1.5rem',
              }}
            >
              <Check size={16} />
              <span>Profile credentials and details successfully updated.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Full Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--paper-700)',
                  marginBottom: '0.35rem',
                }}
              >
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-base"
                style={{ width: '100%', fontSize: '0.875rem' }}
              />
            </div>

            {/* Email Address */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--paper-700)',
                  marginBottom: '0.35rem',
                }}
              >
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base"
                style={{ width: '100%', fontSize: '0.875rem' }}
              />
            </div>

            {/* Role / Title */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--paper-700)',
                  marginBottom: '0.35rem',
                }}
              >
                Professional Role / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Partner, Senior Advocate, Dispute Counsel"
                className="input-base"
                style={{ width: '100%', fontSize: '0.875rem' }}
              />
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--paper-200)', margin: '0.5rem 0' }} />

            <div>
              <span className="meta-label" style={{ fontSize: '0.6875rem', display: 'block', marginBottom: '1rem' }}>
                SECURITY & PASSWORD
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--paper-700)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="••••••••"
                    className="input-base"
                    style={{ width: '100%', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--paper-700)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="input-base"
                    style={{ width: '100%', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-md">
                Save Profile Changes
              </button>

              <aside
                role="note"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--paper-500)',
                  fontStyle: 'italic',
                }}
              >
                Credentials stored with strict encryption.
              </aside>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
