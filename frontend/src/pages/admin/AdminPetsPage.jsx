import React, { useEffect, useState } from 'react';
import { petService } from '@/services/petService';
import { uploadImage } from '@/services/api';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { Plus, Edit2, Archive, Search, MapPin, ImagePlus, X } from 'lucide-react';

export default function AdminPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    size: 'Medium',
    location: 'Austin, TX',
    status: 'available',
    description: '',
    adoptionFee: 100,
    images: '',
  });

  const loadPets = () => {
    petService.getAll({ limit: 100 }).then((res) => {
      setPets(res.pets);
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPets();
  }, []);

  const openCreateModal = () => {
    setEditingPet(null);
    setForm({
      name: '',
      species: 'Dog',
      breed: '',
      gender: 'Male',
      size: 'Medium',
      location: 'Austin, TX',
      status: 'available',
      description: '',
      adoptionFee: 100,
      images: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (pet) => {
    setEditingPet(pet);
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      gender: pet.gender,
      size: pet.size,
      location: pet.location,
      status: pet.status,
      description: pet.description,
      adoptionFee: pet.adoptionFee || 100,
      images: pet.images?.join(', ') || '',
    });
    setModalOpen(true);
  };

  const imageList = () => (form.images ? form.images.split(',').map((u) => u.trim()).filter(Boolean) : []);

  const handleUpload = async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadImage(f));
      setForm((prev) => ({ ...prev, images: [...(prev.images ? prev.images.split(',').map((u) => u.trim()).filter(Boolean) : []), ...urls].join(', ') }));
      toast.success(`${urls.length} photo${urls.length > 1 ? 's' : ''} uploaded.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) =>
    setForm((prev) => ({ ...prev, images: prev.images.split(',').map((u) => u.trim()).filter((u) => u && u !== url).join(', ') }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      adoptionFee: Number(form.adoptionFee),
      images: form.images ? form.images.split(',').map((s) => s.trim()) : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80'],
    };

    try {
      if (editingPet) {
        await petService.update(editingPet.id, payload);
        toast.success('Pet listing updated!');
      } else {
        await petService.create(payload);
        toast.success('New pet listed for adoption!');
      }
      setModalOpen(false);
      loadPets();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    try {
      await petService.archive(archiveTarget.id);
      toast.success(`${archiveTarget.name} has been archived.`);
      setArchiveTarget(null);
      loadPets();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner size={40} />;

  const filtered = pets.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Pet Inventory Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Add, update availability, manage health status, and archive shelter pet records.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={18} /> Add New Pet
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--color-text-muted)" />
        <input
          type="text"
          placeholder="Search inventory by pet name, breed, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: 'var(--text-sm)' }}
        />
      </div>

      {/* Pet Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 18px' }}>Pet</th>
                <th style={{ padding: '14px 18px' }}>Species / Breed</th>
                <th style={{ padding: '14px 18px' }}>Location</th>
                <th style={{ padding: '14px 18px' }}>Fee</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pet) => (
                <tr key={pet.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                  <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={pet.images?.[0]}
                      alt={pet.name}
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <p style={{ fontWeight: 800 }}>{pet.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{pet.gender} • {pet.size}</p>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <p style={{ fontWeight: 600 }}>{pet.breed}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{pet.species}</p>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                    {pet.location}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    ${pet.adoptionFee || 100}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <StatusBadge status={pet.status} />
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(pet)}>
                        <Edit2 size={15} /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setArchiveTarget(pet)} style={{ color: 'var(--color-gray-400)' }}>
                        <Archive size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Pet Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPet ? `Edit Pet: ${editingPet.name}` : 'Add Pet to Listing'} size="lg">
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Input
              label="Pet Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Select
              label="Species"
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
            </Select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Input
              label="Breed"
              required
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="pending">Pending Adoption</option>
              <option value="adopted">Adopted</option>
              <option value="archived">Archived</option>
            </Select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            <Select
              label="Size"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Select>
            <Input
              label="Adoption Fee ($)"
              type="number"
              value={form.adoptionFee}
              onChange={(e) => setForm({ ...form, adoptionFee: e.target.value })}
            />
          </div>

          <Input
            label="Location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <Input
            label="Image URLs (Comma separated)"
            placeholder="https://..., https://..."
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
          />

          <div>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>Photos</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {imageList().map((url) => (
                <div key={url} style={{ position: 'relative', width: '72px', height: '72px' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => removeImage(url)}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', border: 'none', background: '#b91c1c', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1.5px dashed var(--color-primary)', borderRadius: '10px', cursor: uploading ? 'wait' : 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)' }}
              >
                <ImagePlus size={18} /> {uploading ? 'Uploading…' : 'Upload photos'}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <Textarea
            label="Description & Personality"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Pet Listing</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Archive */}
      <ConfirmDialog
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        title="Archive Pet Record"
        message={`Archive listing for ${archiveTarget?.name}? It will no longer be visible on public exploration pages.`}
        confirmLabel="Archive"
      />
    </div>
  );
}
