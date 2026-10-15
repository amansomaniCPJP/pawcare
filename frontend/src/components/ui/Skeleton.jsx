import React from 'react';

export function Skeleton({ width = '100%', height = '16px', radius = '8px', style }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function PetCardSkeleton() {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
      <Skeleton height="240px" radius="0" />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Skeleton height="20px" width="60%" />
        <Skeleton height="14px" width="80%" />
        <Skeleton height="14px" width="50%" />
        <Skeleton height="38px" radius="10px" />
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-16) var(--space-6)',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      {icon && <div style={{ fontSize: '48px', lineHeight: 1 }}>{icon}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{title}</h3>
        {description && <p style={{ color: 'var(--color-text-muted)', maxWidth: '380px', lineHeight: 'var(--leading-relaxed)' }}>{description}</p>}
      </div>
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}

export function LoadingSpinner({ size = 32, color = 'var(--color-primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid var(--color-mint)',
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, retry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 24px', textAlign: 'center', gap: '12px' }}>
      <div style={{ fontSize: '40px' }}>⚠️</div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{title}</h3>
      {description && <p style={{ color: 'var(--color-text-muted)', maxWidth: '360px' }}>{description}</p>}
      {retry && (
        <button
          onClick={retry}
          style={{
            marginTop: '8px',
            color: 'var(--color-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            fontFamily: 'inherit',
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
