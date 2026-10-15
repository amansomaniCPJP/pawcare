import React from 'react';

const VARIANTS = {
  primary:   { bg: 'var(--color-primary)', color: '#fff', border: 'transparent', hoverBg: 'var(--color-primary-dark)' },
  secondary: { bg: 'var(--color-mint)', color: 'var(--color-primary)', border: 'var(--color-mint-dark)', hoverBg: 'var(--color-mint-dark)' },
  outline:   { bg: 'transparent', color: 'var(--color-primary)', border: 'var(--color-primary)', hoverBg: 'var(--color-primary-50)' },
  ghost:     { bg: 'transparent', color: 'var(--color-text-secondary)', border: 'transparent', hoverBg: 'var(--color-gray-100)' },
  danger:    { bg: 'var(--color-error)', color: '#fff', border: 'transparent', hoverBg: '#b91c1c' },
  white:     { bg: '#fff', color: 'var(--color-primary)', border: 'transparent', hoverBg: 'var(--color-mint)' },
};

const SIZES = {
  sm:  { height: '34px', padding: '0 14px', fontSize: 'var(--text-sm)', radius: 'var(--radius-md)' },
  md:  { height: '44px', padding: '0 20px', fontSize: 'var(--text-base)', radius: 'var(--radius-lg)' },
  lg:  { height: '52px', padding: '0 28px', fontSize: 'var(--text-lg)', radius: 'var(--radius-xl)' },
  xl:  { height: '58px', padding: '0 36px', fontSize: 'var(--text-lg)', radius: 'var(--radius-xl)' },
};

export function Button({ variant = 'primary', size = 'md', children, disabled, loading, fullWidth, onClick, type = 'button', style, ...props }) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.radius,
        border: `1.5px solid ${v.border}`,
        background: hovered && !disabled ? v.hoverBg : v.bg,
        color: v.color,
        fontWeight: 'var(--font-semibold)',
        fontFamily: 'var(--font-body)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'background var(--transition-fast)',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        ...style,
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </button>
  );
}

export function IconButton({ children, label, size = 'md', variant = 'ghost', ...props }) {
  const dim = size === 'sm' ? '32px' : size === 'lg' ? '44px' : '38px';
  return (
    <Button variant={variant} aria-label={label} style={{ width: dim, height: dim, padding: 0, borderRadius: 'var(--radius-lg)' }} {...props}>
      {children}
    </Button>
  );
}
