import React, { useEffect, useState } from 'react';
import { recordsService } from '@/services/recordsService';
import { LoadingSpinner, EmptyState } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { Search } from 'lucide-react';

export default function AdminUsersPage() {
  const toast = useToast();
  const [adopters, setAdopters] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    recordsService.adopters().then(setAdopters).catch((err) => { toast.error(err.message); setAdopters([]); });
  }, []);

  if (!adopters) return <LoadingSpinner size={40} />;

  const q = search.toLowerCase();
  const filtered = adopters.filter((u) =>
    [u.adopter_name, u.email, u.address, u.phone].some((v) => (v || '').toLowerCase().includes(q)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Adopter Directory</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Everyone who has applied to adopt, with their application counts (ADOPTER table joined with ADOPTION).
        </p>
      </div>

      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--color-text-muted)" />
        <input type="text" placeholder="Search by name, email, phone or city..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: 'var(--text-sm)' }} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No adopters found" description="Adopters appear here after they submit an application." />
      ) : (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                  {['Adopter', 'Email', 'Phone', 'Address', 'Applications', 'Pets adopted'].map((h) => <th key={h} style={{ padding: '14px 18px' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.adopter_id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 800 }}>{u.adopter_name}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '14px 18px' }}>{u.phone}</td>
                    <td style={{ padding: '14px 18px' }}>{u.address}</td>
                    <td style={{ padding: '14px 18px' }}>{u.total_applications}</td>
                    <td style={{ padding: '14px 18px' }}>{u.adopted_pets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
