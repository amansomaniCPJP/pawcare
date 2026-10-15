import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/features/notifications/ToastContext';

export function FavouriteButton({ petId, initialFavourite = false, onToggle, size = 18 }) {
  const [isFav, setIsFav] = useState(() => initialFavourite || userService.isFavourite(petId));
  const [animating, setAnimating] = useState(false);
  const toast = useToast();

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    const updated = await userService.toggleFavourite(petId);
    const active = updated.includes(petId);
    setIsFav(active);
    toast.info(active ? 'Added to favourites!' : 'Removed from favourites');
    if (onToggle) onToggle(active);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isFav ? 'Remove from favourites' : 'Save to favourites'}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform var(--transition-fast)',
        transform: animating ? 'scale(1.2)' : 'scale(1)',
      }}
    >
      <Heart size={size} color={isFav ? 'var(--color-coral)' : '#6B7280'} fill={isFav ? 'var(--color-coral)' : 'none'} />
    </button>
  );
}
