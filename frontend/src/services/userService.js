import { MOCK_USER_PETS, MOCK_CARE_TASKS, MOCK_HEALTH_RECORDS, delay } from './mock/data.js';

let _userPets = [...MOCK_USER_PETS];
let _careTasks = [...MOCK_CARE_TASKS];
let _healthRecords = [...MOCK_HEALTH_RECORDS];

// Favourites: stored in localStorage
const FAV_KEY = 'pawhaven_favourites';

const getFavourites = () => {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
};
const saveFavourites = (favs) => localStorage.setItem(FAV_KEY, JSON.stringify(favs));

export const userService = {
  // === My Pets ===
  async getMyPets(userId) {
    await delay(400);
    return _userPets.filter(p => p.ownerId === userId);
  },

  async addPet(petData) {
    await delay(600);
    const newPet = { id: `upet-${Date.now()}`, ...petData, createdAt: new Date().toISOString() };
    _userPets.push(newPet);
    return newPet;
  },

  async updatePet(id, updates) {
    await delay(500);
    const idx = _userPets.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Pet not found');
    _userPets[idx] = { ..._userPets[idx], ...updates };
    return _userPets[idx];
  },

  // === Care Tasks ===
  async getCareTasks(userId) {
    await delay(400);
    return _careTasks.filter(t => t.ownerId === userId);
  },

  async createTask(taskData) {
    await delay(500);
    const newTask = { id: `task-${Date.now()}`, ...taskData, completionHistory: [], createdAt: new Date().toISOString() };
    _careTasks.push(newTask);
    return newTask;
  },

  async updateTask(id, updates) {
    await delay(400);
    const idx = _careTasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    _careTasks[idx] = { ..._careTasks[idx], ...updates };
    return _careTasks[idx];
  },

  async completeTask(id) {
    await delay(300);
    const idx = _careTasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    const entry = { date: new Date().toISOString() };
    _careTasks[idx] = {
      ..._careTasks[idx],
      completed: true,
      completionHistory: [..._careTasks[idx].completionHistory, entry],
    };
    return _careTasks[idx];
  },

  async deleteTask(id) {
    await delay(400);
    const idx = _careTasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    _careTasks.splice(idx, 1);
    return { success: true };
  },

  // === Health Records ===
  async getHealthRecords(petId) {
    await delay(400);
    return _healthRecords.filter(r => r.petId === petId);
  },

  async createHealthRecord(recordData) {
    await delay(500);
    const newRecord = { id: `hr-${Date.now()}`, ...recordData, createdAt: new Date().toISOString() };
    _healthRecords.push(newRecord);
    return newRecord;
  },

  async updateHealthRecord(id, updates) {
    await delay(400);
    const idx = _healthRecords.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Record not found');
    _healthRecords[idx] = { ..._healthRecords[idx], ...updates };
    return _healthRecords[idx];
  },

  async deleteHealthRecord(id) {
    await delay(400);
    const idx = _healthRecords.findIndex(r => r.id === id);
    if (idx !== -1) _healthRecords.splice(idx, 1);
    return { success: true };
  },

  // === Favourites ===
  async getFavourites() {
    await delay(200);
    return getFavourites();
  },

  async toggleFavourite(petId) {
    await delay(150);
    const favs = getFavourites();
    const idx = favs.indexOf(petId);
    if (idx === -1) { favs.push(petId); } else { favs.splice(idx, 1); }
    saveFavourites(favs);
    return favs;
  },

  isFavourite(petId) {
    return getFavourites().includes(petId);
  },
};
