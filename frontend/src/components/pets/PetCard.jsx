import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sparkles } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { FavouriteButton } from './FavouriteButton';

export function PetCard({ pet, onFavouriteToggle }) {
  const primaryImage = pet.images && pet.images.length > 0 ? pet.images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
        position: 'relative',
      }}
      className="pet-card"
    >
      <div style={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden', background: 'var(--color-gray-100)' }}>
        <img
          src={primaryImage}
          alt={pet.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="pet-img"
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <StatusBadge status={pet.status} />
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <FavouriteButton petId={pet.id} onToggle={onFavouriteToggle} />
        </div>
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {pet.name}
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-mint)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
            {pet.species}
          </span>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {pet.breed}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} /> {pet.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} /> {pet.size} • {pet.gender}
          </span>
        </div>

        {pet.personality && pet.personality.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
            {pet.personality.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '11px',
                  background: 'var(--color-gray-50)',
                  border: '1px solid var(--color-gray-200)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <Link
            to={`/pets/${pet.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '10px 16px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-cream)',
              border: '1px solid var(--color-cream-dark)',
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              textDecoration: 'none',
              transition: 'background var(--transition-fast)',
            }}
          >
            View Profile
          </Link>
        </div>
      </div>
      <style>{`
        .pet-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }
        .pet-card:hover .pet-img { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
