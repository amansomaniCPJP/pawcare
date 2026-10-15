import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PetSearchBar({ onSearch, initialValue = '' }) {
  const [val, setVal] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(val);
  };

  const handleClear = () => {
    setVal('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '540px' }}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Search by name, breed, or location..."
          style={{
            width: '100%',
            height: '46px',
            padding: '0 40px 0 42px',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-gray-200)',
            background: '#fff',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            boxShadow: 'var(--shadow-xs)',
          }}
        />
        {val && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <Button type="submit" size="md">
        Search
      </Button>
    </form>
  );
}
