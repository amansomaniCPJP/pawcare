import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <PageBtn onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft size={16} />
      </PageBtn>
      {visible.map((p, i) => {
        const prev = visible[i - 1];
        return (
          <React.Fragment key={p}>
            {prev && p - prev > 1 && <span style={{ color: 'var(--color-text-muted)', padding: '0 4px' }}>…</span>}
            <PageBtn onClick={() => onChange(p)} active={p === page}>
              {p}
            </PageBtn>
          </React.Fragment>
        );
      })}
      <PageBtn onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight size={16} />
      </PageBtn>
    </nav>
  );
}

function PageBtn({ children, onClick, disabled, active, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...props}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-lg)',
        border: active ? '2px solid var(--color-primary)' : '1.5px solid var(--color-gray-200)',
        background: active ? 'var(--color-primary)' : '#fff',
        color: active ? '#fff' : disabled ? 'var(--color-gray-300)' : 'var(--color-text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: active ? 'var(--font-bold)' : 'var(--font-medium)',
        fontSize: 'var(--text-sm)',
      }}
    >
      {children}
    </button>
  );
}
