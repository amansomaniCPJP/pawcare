// ============================================================
// APPLICATION SERVICE — talks to the Flask API
// Tables: ADOPTION (+ ADOPTER, PET, ADOPTION_HISTORY, ADOPTION_NOTE)
// ============================================================
import { request, toIso } from './api.js';
import { authService } from './authService.js';

// DB adoption_status <-> status word used by the UI
const FROM_DB = { Pending: 'submitted', 'Under Review': 'under_review', Approved: 'approved', Rejected: 'rejected', Withdrawn: 'withdrawn', Completed: 'completed' };
const TO_DB = Object.fromEntries(Object.entries(FROM_DB).map(([k, v]) => [v, k]));

const toApp = (r) => ({
  id: String(r.adoption_id),
  petId: String(r.pet_id),
  applicantId: String(r.adopter_id),
  applicantEmail: r.adopter_email,
  petName: r.pet_name,
  petImage: r.pet_image,
  petSpecies: r.pet_species,
  petBreed: r.pet_breed,
  submittedAt: toIso(r.submitted_at),
  updatedAt: toIso(r.updated_at),
  status: FROM_DB[r.adoption_status] || 'submitted',
  // admin screens read the applicant's name/phone from answers
  answers: { fullName: r.adopter_name, phone: r.adopter_phone, ...r.answers },
  statusHistory: (r.status_history || []).map((h) => ({ status: FROM_DB[h.status] || 'submitted', date: toIso(h.date), note: h.note })),
  internalNotes: (r.internal_notes || []).map((n) => ({ staffId: n.staff_name, note: n.note, date: toIso(n.date) })),
});

export const applicationService = {
  // applications of the logged-in adopter (matched by e-mail, the UNIQUE column of ADOPTER)
  async getByUser() {
    const email = authService.getCurrentUser()?.email;
    if (!email) return [];
    return (await request('/adoptions', { params: { email } })).map(toApp);
  },

  async getAll(filters = {}) {
    const status = filters.status && filters.status !== 'all' ? TO_DB[filters.status] : undefined;
    return (await request('/adoptions', { params: { status, search: filters.search } })).map(toApp);
  },

  async getById(id) {
    return toApp(await request(`/adoptions/${id}`));
  },

  async submit({ petId, answers }) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Please log in to apply.');
    return toApp(await request('/adoptions', {
      method: 'POST',
      body: {
        pet_id: Number(petId),
        full_name: answers.fullName || user.name,
        phone: answers.phone,
        email: user.email,
        address: answers.address,
        answers,
      },
    }));
  },

  async updateStatus(id, status, note = '') {
    return toApp(await request(`/adoptions/${id}`, { method: 'PATCH', body: { status: TO_DB[status], note } }));
  },

  async addNote(id, note, staffId) {
    return toApp(await request(`/adoptions/${id}/notes`, { method: 'POST', body: { note, staff_name: staffId } }));
  },

  async withdraw(id) {
    return this.updateStatus(id, 'withdrawn', 'Application withdrawn by applicant.');
  },
};
