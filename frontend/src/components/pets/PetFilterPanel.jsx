import React from 'react';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function PetFilterPanel({ filters, onChange, onReset }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700 }}>Filter Pets</h3>
        <button
          onClick={onReset}
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-primary)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reset All
        </button>
      </div>

      <Select
        label="Species"
        value={filters.species || 'all'}
        onChange={(e) => onChange('species', e.target.value)}
      >
        <option value="all">All Species</option>
        <option value="dog">Dogs</option>
        <option value="cat">Cats</option>
        <option value="rabbit">Rabbits</option>
      </Select>

      <Select
        label="Gender"
        value={filters.gender || 'all'}
        onChange={(e) => onChange('gender', e.target.value)}
      >
        <option value="all">Any Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </Select>

      <Select
        label="Size"
        value={filters.size || 'all'}
        onChange={(e) => onChange('size', e.target.value)}
      >
        <option value="all">Any Size</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </Select>

      <Select
        label="Availability"
        value={filters.status || 'all'}
        onChange={(e) => onChange('status', e.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="available">Available Now</option>
        <option value="pending">Adoption Pending</option>
      </Select>
    </div>
  );
}
