import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { petService } from '@/services/petService';
import { PetGallery } from '@/components/pets/PetGallery';
import { FavouriteButton } from '@/components/pets/FavouriteButton';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, ErrorState } from '@/components/ui/Skeleton';
import { MapPin, Heart, Share2, Shield, Calendar, Award, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/features/notifications/ToastContext';

export default function PetDetailPage() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    petService
      .getById(petId)
      .then((data) => {
        setPet(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [petId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Pet link copied to clipboard!');
    }
  };

  if (loading) return <LoadingSpinner size={48} />;
  if (error || !pet) {
    return (
      <div className="container" style={{ padding: '60px var(--space-6)' }}>
        <ErrorState
          title="Pet Profile Not Found"
          description="The pet you are looking for may have been adopted or the ID is invalid."
          retry={() => navigate('/pets')}
        />
      </div>
    );
  }

  const isAvailable = pet.status === 'available';

  return (
    <div className="container" style={{ padding: '40px var(--space-6) 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <span>/</span>
        <Link to="/pets" style={{ textDecoration: 'none', color: 'inherit' }}>Pets</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{pet.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'start' }} className="pet-detail-layout">
        {/* Gallery column */}
        <div>
          <PetGallery images={pet.images} name={pet.name} />
        </div>

        {/* Profile Details column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header & Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StatusBadge status={pet.status} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>ID: {pet.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FavouriteButton petId={pet.id} size={20} />
                <button
                  onClick={handleShare}
                  aria-label="Share profile"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#fff',
                    border: '1.5px solid var(--color-gray-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: '6px' }}>{pet.name}</h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              {pet.breed} • {pet.species}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              <MapPin size={16} /> {pet.location}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Gender</span>
              <p style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{pet.gender}</p>
            </div>
            <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Size</span>
              <p style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{pet.size}</p>
            </div>
            <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Weight</span>
              <p style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{pet.weight || 'N/A'}</p>
            </div>
          </div>

          {/* About / Description */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '12px' }}>About {pet.name}</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-sm)' }}>
              {pet.description}
            </p>

            {pet.personality && pet.personality.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  PERSONALITY TRAITS
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {pet.personality.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: 'var(--color-mint)',
                        color: 'var(--color-primary)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ideal Home Info */}
          {pet.idealHome && (
            <div style={{ background: 'var(--color-cream)', padding: '20px 24px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Shield size={16} /> Ideal Home Match
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{pet.idealHome}</p>
            </div>
          )}

          {/* Medical Summary */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: '12px' }}>Health & Medical Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
                <CheckCircle size={16} color={pet.healthInfo?.vaccinated ? 'var(--color-success)' : 'var(--color-gray-400)'} />
                <span>{pet.healthInfo?.vaccinated ? 'Vaccinated' : 'Vaccination needed'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
                <CheckCircle size={16} color={pet.healthInfo?.neutered ? 'var(--color-success)' : 'var(--color-gray-400)'} />
                <span>{pet.healthInfo?.neutered ? 'Spayed / Neutered' : 'Not neutered'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
                <CheckCircle size={16} color={pet.healthInfo?.microchipped ? 'var(--color-success)' : 'var(--color-gray-400)'} />
                <span>{pet.healthInfo?.microchipped ? 'Microchipped' : 'Microchip pending'}</span>
              </div>
            </div>
            {pet.healthInfo?.healthNotes && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic', background: 'var(--color-gray-50)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                {pet.healthInfo.healthNotes}
              </p>
            )}
          </div>

          {/* Medical history + donor (MEDICAL_RECORD, VETERINARIAN, PET_DONATION tables) */}
          {(pet.medicalRecords?.length > 0 || pet.donation) && (
            <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: '12px' }}>Veterinary History</h2>
              {pet.medicalRecords?.map((m) => (
                <div key={m.record_id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-gray-100)', fontSize: 'var(--text-xs)', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <span>
                    <strong>{m.treatment || 'Checkup'}</strong>
                    {m.vaccination ? ` · ${m.vaccination} vaccine` : ''}
                    {m.medical_history ? ` · ${m.medical_history}` : ''}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{m.vet_name} · {m.record_date}</span>
                </div>
              ))}
              {pet.donation && (
                <p style={{ marginTop: '12px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Donated to the shelter by <strong>{pet.donation.donor_name}</strong> on {pet.donation.donation_date}.
                </p>
              )}
            </div>
          )}

          {/* Shelter Info & Action Box */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-2xl)', border: '2px solid var(--color-mint-dark)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>CARED FOR BY</span>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-base)' }}>{pet.shelterName || 'Partner Shelter'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ADOPTION FEE</span>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>${pet.adoptionFee || 100}</p>
              </div>
            </div>

            {isAvailable ? (
              <Link to={`/adopt/${pet.id}`} style={{ width: '100%' }}>
                <Button fullWidth size="lg">
                  Apply to Adopt {pet.name}
                </Button>
              </Link>
            ) : (
              <Button fullWidth size="lg" disabled variant="secondary">
                Adoption Unavailable ({pet.status})
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pet-detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
