import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { petService } from '@/services/petService';
import { PetCard } from '@/components/pets/PetCard';
import { Button } from '@/components/ui/Button';
import { PetCardSkeleton } from '@/components/ui/Skeleton';
import { Search, Heart, Sparkles, ShieldCheck, CalendarCheck, Home, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/features/notifications/ToastContext';

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [quickSpecies, setQuickSpecies] = useState('all');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    petService.getFeatured().then((pets) => {
      setFeaturedPets(pets);
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (quickSearch) query.set('search', quickSearch);
    if (quickSpecies !== 'all') query.set('species', quickSpecies);
    navigate(`/pets?${query.toString()}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          padding: '60px 0 80px',
          background: 'linear-gradient(180deg, var(--color-cream) 0%, #F5EFE6 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-mint)',
                color: 'var(--color-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Sparkles size={14} /> Welcome to Pawhaven
            </div>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 900,
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
                marginBottom: '20px',
              }}
            >
              Your new best friend is <span style={{ color: 'var(--color-primary)' }}>waiting for you.</span>
            </h1>
            <p
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '520px',
                marginBottom: '32px',
              }}
            >
              We connect loving families with rescue pets in need of homes — and give you modern tools to track veterinary care, vaccines, and daily routines after adoption.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link to="/pets">
                <Button size="lg">Find Your Companion</Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  How Adoption Works
                </Button>
              </a>
            </div>

            {/* Quick search bar */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                background: '#fff',
                padding: '10px 14px',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                maxWidth: '520px',
              }}
            >
              <Search size={18} color="var(--color-text-muted)" style={{ marginLeft: '6px' }} />
              <input
                type="text"
                placeholder="Search dog, cat, breed..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 'var(--text-sm)',
                  flex: 1,
                  background: 'transparent',
                }}
              />
              <select
                value={quickSpecies}
                onChange={(e) => setQuickSpecies(e.target.value)}
                style={{
                  border: 'none',
                  background: 'var(--color-gray-50)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="all">All Pets</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="rabbit">Rabbits</option>
              </select>
              <Button type="submit" size="sm">
                Search
              </Button>
            </form>
          </div>

          {/* Hero composition */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '480px',
                borderRadius: 'var(--radius-3xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
              }}
            >
              <img
                src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                alt="Two happy dogs running in grass"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Floating badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                background: '#fff',
                padding: '16px 22px',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--color-butter)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                🏠
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-primary)' }}>1,200+</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Pets adopted this year (Demo)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PETS SECTION */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Meet the locals
              </span>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: '4px' }}>Pets looking for a home</h2>
            </div>
            <Link to="/pets" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              View all pets <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <PetCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. HOW ADOPTION WORKS */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 56px' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Simple 3-Step Journey
            </span>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: '6px', marginBottom: '12px' }}>
              How Adoption Works at Pawhaven
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
              We partner directly with verified shelters to make adoption clear, supportive, and safe for everyone.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div
              style={{
                background: '#fff',
                padding: '36px 28px',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                🔍
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>1. Discover Your Match</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                Filter by species, temperament, activity level, and home requirements to find the ideal pet for your lifestyle.
              </p>
            </div>

            <div
              style={{
                background: '#fff',
                padding: '36px 28px',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--color-butter)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                📝
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>2. Submit Online Application</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                Fill out our structured adoption form covering your living space, experience, and routine in just a few minutes.
              </p>
            </div>

            <div
              style={{
                background: '#fff',
                padding: '36px 28px',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--color-lavender)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                🎉
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>3. Meet & Bring Them Home</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                Once approved, visit the shelter for a meet-and-greet, finalize adoption details, and begin your journey together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARE MANAGEMENT PREVIEW */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Beyond Adoption
            </span>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: '6px', marginBottom: '16px' }}>
              Built-in care tools for every day after.
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', marginBottom: '24px' }}>
              Adopting is only day one. Pawhaven includes an integrated pet dashboard to manage vaccination dates, medications, vet checkups, and recurring feeding schedules.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" /> Vaccination & medical record tracking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" /> Daily feeding & medication checklists
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--color-primary)" /> Vet appointments & grooming calendar
              </li>
            </ul>

            <Link to="/care-guide">
              <Button variant="secondary">Explore Pet Care Guides</Button>
            </Link>
          </div>

          <div
            style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--radius-3xl)',
              padding: '32px',
              border: '1px solid var(--color-gray-200)',
            }}
          >
            <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '20px', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>Today's Care Tasks</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700 }}>2 of 3 done</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--color-success)' }}>✓</span>
                  <span style={{ fontSize: 'var(--text-xs)', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>Morning walk & park run</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--color-success)' }}>✓</span>
                  <span style={{ fontSize: 'var(--text-xs)', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>Dry food breakfast (1 cup)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--color-mint)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>○</span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)' }}>Evening medication (Heartgard)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section style={{ padding: '64px 0', background: 'var(--color-primary)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: '#fff', marginBottom: '14px' }}>
            Ready to give a pet their forever home?
          </h2>
          <p style={{ fontSize: 'var(--text-base)', opacity: 0.9, lineHeight: 'var(--leading-relaxed)', marginBottom: '28px' }}>
            Hundreds of loving dogs, cats, and small animals are waiting in verified shelters right now.
          </p>
          <Link to="/pets">
            <Button variant="white" size="lg">
              Explore Available Pets
            </Button>
          </Link>
        </div>
      </section>
      <style>{`
        @media (max-width: 900px) {
          section > .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
