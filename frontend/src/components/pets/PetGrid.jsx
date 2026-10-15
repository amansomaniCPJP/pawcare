import React from 'react';
import { PetCard } from './PetCard';
import { PetCardSkeleton, EmptyState } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export function PetGrid({ pets, loading, emptyAction }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <PetCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <EmptyState
        icon="🐾"
        title="No pets found"
        description="Try relaxing your filters or searching with a different term."
        action={
          emptyAction && (
            <Button variant="outline" onClick={emptyAction}>
              Reset Filters
            </Button>
          )
        }
      />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
