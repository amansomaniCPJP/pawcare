import React from 'react';

export function StatCard({ label, value, icon: Icon, color = 'var(--color-primary)', bg = 'var(--color-mint)', trend, trendLabel, subtitle }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-lg)',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={22} color={color} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-medium)', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-text-primary)' }}>
          {value}
        </p>
        {trendLabel && (
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: trend > 0 ? 'var(--color-success)' : 'var(--color-text-muted)',
              marginTop: '4px',
              fontWeight: 'var(--font-medium)',
            }}
          >
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '—'} {trendLabel}
          </p>
        )}
        {subtitle && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{subtitle}</p>}
      </div>
    </div>
  );
}
