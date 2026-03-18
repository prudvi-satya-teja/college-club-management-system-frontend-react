import api from './axiosInstance';

export const clubApi = {
  getAllClubs: () =>
    api.get('/api/v1/clubs'),

  getClubById: id =>
    api.get(`/api/v1/clubs/${id}`),

  createClub: formData =>
    api.post('/api/v1/clubs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  updateClub: (id, formData) =>
    api.put(`/api/v1/clubs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  deleteClub: id =>
    api.delete(`/api/v1/clubs/${id}`)

};
