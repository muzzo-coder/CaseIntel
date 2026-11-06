/**
 * Sidebar — §11
 * 13 items, flat list (no groups/dividers), ink-950 background
 * Active: paper-0 text + 2px gold-400 left bar + ink-900 bg
 */
import { NavLink, useNavigate } from 'react-router-dom';
import GoldSeal from '../ui/GoldSeal';
import {
  LayoutDashboard,
  FolderOpen,
  FlaskConical,
  BookOpen,
  Files,
  Upload,
  GitBranch,
  Clock,
  AlertTriangle,
  MessageSquare,
  FileText,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',         icon: LayoutDashboard, path: '/app/dashboard'    },
  { label: 'Matters',           icon: FolderOpen,      path: '/app/matters'      },
  { label: 'AI Investigation',  icon: FlaskConical,    path: '/app/investigation' },
  { label: 'Legal Research',    icon: BookOpen,        path: '/app/research'     },
  { label: 'Documents',         icon: Files,           path: '/app/documents'    },
  { label: 'Upload Evidence',   icon: Upload,          path: '/app/upload'       },
  { label: 'Document Analysis', icon: GitBranch,       path: '/app/analysis'     },
  { label: 'Timeline',          icon: Clock,           path: '/app/timeline'     },
  { label: 'Findings',          icon: AlertTriangle,   path: '/app/findings'     },
  { label: 'Conversations',     icon: MessageSquare,   path: '/app/conversations' },
  { label: 'Reports',           icon: FileText,        path: '/app/reports'      },
  { label: 'Profile',           icon: User,            path: '/app/profile'      },
  { label: 'Settings',          icon: Settings,        path: '/app/settings'     },
];

export default function Sidebar({ collapsed = false }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('legalAI_loggedIn');
    navigate('/login');
  };

  return (
    <aside
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: collapsed ? '64px' : '240px',
        background: 'var(--ink-950)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        borderRight: '1px solid var(--ink-700)',
        transition: 'width var(--motion-base)',
        overflow: 'hidden',
      }}
    >
      {/* Wordmark + GoldSeal */}
      <div
        style={{
          padding: collapsed ? '1.25rem 0' : '1.25rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          borderBottom: '1px solid var(--ink-700)',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: '64px',
          flexShrink: 0,
        }}
      >
        <GoldSeal size={20} style={{ flexShrink: 0 }} />
        {!collapsed && (
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: 'var(--paper-50)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            CaseIntel
          </span>
        )}
      </div>

      {/* Active Matter chip */}
      {!collapsed && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--ink-700)',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: '0.25rem' }}>
            Active Matter
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '0.75rem', color: 'var(--gold-400)', letterSpacing: '0.06em' }}>
            CI-2026-0042
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-400)', marginTop: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Sharma v. Regional Bank
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        aria-label="Primary"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem 0',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : '0.625rem',
                padding: collapsed ? '0.75rem 0' : '0.625rem 1.25rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                height: '44px',
                color: isActive ? 'var(--paper-0)' : 'var(--ink-300)',
                background: isActive ? 'var(--ink-900)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--gold-400)' : '2px solid transparent',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all var(--motion-quick)',
                flexShrink: 0,
              })}
              onMouseOver={e => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.background = 'var(--ink-900)';
                  e.currentTarget.style.color = 'var(--paper-50)';
                }
              }}
              onMouseOut={e => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--ink-300)';
                }
              }}
            >
              <Icon size={20} strokeWidth={1.5} style={{ flexShrink: 0 }} aria-hidden="true" />
              {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: user + disclaimer */}
      <div
        style={{
          borderTop: '1px solid var(--ink-700)',
          padding: '0.75rem',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div
            style={{
              fontSize: '0.625rem',
              color: 'var(--ink-500)',
              textAlign: 'center',
              marginBottom: '0.5rem',
              lineHeight: 1.4,
            }}
          >
            Research aid, not legal advice
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '2px',
                background: 'var(--ink-800)',
                border: '1px solid var(--ink-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--ink-300)',
                flexShrink: 0,
              }}
            >
              SS
            </div>
            {!collapsed && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--ink-300)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Legal User
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-500)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color var(--motion-quick)',
            }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--state-error-text)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--ink-500)'; }}
            aria-label="Sign out"
          >
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
