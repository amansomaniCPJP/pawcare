import React from 'react';

const BADGE_VARIANTS = {
  available:   { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#16a34a' },
  pending:     { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#d97706' },
  adopted:     { bg: 'var(--color-lavender)', color: '#5b21b6', border: '#c4b5fd', dot: '#7c3aed' },
  unavailable: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)', border: 'var(--color-gray-200)', dot: 'var(--color-gray-400)' },
  archived:    { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)', border: 'var(--color-gray-200)', dot: 'var(--color-gray-400)' },
  submitted:   { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb' },
  under_review:{ bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#d97706' },
  approved:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#16a34a' },
  rejected:    { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#dc2626' },
  withdrawn:   { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)', border: 'var(--color-gray-200)', dot: 'var(--color-gray-400)' },
  completed:   { bg: 'var(--color-mint)', color: 'var(--color-primary)', border: 'var(--color-mint-dark)', dot: 'var(--color-primary)' },
  additional_info_required: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', dot: '#ea580c' },
  info:        { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb' },
  success:     { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#16a34a' },
  warning:     { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#d97706' },
  error:       { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#dc2626' },
  neutral:     { bg: 'var(--color-gray-100)', color: 'var(--color-gray-600)', border: 'var(--color-gray-200)', dot: 'var(--color-gray-400)' },
  primary:     { bg: 'var(--color-mint)', color: 'var(--color-primary)', border: 'var(--color-mint-dark)', dot: 'var(--color-primary)' },
};

export function Badge({ variant = 'neutral', label, dot = true, size = 'md' }) {
  const s = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        whiteSpace: 'nowrap',
      }}
    >
      {dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />}
      {label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const LABELS = {
    available: 'Available',
    pending: 'Pending',
    adopted: 'Adopted',
    unavailable: 'Unavailable',
    archived: 'Archived',
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
    completed: 'Completed',
    additional_info_required: 'More Info Needed',
  };
  return <Badge variant={status} label={LABELS[status] || status} />;
}
