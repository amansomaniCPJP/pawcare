import React, { useEffect, useState } from 'react';
import { recordsService } from '@/services/recordsService';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { LoadingSpinner, EmptyState } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { Plus } from 'lucide-react';

const th = { padding: '14px 18px' };
const td = { padding: '14px 18px' };
const today = () => new Date().toISOString().slice(0, 10);

function Table({ columns, rows, empty }) {
  if (!rows.length) return <EmptyState title={empty} description="Use the button above to add one." />;
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              {columns.map((c) => <th key={c.label} style={th}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                {columns.map((c) => <td key={c.label} style={td}>{c.render ? c.render(r) : r[c.key] ?? '—'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminRecordsPage() {
  const toast = useToast();
  const [tab, setTab] = useState('vets');
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState([]);
  const [records, setRecords] = useState([]);
  const [donations, setDonations] = useState([]);
  const [pets, setPets] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () =>
    Promise.all([recordsService.vets(), recordsService.medical(), recordsService.donations(), recordsService.allPets()])
      .then(([v, m, d, p]) => { setVets(v); setRecords(m); setDonations(d); setPets(p); })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openModal = () => {
    setForm(
      tab === 'vets' ? { vet_name: '', specialization: '', phone: '', email: '' }
      : tab === 'medical' ? { pet_id: pets[0]?.pet_id ?? '', vet_id: vets[0]?.vet_id ?? '', vaccination: '', treatment: '', medical_history: '', record_date: today() }
      : { donor_name: '', phone: '', pet_id: pets[0]?.pet_id ?? '', donation_date: today() }
    );
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (tab === 'vets') await recordsService.addVet(form);
      else if (tab === 'medical') await recordsService.addMedical({ ...form, pet_id: Number(form.pet_id), vet_id: Number(form.vet_id) });
      else await recordsService.addDonation({ ...form, pet_id: Number(form.pet_id) });
      toast.success('Saved to the database.');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size={40} />;

  const titles = { vets: 'Add Veterinarian', medical: 'Add Medical Record', donations: 'Register Donation' };
  const petOptions = pets.map((p) => <option key={p.pet_id} value={p.pet_id}>{p.name} ({p.breed})</option>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Shelter Records</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Veterinarians, medical history and pet donations stored in the database.
          </p>
        </div>
        <Button onClick={openModal}><Plus size={18} /> {titles[tab]}</Button>
      </div>

      <Tabs
        activeTab={tab}
        onChange={setTab}
        tabs={[
          { value: 'vets', label: 'Veterinarians', count: vets.length },
          { value: 'medical', label: 'Medical Records', count: records.length },
          { value: 'donations', label: 'Donations', count: donations.length },
        ]}
      />

      {tab === 'vets' && (
        <Table empty="No veterinarians yet" rows={vets} columns={[
          { label: 'Name', key: 'vet_name', render: (r) => <strong>{r.vet_name}</strong> },
          { label: 'Specialization', key: 'specialization' },
          { label: 'Phone', key: 'phone' },
          { label: 'Email', key: 'email' },
          { label: 'Records handled', key: 'total_records' },
        ]} />
      )}
      {tab === 'medical' && (
        <Table empty="No medical records yet" rows={records} columns={[
          { label: 'Date', key: 'record_date' },
          { label: 'Pet', key: 'pet_name', render: (r) => <strong>{r.pet_name}</strong> },
          { label: 'Veterinarian', key: 'vet_name' },
          { label: 'Vaccination', key: 'vaccination' },
          { label: 'Treatment', key: 'treatment' },
          { label: 'History', key: 'medical_history' },
        ]} />
      )}
      {tab === 'donations' && (
        <Table empty="No donations yet" rows={donations} columns={[
          { label: 'Date', key: 'donation_date' },
          { label: 'Donor', key: 'donor_name', render: (r) => <strong>{r.donor_name}</strong> },
          { label: 'Phone', key: 'phone' },
          { label: 'Pet', key: 'pet_name' },
        ]} />
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={titles[tab]}>
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tab === 'vets' && (<>
            <Input label="Name" required value={form.vet_name || ''} onChange={set('vet_name')} />
            <Input label="Specialization" required value={form.specialization || ''} onChange={set('specialization')} />
            <Input label="Phone (digits only)" required value={form.phone || ''} onChange={set('phone')} />
            <Input label="Email" type="email" required value={form.email || ''} onChange={set('email')} />
          </>)}
          {tab === 'medical' && (<>
            <Select label="Pet" required value={form.pet_id} onChange={set('pet_id')}>{petOptions}</Select>
            <Select label="Veterinarian" required value={form.vet_id} onChange={set('vet_id')}>
              {vets.map((v) => <option key={v.vet_id} value={v.vet_id}>{v.vet_name}</option>)}
            </Select>
            <Input label="Vaccination" value={form.vaccination || ''} onChange={set('vaccination')} />
            <Input label="Treatment" value={form.treatment || ''} onChange={set('treatment')} />
            <Input label="Medical history" value={form.medical_history || ''} onChange={set('medical_history')} />
            <Input label="Date" type="date" required value={form.record_date || ''} onChange={set('record_date')} />
          </>)}
          {tab === 'donations' && (<>
            <Input label="Donor name" required value={form.donor_name || ''} onChange={set('donor_name')} />
            <Input label="Donor phone (digits only)" required value={form.phone || ''} onChange={set('phone')} />
            <Select label="Pet" required value={form.pet_id} onChange={set('pet_id')}>{petOptions}</Select>
            <Input label="Date" type="date" required value={form.donation_date || ''} onChange={set('donation_date')} />
          </>)}
          <Button type="submit" loading={saving} fullWidth>Save</Button>
        </form>
      </Modal>
    </div>
  );
}
