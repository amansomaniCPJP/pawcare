import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let _toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error', 5000),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 'var(--z-toast)', maxWidth: '380px',
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

const TYPE_STYLES = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', icon: '✓', iconColor: '#16a34a', titleColor: '#15803d' },
  error:   { bg: '#fef2f2', border: '#fecaca', icon: '✕', iconColor: '#dc2626', titleColor: '#dc2626' },
  warning: { bg: '#fffbeb', border: '#fde68a', icon: '!', iconColor: '#d97706', titleColor: '#b45309' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', icon: 'i', iconColor: '#2563eb', titleColor: '#1d4ed8' },
};

function ToastItem({ toast, onDismiss }) {
  const s = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 'var(--radius-lg)', padding: '14px 16px',
      boxShadow: 'var(--shadow-lg)',
      animation: 'slideUp 0.25s ease both',
    }}>
      <span style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: s.iconColor, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700, flexShrink: 0,
      }}>{s.icon}</span>
      <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: s.titleColor, fontWeight: 500 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ color: '#9CA3AF', fontSize: '18px', lineHeight: 1, padding: '0 2px' }}
        aria-label="Dismiss notification"
      >×</button>
    </div>
  );
}
