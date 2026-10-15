import React, { useEffect, useState } from 'react';
import { applicationService } from '@/services/applicationService';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { Eye, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [decisionModal, setDecisionModal] = useState(null);
  const toast = useToast();

  const loadApps = () => {
    applicationService.getAll().then((data) => {
      setApps(data);
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleUpdateStatus = async (appId, newStatus, note) => {
    try {
      await applicationService.updateStatus(appId, newStatus, note);
      toast.success(`Application marked as ${newStatus.replace('_', ' ')}.`);
      setDecisionModal(null);
      setSelectedApp(null);
      loadApps();
    } catch (err) {
      toast.error(err.message); // e.g. pet already adopted or reserved
      setDecisionModal(null);
    }
  };

  const handleAddNote = async (appId) => {
    if (!noteText.trim()) return;
    try {
      const updated = await applicationService.addNote(appId, noteText, 'Admin Staff');
      setSelectedApp(updated);
      setNoteText('');
      toast.success('Internal note added.');
      loadApps();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner size={40} />;

  const filtered = apps.filter((a) => {
    if (statusTab === 'all') return true;
    return a.status === statusTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Adoption Application Queue</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Review applicant backgrounds, collaborate with staff notes, and make decisions.
        </p>
      </div>

      <div style={{ background: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xs)' }}>
        <Tabs
          tabs={[
            { label: 'All Applications', value: 'all', count: apps.length },
            { label: 'Submitted', value: 'submitted', count: apps.filter((a) => a.status === 'submitted').length },
            { label: 'Under Review', value: 'under_review', count: apps.filter((a) => a.status === 'under_review').length },
            { label: 'Approved', value: 'approved', count: apps.filter((a) => a.status === 'approved').length },
            { label: 'Rejected', value: 'rejected', count: apps.filter((a) => a.status === 'rejected').length },
          ]}
          activeTab={statusTab}
          onChange={setStatusTab}
        />
      </div>

      {/* Applications Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 18px' }}>Reference</th>
                <th style={{ padding: '14px 18px' }}>Pet</th>
                <th style={{ padding: '14px 18px' }}>Applicant</th>
                <th style={{ padding: '14px 18px' }}>Submitted Date</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Review</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {app.id}
                  </td>
                  <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={app.petImage} alt={app.petName} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700 }}>{app.petName}</span>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--color-text-secondary)' }}>
                    {app.answers?.fullName || 'Sarah Johnson'}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <StatusBadge status={app.status} />
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                      <Eye size={15} /> Examine
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer / Modal */}
      {selectedApp && (
        <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Review Application: ${selectedApp.id}`} size="xl">
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-cream)', padding: '16px 20px', borderRadius: 'var(--radius-xl)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>TARGET PET</span>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedApp.petName} ({selectedApp.petBreed})</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>DECISION STATUS</span>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>
            </div>

            {/* Application Responses */}
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: '12px' }}>Applicant Responses</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--color-gray-50)', padding: '20px', borderRadius: 'var(--radius-xl)' }}>
                {Object.entries(selectedApp.answers || {}).map(([key, val]) => (
                  <div key={key}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginTop: '2px' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} /> Internal Shelter Notes (Staff only)
              </h3>

              {selectedApp.internalNotes?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {selectedApp.internalNotes.map((n, i) => (
                    <div key={i} style={{ background: 'var(--color-lavender)', padding: '10px 14px', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)' }}>
                      <p style={{ fontWeight: 700 }}>{n.staffId} • {new Date(n.date).toLocaleString()}</p>
                      <p style={{ marginTop: '2px' }}>{n.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '12px' }}>No internal notes yet.</p>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Add a staff note regarding phone interview, landlord check, etc..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', fontSize: 'var(--text-xs)' }}
                />
                <Button size="sm" variant="secondary" onClick={() => handleAddNote(selectedApp.id)}>
                  Add Note
                </Button>
              </div>
            </div>

            {/* Decision Controls */}
            <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <Button variant="ghost" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="outline"
                  onClick={() => setDecisionModal({ action: 'under_review', label: 'Move to Under Review' })}
                >
                  Mark Under Review
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setDecisionModal({ action: 'rejected', label: 'Reject Application' })}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setDecisionModal({ action: 'approved', label: 'Approve Application' })}
                >
                  Approve Adoption
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Decision Confirmation Modal */}
      {decisionModal && (
        <ConfirmDialog
          isOpen={!!decisionModal}
          onClose={() => setDecisionModal(null)}
          onConfirm={() => handleUpdateStatus(selectedApp.id, decisionModal.action, `Decision executed by staff.`)}
          title={decisionModal.label}
          message={`Are you sure you want to change the status of ${selectedApp?.petName}'s application to "${decisionModal.action.replace('_', ' ')}"?`}
          confirmLabel={decisionModal.label}
          confirmVariant={decisionModal.action === 'rejected' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
}
