import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/features/notifications/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input, Checkbox } from '@/components/ui/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!consent) {
      setError('You must agree to the Terms of Service & Privacy Policy');
      return;
    }

    try {
      const u = await register(name, email, password);
      toast.success(`Welcome to Pawhaven, ${u.name}!`);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: 'var(--radius-3xl)', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '6px' }}>Join Pawhaven</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Create an adopter account to apply for pets and manage care.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Input
          label="Your Name"
          required
          placeholder="e.g. Alex Rivera"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="alex@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          required
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />

        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
            {error}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} size="lg">
          Create Account
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
          Log in here
        </Link>
      </div>
    </div>
  );
}
