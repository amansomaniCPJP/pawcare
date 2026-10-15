// ============================================================
// PET SERVICE — talks to the Flask API (tables: PET, PET_DONATION, MEDICAL_RECORD)
// ============================================================
import { request, toIso } from './api.js';

// DB "availability" (from the PET_STATUS view) -> status word used by the UI
const STATUS_FROM_DB = { Available: 'available', Pending: 'available', Reserved: 'pending', Adopted: 'adopted', Archived: 'archived' };

export const toPet = (r) => ({
  id: String(r.pet_id),
  name: r.name,
  species: r.species,
  breed: r.breed,
  age: r.age,
  dob: r.dob,
  gender: r.gender,
  size: r.size,
  weight: r.weight,
  location: r.location,
  status: STATUS_FROM_DB[r.availability] || 'available',
  description: r.description,
  personality: r.personality || [],
  idealHome: r.ideal_home,
  images: r.images?.length ? r.images : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80'],
  healthInfo: {
    vaccinated: !!r.vaccinated,
    neutered: !!r.neutered,
    microchipped: !!r.microchipped,
    healthNotes: r.health_notes || r.health_status,
    status: r.health_status,
  },
  vaccinations: (r.vaccinations || []).map((v) => ({ name: v.name, date: v.date, nextDue: null })),
  medicalRecords: r.medical_records || [],
  donation: r.donation || null,
  shelterName: r.shelter_name,
  adoptionFee: r.adoption_fee,
  createdAt: toIso(r.created_at),
  updatedAt: toIso(r.created_at),
});

// UI form -> API body
const toBody = (p) => {
  const b = {};
  const copy = { name: 'name', species: 'species', breed: 'breed', gender: 'gender', size: 'size', location: 'location',
    description: 'description', images: 'images', personality: 'personality', age: 'age', weight: 'weight' };
  for (const [k, v] of Object.entries(copy)) if (p[k] !== undefined) b[v] = p[k];
  if (p.adoptionFee !== undefined) b.adoption_fee = Number(p.adoptionFee);
  if (p.idealHome !== undefined) b.ideal_home = p.idealHome;
  // "available" un-archives, "archived" archives; pending/adopted are derived from adoptions in the DB
  if (p.status === 'archived') b.is_archived = 1;
  else if (p.status === 'available') b.is_archived = 0;
  return b;
};

export const petService = {
  async getAll(filters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 8;
    const all = (v) => (v && v !== 'all' ? v : undefined);
    const { data, headers } = await request('/pets', {
      withHeaders: true,
      params: {
        species: all(filters.species), gender: all(filters.gender), size: all(filters.size),
        status: all(filters.status), search: filters.search, sort: filters.sort, page, limit,
      },
    });
    const total = Number(headers.get('X-Total-Count') ?? data.length);
    return { pets: data.map(toPet), total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    return toPet(await request(`/pets/${id}`));
  },

  async getFeatured() {
    const { data } = await request('/pets', { withHeaders: true, params: { status: 'available', limit: 6, sort: 'newest' } });
    return data.map(toPet);
  },

  async create(petData) {
    return toPet(await request('/pets', { method: 'POST', body: toBody(petData) }));
  },

  async update(id, updates) {
    return toPet(await request(`/pets/${id}`, { method: 'PUT', body: toBody(updates) }));
  },

  async archive(id) {
    return toPet(await request(`/pets/${id}`, { method: 'PUT', body: { is_archived: 1 } }));
  },
};
