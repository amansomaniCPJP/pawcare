import React from 'react';

export function Input({ label, error, hint, prefix, suffix, fullWidth = true, id, required, ...props }) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--color-error)', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && <span style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', display: 'flex' }}>{prefix}</span>}
        <input
          id={inputId}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: '44px',
            padding: `0 ${suffix ? '42px' : '14px'} 0 ${prefix ? '42px' : '14px'}`,
            border: `1.5px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
            borderRadius: 'var(--radius-lg)',
            background: '#fff',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
            boxShadow: focused ? '0 0 0 3px rgba(57,118,83,0.12)' : 'none',
          }}
          aria-invalid={!!error}
          {...props}
        />
        {suffix && <span style={{ position: 'absolute', right: '12px', color: 'var(--color-text-muted)', display: 'flex' }}>{suffix}</span>}
      </div>
      {error && <span role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{hint}</span>}
    </div>
  );
}

export function Textarea({ label, error, hint, id, required, rows = 4, ...props }) {
  const inputId = id || `ta-${Math.random().toString(36).slice(2, 7)}`;
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--color-error)', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '12px 14px',
          resize: 'vertical',
          border: `1.5px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
          borderRadius: 'var(--radius-lg)',
          background: '#fff',
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          fontFamily: 'inherit',
          boxShadow: focused ? '0 0 0 3px rgba(57,118,83,0.12)' : 'none',
        }}
        {...props}
      />
      {error && <span role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{hint}</span>}
    </div>
  );
}

export function Select({ label, error, id, required, children, ...props }) {
  const inputId = id || `sel-${Math.random().toString(36).slice(2, 7)}`;
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--color-error)', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <select
        id={inputId}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          height: '44px',
          padding: '0 36px 0 14px',
          border: `1.5px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
          borderRadius: 'var(--radius-lg)',
          background: '#fff',
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>{error}</span>}
    </div>
  );
}

export function Checkbox({ label, error, id, ...props }) {
  const inputId = id || `chk-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label htmlFor={inputId} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        <input
          type="checkbox"
          id={inputId}
          style={{ width: '18px', height: '18px', marginTop: '1px', accentColor: 'var(--color-primary)', cursor: 'pointer', flexShrink: 0 }}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <span role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', marginLeft: '28px' }}>{error}</span>}
    </div>
  );
}
