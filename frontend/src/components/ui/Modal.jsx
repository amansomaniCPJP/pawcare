import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, size = 'md', hideHeader = false }) {
  const overlayRef = useRef(null);
  const widths = { sm: '420px', md: '560px', lg: '720px', xl: '900px', full: '95vw' };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(37, 51, 43, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 'var(--z-modal)',
        backdropFilter: 'blur(2px)',
        animation: 'fadeIn 0.2s ease both',
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: widths[size] || widths.md,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'scaleIn 0.2s ease both',
          overflow: 'hidden',
        }}
      >
        {!hideHeader && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--color-gray-100)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                color: 'var(--color-gray-400)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                background: 'none',
                border: 'none',
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmVariant = 'danger', loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ padding: '24px' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', lineHeight: 'var(--leading-relaxed)' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
