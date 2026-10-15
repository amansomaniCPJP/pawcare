import React, { useEffect, useState } from 'react';
import { recordsService } from '@/services/recordsService';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { BarChart2, TrendingUp, Heart, Award } from 'lucide-react';

const pct = (n, total) => (total ? Math.round((100 * n) / total) : 0);

function Bars({ items, empty }) {
  if (!items.length) return <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{empty}</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {items.map((item) => (
        <div key={item.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: '6px' }}>
            <span>{item.label}</span>
            <span>{item.right}</span>
          </div>
          <div style={{ height: '10px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const card = { background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '24px', boxShadow: 'var(--shadow-card)' };

export default function AdminReportsPage() {
  const toast = useToast();
  const [r, setR] = useState(null);

  useEffect(() => {
    recordsService.reports().then(setR).catch((err) => toast.error(err.message));
  }, []);

  if (!r) return <LoadingSpinner size={40} />;

  const a = r.applications;
  const finalizedPets = r.by_species.reduce((sum, x) => sum + x.adoptions, 0);
  const speciesColors = ['var(--color-primary)', '#b45309', '#5b21b6', '#0369a1'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Adoption Analytics & Reports</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Live numbers calculated from the database (JOIN, GROUP BY and aggregate queries).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard label="Adoption Velocity" value={r.avg_days_to_adopt != null ? `${r.avg_days_to_adopt} Days` : '—'}
          icon={TrendingUp} color="var(--color-primary)" bg="var(--color-mint)"
          subtitle="Average days from donation to adoption" />
        <StatCard label="Application Approval Rate" value={r.approval_rate != null ? `${r.approval_rate}%` : '—'}
          icon={Award} color="#b45309" bg="var(--color-butter)" subtitle="Approved or completed vs. rejected" />
        <StatCard label="Adoptions Finalized" value={`${finalizedPets} Pets`}
          icon={Heart} color="var(--color-coral)" bg="#fce8e3" subtitle={`${a.open} application${a.open === 1 ? '' : 's'} still open`} />
        <StatCard label="Donations Received" value={r.totals.donations}
          icon={BarChart2} color="#5b21b6" bg="var(--color-lavender)" subtitle={`${r.totals.vets} vets · ${r.totals.adopters} adopters`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }} className="reports-grid">
        <div style={card}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '16px' }}>Adoptions by Species</h2>
          <Bars empty="No finalized adoptions yet."
            items={r.by_species.map((x, i) => ({ label: x.species, right: `${x.adoptions} adoption${x.adoptions > 1 ? 's' : ''} (${pct(x.adoptions, finalizedPets)}%)`, pct: pct(x.adoptions, finalizedPets), color: speciesColors[i % 4] }))} />
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '16px' }}>Application Outcomes</h2>
          <Bars empty="No applications yet."
            items={[
              { label: 'Approved & Finalized', n: a.finalized, color: 'var(--color-success)' },
              { label: 'Still Open (Pending / Under Review)', n: a.open, color: '#d97706' },
              { label: 'Withdrawn by Applicant', n: a.withdrawn, color: 'var(--color-gray-400)' },
              { label: 'Rejected', n: a.rejected, color: 'var(--color-error)' },
            ].map((x) => ({ label: x.label, right: `${x.n} of ${a.total} (${pct(x.n, a.total)}%)`, pct: pct(x.n, a.total), color: x.color }))} />
        </div>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '16px' }}>Adoptions by Month</h2>
        <Bars empty="No finalized adoptions yet."
          items={r.by_month.map((m) => ({ label: m.month, right: `${m.adoptions}`, pct: pct(m.adoptions, Math.max(...r.by_month.map((x) => x.adoptions))), color: 'var(--color-primary)' }))} />
      </div>
      <style>{`
        @media (max-width: 900px) {
          .reports-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
