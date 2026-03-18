import api from './axiosInstance';

export const membershipApi = {
  getMyMemberships: (id) =>
    api.get(`/api/v1/club-memberships/users/${id}`),

  getAllMemberships: (clubId = null, page = 0, size = 10) =>
    api.get('/api/v1/club-memberships', {
      params: { clubId, page, size, sortBy: 'role', sortDir: 'asc' }
    }),

  createMembership: (clubId, userId, role) =>
    api.post('/api/v1/club-memberships', { clubId, userId, role }),

  updateMembership: (id, role, clubId, userId) =>
    api.put(`/api/v1/club-memberships/${id}`, { clubId, userId, role }),

  deleteMembership: id =>
    api.delete(`/api/v1/club-memberships/${id}`)
};