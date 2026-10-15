import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await authService.sendPasswordReset(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: 'var(--radius-3xl)', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '8px', textAlign: 'center' }}>
        Reset Password
      </h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '24px' }}>
        Enter your registered email address to receive password reset instructions.
      </p>

      {sent ? (
        <div style={{ textAlign: 'center', background: 'var(--color-mint)', padding: '24px', borderRadius: 'var(--radius-2xl)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '8px' }}>
            Check your inbox
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            If an account is associated with {email}, a recovery link has been sent.
          </p>
          <Link to="/login">
            <Button variant="secondary" fullWidth size="sm">
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" fullWidth loading={loading}>
            Send Reset Instructions
          </Button>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link to="/login" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              ← Return to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
