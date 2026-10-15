import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Heart, ShieldCheck, Home, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px var(--space-6) 100px', maxWidth: '960px' }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Our Mission & Values
        </span>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, marginTop: '8px', marginBottom: '16px' }}>
          Connecting loving homes with pets in need
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)', maxWidth: '680px', margin: '0 auto' }}>
          Pawhaven was founded on a simple principle: every animal deserves a safe, caring family, and every pet parent deserves the support and tools to thrive.
        </p>
      </div>

      <div style={{ borderRadius: 'var(--radius-3xl)', overflow: 'hidden', height: '360px', marginBottom: '56px', boxShadow: 'var(--shadow-lg)' }}>
        <img
          src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&q=80"
          alt="Veterinarian with dog"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '56px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Heart size={22} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '8px' }}>Compassionate Rescue</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
            We work exclusively with ethical animal rescues and municipal shelters to provide transparency into animal health and temperament.
          </p>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--color-butter)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <ShieldCheck size={22} color="#b45309" />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '8px' }}>Responsible Adoption</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
            Our structured matching criteria and multi-step reviews prevent impulse adoptions and reduce shelter return rates.
          </p>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--color-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Home size={22} color="#5b21b6" />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '8px' }}>Lifetime Post-Care</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
            Our care calendar and medical tracking empower pet owners with routine checklists and reminder tools for vaccines and checkups.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--color-cream-dark)', padding: '40px', borderRadius: 'var(--radius-3xl)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '12px' }}>Start your journey today</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', marginBottom: '24px' }}>
          Find an animal companion who matches your home, daily rhythm, and family.
        </p>
        <Link to="/pets">
          <Button size="lg">Explore Pets</Button>
        </Link>
      </div>
    </div>
  );
}
