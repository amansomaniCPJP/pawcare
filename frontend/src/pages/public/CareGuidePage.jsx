import React, { useState } from 'react';
import { MOCK_CARE_ARTICLES } from '@/services/mock/data';
import { Button } from '@/components/ui/Button';
import { BookOpen, Clock, Tag } from 'lucide-react';

export default function CareGuidePage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'grooming', label: 'Grooming' },
    { id: 'vaccinations', label: 'Vaccines' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'adoption', label: 'Bringing Home' },
    { id: 'preventive', label: 'Preventive Care' },
    { id: 'ownership', label: 'Responsible Ownership' },
  ];

  const filtered = MOCK_CARE_ARTICLES.filter((art) => {
    const matchCat = selectedCat === 'all' || art.category === selectedCat;
    const matchSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="container" style={{ padding: '40px var(--space-6) 80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
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
            marginBottom: '12px',
          }}
        >
          <BookOpen size={14} /> Knowledge Base
        </div>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: '12px' }}>
          Pet Care & Ownership Guides
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
          Practical advice on nutrition, vaccination routines, grooming, and behavioral transitions for newly adopted companions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                background: selectedCat === c.id ? 'var(--color-primary)' : '#fff',
                color: selectedCat === c.id ? '#fff' : 'var(--color-text-secondary)',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search articles on feeding, grooming, vaccines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '44px',
            padding: '0 16px',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-gray-200)',
            background: '#fff',
            fontSize: 'var(--text-sm)',
            outline: 'none',
          }}
        />
      </div>

      {/* Article Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
        {filtered.map((art) => (
          <article
            key={art.id}
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform var(--transition-fast)',
            }}
          >
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img
                src={art.image}
                alt={art.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <span style={{ background: 'var(--color-mint)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, textTransform: 'capitalize' }}>
                  {art.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {art.readTime} min read
                </span>
              </div>

              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                {art.title}
              </h2>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                {art.summary}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>
                  Read Guide →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
