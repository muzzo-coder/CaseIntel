/* eslint-disable react-refresh/only-export-components */
/**
 * Toast — §22
 * Announced via aria-live=polite, stacked bottom-left, max 3
 */
import { useState, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, { duration = 6000, undo } = {}) => {
    const id = Date.now();
    setToasts(t => [...t.slice(-2), { id, message, undo }]);
    if (duration) {
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
    }
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '360px',
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            role="status"
            style={{
              background: 'var(--ink-900)',
              color: 'var(--paper-50)',
              border: '1px solid var(--ink-700)',
              borderRadius: '2px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-on-black)',
              fontSize: '0.875rem',
              animation: 'marker-slide 200ms ease forwards',
            }}
          >
            <span style={{ flex: 1 }}>{toast.message}</span>
            {toast.undo && (
              <button
                style={{
                  fontFamily: "'IBM Plex Mono'",
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: 'var(--gold-400)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  whiteSpace: 'nowrap',
                }}
                onClick={() => { toast.undo(); remove(toast.id); }}
              >
                UNDO
              </button>
            )}
            <button
              aria-label="Dismiss notification"
              onClick={() => remove(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink-400)',
                cursor: 'pointer',
                padding: '0.125rem',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
