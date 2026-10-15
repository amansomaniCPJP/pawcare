import React from 'react';

export function Tabs({ tabs, activeTab, onChange, variant = 'underline' }) {
  if (variant === 'pills') {
    return (
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              background: activeTab === tab.value ? 'var(--color-primary)' : 'var(--color-gray-100)',
              color: activeTab === tab.value ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.label}
            {tab.count !== undefined && <span style={{ marginLeft: '6px', opacity: 0.8 }}>({tab.count})</span>}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', borderBottom: '2px solid var(--color-gray-100)', gap: 0, overflowX: 'auto' }}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{
            padding: '12px 20px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: activeTab === tab.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === tab.value ? '2px solid var(--color-primary)' : '2px solid transparent',
            background: 'none',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
            transition: 'color var(--transition-fast)',
          }}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              style={{
                marginLeft: '8px',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                background: activeTab === tab.value ? 'var(--color-mint)' : 'var(--color-gray-100)',
                color: activeTab === tab.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
