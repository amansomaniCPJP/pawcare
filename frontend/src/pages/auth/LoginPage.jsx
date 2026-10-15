import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/features/notifications/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('sarah@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      if (u.role === 'admin') navigate('/admin');
      else navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'user') {
      setEmail('sarah@example.com');
      setPassword('password123');
    } else {
      setEmail('admin@pawhaven.com');
      setPassword('admin123');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: 'var(--radius-3xl)', padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '6px' }}>Sign In to Pawhaven</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Manage your adoption applications and pet care.
        </p>
      </div>

      {/* Demo Credentials quick switcher */}
      <div style={{ background: 'var(--color-cream)', padding: '12px 14px', borderRadius: 'var(--radius-xl)', marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Demo One-Click Accounts:
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setDemoCredentials('user')}
            style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: '#fff', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            Pet Adopter (Sarah)
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('admin')}
            style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: '#fff', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            Staff Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ position: 'relative' }}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-muted)', display: 'flex' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
            {error}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} size="lg">
          Sign In
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
          Create an account
        </Link>
      </div>
    </div>
  );
}
