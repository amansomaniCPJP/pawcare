import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { LoadingSpinner, EmptyState } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { Plus, HeartPulse, Calendar, ShieldCheck, Tag } from 'lucide-react';

export default function MyPetsPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Female',
    weight: '',
    image: '',
    microchipId: '',
    notes: '',
  });

  const loadPets = () => {
    userService.getMyPets(user.id).then((data) => {
      setPets(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPets();
  }, [user.id]);

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!form.name || !form.breed) {
      toast.error('Pet name and breed are required.');
      return;
    }
    const newPet = await userService.addPet({
      ...form,
      ownerId: user.id,
      adoptedVia: 'external',
      image: form.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80',
    });
    toast.success(`${newPet.name} added to your family!`);
    setModalOpen(false);
    setForm({ name: '', species: 'Dog', breed: '', gender: 'Female', weight: '', image: '', microchipId: '', notes: '' });
    loadPets();
  };

  if (loading) return <LoadingSpinner size={40} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>My Pets</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Manage profiles, veterinary records, and routine schedules for your animals.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Register a Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon="🐶"
          title="No registered pets"
          description="You haven't added any pets to your care profile yet. Add a pet or adopt through Pawhaven."
          action={<Button onClick={() => setModalOpen(true)}>Register Your First Pet</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {pets.map((pet) => (
            <div
              key={pet.id}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={pet.image}
                  alt={pet.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.92)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}
                  >
                    {pet.adoptedVia === 'platform' ? 'Adopted via Pawhaven' : 'Registered Pet'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{pet.name}</h2>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {pet.species} • {pet.gender}
                  </span>
                </div>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Breed: <strong>{pet.breed}</strong> {pet.weight && `• ${pet.weight}`}
                </p>

                {pet.microchipId && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="var(--color-success)" /> Microchip: {pet.microchipId}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
                  <Link to={`/app/pets/${pet.id}/health`} style={{ flex: 1 }}>
                    <Button variant="secondary" fullWidth size="sm">
                      <HeartPulse size={16} /> Health Records
                    </Button>
                  </Link>
                  <Link to="/app/care" style={{ flex: 1 }}>
                    <Button variant="outline" fullWidth size="sm">
                      <Calendar size={16} /> Care Tasks
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Pet Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register a Pet to Care Profile">
        <form onSubmit={handleAddPet} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Pet Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Species"
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Bird">Bird</option>
            </Select>

            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </Select>
          </div>

          <Input
            label="Breed"
            required
            placeholder="e.g. Golden Retriever, Mixed"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Weight (kg / lbs)"
              placeholder="e.g. 15kg"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
            <Input
              label="Microchip Number"
              placeholder="Optional"
              value={form.microchipId}
              onChange={(e) => setForm({ ...form, microchipId: e.target.value })}
            />
          </div>

          <Input
            label="Photo URL (Optional)"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Pet</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
