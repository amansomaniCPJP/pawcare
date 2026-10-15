import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { LoadingSpinner, EmptyState } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { ShieldCheck, Plus, Trash2, Calendar, FileText, ArrowLeft } from 'lucide-react';

export default function HealthRecordsPage() {
  const { petId } = useParams();
  const [records, setRecords] = useState([]);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const [form, setForm] = useState({
    title: '',
    type: 'vaccination',
    date: new Date().toISOString().split('T')[0],
    nextDue: '',
    vet: '',
    description: '',
    source: 'owner',
  });

  const loadData = () => {
    Promise.all([userService.getHealthRecords(petId), userService.getMyPets('user-001')]).then(([recs, myPets]) => {
      setRecords(recs);
      const found = myPets.find((p) => p.id === petId);
      setPet(found);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [petId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Record title is required.');
      return;
    }
    await userService.createHealthRecord({
      ...form,
      petId,
    });
    toast.success('Health record saved!');
    setModalOpen(false);
    setForm({ title: '', type: 'vaccination', date: new Date().toISOString().split('T')[0], nextDue: '', vet: '', description: '', source: 'owner' });
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await userService.deleteHealthRecord(deleteTarget.id);
    toast.success('Health record deleted.');
    setDeleteTarget(null);
    loadData();
  };

  if (loading) return <LoadingSpinner size={40} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
        <Link to="/app/pets" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'inherit' }}>
          <ArrowLeft size={14} /> Back to My Pets
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>
            Health Records: {pet?.name || 'Pet'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Maintain vaccination history, wellness exams, and prescribed treatments.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Add Health Record
        </Button>
      </div>

      {records.length === 0 ? (
        <EmptyState
          icon="🩺"
          title="No health records logged"
          description="Keep your pet safe by documenting vaccines, medications, and veterinary clinic visits."
          action={<Button onClick={() => setModalOpen(true)}>Log First Record</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {records.map((rec) => (
            <div
              key={rec.id}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-xl)',
                padding: '20px 24px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{rec.title}</h3>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      background: rec.source === 'verified' ? 'var(--color-mint)' : 'var(--color-gray-100)',
                      color: rec.source === 'verified' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {rec.source === 'verified' ? 'Verified Vet Record' : 'Owner Reported'}
                  </span>
                </div>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Date: <strong>{rec.date}</strong> {rec.nextDue && `• Next Due: ${rec.nextDue}`} {rec.vet && `• ${rec.vet}`}
                </p>

                {rec.description && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                    {rec.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => setDeleteTarget(rec)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', padding: '4px' }}
                aria-label="Delete health record"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Log Health Record for ${pet?.name}`}>
        <form onSubmit={handleCreate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Record Title"
            required
            placeholder="e.g. Rabies Vaccine, Annual Bloodwork, Dental Clean"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Record Category"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="vaccination">Vaccination</option>
              <option value="vet_visit">Veterinary Exam</option>
              <option value="medication">Medication / Prescription</option>
              <option value="surgery">Surgery / Procedure</option>
              <option value="allergy">Allergy / Condition</option>
            </Select>

            <Input
              label="Administered Date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Next Due Date (Optional)"
              type="date"
              value={form.nextDue}
              onChange={(e) => setForm({ ...form, nextDue: e.target.value })}
            />

            <Input
              label="Clinic or Veterinarian"
              placeholder="e.g. River Oaks Animal Clinic"
              value={form.vet}
              onChange={(e) => setForm({ ...form, vet: e.target.value })}
            />
          </div>

          <Textarea
            label="Details & Notes"
            rows={3}
            placeholder="Dosage details, lab findings, or instructions from vet"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Health Record"
        message={`Remove the record "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
