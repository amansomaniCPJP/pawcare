import React, { useState } from 'react';

export function PetGallery({ images, name }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '420px',
          background: 'var(--color-gray-100)',
          borderRadius: 'var(--radius-2xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
        }}
      >
        No photo available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          width: '100%',
          height: '440px',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          background: 'var(--color-gray-100)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <img
          src={images[activeIdx]}
          alt={`${name} photo ${activeIdx + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: activeIdx === idx ? '3px solid var(--color-primary)' : '2px solid transparent',
                padding: 0,
                cursor: 'pointer',
                opacity: activeIdx === idx ? 1 : 0.65,
                transition: 'opacity var(--transition-fast), border-color var(--transition-fast)',
                flexShrink: 0,
              }}
            >
              <img src={img} alt={`${name} thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
