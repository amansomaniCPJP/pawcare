import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PawPrint size={17} color="#fff" fill="#fff" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'var(--text-xl)',
              color: 'var(--color-primary)',
            }}
          >
            Pawhaven
          </span>
        </Link>
        <Link to="/" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          ← Back to site
        </Link>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        {children}
      </main>
    </div>
  );
}
