import React from 'react';
import { X } from 'lucide-react';

export function PetFilterChips({ filters, onRemove, onClearAll }) {
  const activeChips = [];

  if (filters.species && filters.species !== 'all') {
    activeChips.push({ key: 'species', label: `Species: ${filters.species}` });
  }
  if (filters.gender && filters.gender !== 'all') {
    activeChips.push({ key: 'gender', label: `Gender: ${filters.gender}` });
  }
  if (filters.size && filters.size !== 'all') {
    activeChips.push({ key: 'size', label: `Size: ${filters.size}` });
  }
  if (filters.status && filters.status !== 'all') {
    activeChips.push({ key: 'status', label: `Status: ${filters.status}` });
  }
  if (filters.search) {
    activeChips.push({ key: 'search', label: `Search: "${filters.search}"` });
  }

  if (activeChips.length === 0) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active filters:</span>
      {activeChips.map((chip) => (
        <span
          key={chip.key}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-mint)',
            color: 'var(--color-primary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
          }}
        >
          {chip.label}
          <button
            onClick={() => onRemove(chip.key)}
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
            aria-label={`Remove filter ${chip.label}`}
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Clear all
      </button>
    </div>
  );
}
