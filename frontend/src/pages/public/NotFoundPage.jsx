import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '80px var(--space-6)', textAlign: 'center', maxWidth: '520px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐾</div>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '10px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: '28px' }}>
        The page you are looking for has wandered off, been adopted, or doesn't exist.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
        <Link to="/pets">
          <Button variant="outline">Browse Pets</Button>
        </Link>
      </div>
    </div>
  );
}
