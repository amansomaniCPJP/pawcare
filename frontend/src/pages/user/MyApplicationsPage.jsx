import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { applicationService } from '@/services/applicationService';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { LoadingSpinner, EmptyState } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { Clock, Eye, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const toast = useToast();

  const loadApps = () => {
    applicationService.getByUser(user.id).then((data) => {
      setApps(data);
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadApps();
  }, [user.id]);

  const handleWithdraw = async () => {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    try {
      await applicationService.withdraw(withdrawTarget.id, user.id);
      toast.success('Application withdrawn.');
      setWithdrawTarget(null);
      loadApps();
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <LoadingSpinner size={40} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>My Adoption Applications</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Track review statuses, review shelter timelines, and manage active adoption requests.
        </p>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No applications submitted"
          description="You haven't submitted any adoption applications yet. Find a pet and apply today!"
          action={<Button onClick={() => (window.location.href = '/pets')}>Explore Available Pets</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {apps.map((app) => (
            <div
              key={app.id}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-2xl)',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                  src={app.petImage}
                  alt={app.petName}
                  style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{app.petName}</h2>
                    <StatusBadge status={app.status} />
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Ref: <strong>{app.id}</strong> • Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {app.petBreed} • {app.petSpecies}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button variant="secondary" size="sm" onClick={() => setSelectedApp(app)}>
                  <Eye size={16} /> View Details
                </Button>
                {app.status === 'submitted' || app.status === 'under_review' ? (
                  <Button variant="ghost" size="sm" onClick={() => setWithdrawTarget(app)} style={{ color: 'var(--color-error)' }}>
                    Withdraw
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Application: ${selectedApp.petName}`} size="lg">
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Status alert */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-cream)', padding: '16px 20px', borderRadius: 'var(--radius-xl)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>CURRENT STATUS</span>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>SUBMITTED</span>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{new Date(selectedApp.submittedAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Status History Timeline */}
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: '14px' }}>Status Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedApp.statusHistory?.map((hist, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'capitalize' }}>{hist.status.replace('_', ' ')}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{new Date(hist.date).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{hist.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submitted Answers Summary */}
            <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: '14px' }}>Application Responses</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--color-gray-50)', padding: '16px', borderRadius: 'var(--radius-xl)' }}>
                {Object.entries(selectedApp.answers || {}).map(([key, value]) => (
                  <div key={key}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setSelectedApp(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Withdraw Dialog */}
      <ConfirmDialog
        isOpen={!!withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        onConfirm={handleWithdraw}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your adoption application for ${withdrawTarget?.petName}? This action cannot be undone.`}
        confirmLabel="Yes, Withdraw"
        loading={withdrawing}
      />
    </div>
  );
}
