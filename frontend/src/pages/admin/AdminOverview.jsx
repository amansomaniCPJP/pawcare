import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petService } from '@/services/petService';
import { applicationService } from '@/services/applicationService';
import { recordsService } from '@/services/recordsService';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import { PawPrint, ClipboardList, Users, Stethoscope, TrendingUp, ArrowRight } from 'lucide-react';
import { useToast } from '@/features/notifications/ToastContext';

export default function AdminOverview() {
  const [pets, setPets] = useState([]);
  const [apps, setApps] = useState([]);
  const [vetCount, setVetCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    Promise.all([petService.getAll({ limit: 100 }), applicationService.getAll(), recordsService.vets()]).then(([pRes, aRes, vets]) => {
      setPets(pRes.pets);
      setApps(aRes);
      setVetCount(vets.length);
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner size={40} />;

  const availableCount = pets.filter((p) => p.status === 'available').length;
  const pendingApps = apps.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedApps = apps.filter((a) => a.status === 'approved' || a.status === 'completed').length;
  const openApps = apps.filter((a) => a.status === 'submitted' || a.status === 'under_review');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Shelter Operations Overview</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Monitor pet occupancy, incoming adoption review queues, and system users.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard
          label="Total Pets in System"
          value={pets.length}
          icon={PawPrint}
          color="var(--color-primary)"
          bg="var(--color-mint)"
          subtitle={`${availableCount} currently available`}
        />
        <StatCard
          label="Pending Applications"
          value={pendingApps}
          icon={ClipboardList}
          color="#b45309"
          bg="var(--color-butter)"
          trend={1}
          trendLabel="Needs staff review"
        />
        <StatCard
          label="Adoptions Finalized"
          value={approvedApps}
          icon={TrendingUp}
          color="#15803d"
          bg="#dcfce7"
        />
        <StatCard
          label="Veterinarians"
          value={vetCount}
          icon={Stethoscope}
          color="#5b21b6"
          bg="var(--color-lavender)"
        />
      </div>

      {/* Recent Applications Requiring Review */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Pending Review Queue</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Latest adoption applications awaiting decision</p>
          </div>
          <Link to="/admin/applications" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700 }}>
            Open Review Queue →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-gray-100)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Pet</th>
                <th style={{ padding: '12px 14px' }}>Applicant</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {openApps.slice(0, 5).map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                  <td style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={app.petImage} alt={app.petName} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700 }}>{app.petName}</span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--color-text-secondary)' }}>
                    {app.answers?.fullName || '—'}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <StatusBadge status={app.status} />
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <Link to="/admin/applications">
                      <Button size="sm" variant="outline">Review</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {openApps.length === 0 && (
            <p style={{ padding: '20px 14px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>No applications are waiting for a decision.</p>
          )}
        </div>
      </div>
    </div>
  );
}
