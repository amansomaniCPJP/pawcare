import React, { useEffect, useState } from 'react';
import { petService } from '@/services/petService';
import { userService } from '@/services/userService';
import { PetGrid } from '@/components/pets/PetGrid';
import { LoadingSpinner, EmptyState } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/features/notifications/ToastContext';

export default function FavouritesPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadFavs = async () => {
    const favIds = await userService.getFavourites();
    if (favIds.length === 0) {
      setPets([]);
      setLoading(false);
      return;
    }
    try {
      const all = await petService.getAll({ limit: 100 });
      setPets(all.pets.filter((p) => favIds.includes(p.id)));
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFavs();
  }, []);

  const handleFavouriteToggle = () => {
    loadFavs();
  };

  if (loading) return <LoadingSpinner size={40} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Saved Favourites</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Pets you've bookmarked while browsing. Check their availability or start an adoption application.
        </p>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="No favourite pets saved yet"
          description="Click the heart icon on any pet card to save them here for quick comparison."
          action={<Button onClick={() => (window.location.href = '/pets')}>Browse Available Pets</Button>}
        />
      ) : (
        <PetGrid pets={pets} onFavouriteToggle={handleFavouriteToggle} />
      )}
    </div>
  );
}
