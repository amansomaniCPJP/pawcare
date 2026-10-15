// ============================================================
// RECORDS SERVICE — VETERINARIAN, MEDICAL_RECORD and PET_DONATION tables
// ============================================================
import { request } from './api.js';

export const recordsService = {
  vets: () => request('/vets'),
  addVet: (v) => request('/vets', { method: 'POST', body: v }),
  medical: (petId) => request('/medical-records', { params: { pet_id: petId } }),
  addMedical: (m) => request('/medical-records', { method: 'POST', body: m }),
  donations: () => request('/donations'),
  addDonation: (d) => request('/donations', { method: 'POST', body: d }),
  donationSummary: () => request('/donations/summary'),
  reports: () => request('/reports'),
  adopters: () => request('/adopters'),
  allPets: () => request('/pets'),
};
