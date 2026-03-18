import api from './axiosInstance';

export const userApi = {
  getUsers: (params) =>
    api.get('/api/v1/users', { params }),

  getUserById: id =>
    api.get(`/api/v1/users/${id}`),

  getUserByRollNumber: (rollNumber) =>
    api.get('/api/v1/users', { params: { rollNumber } }),

  updateUser: (id, userData) =>
    api.put(`/api/v1/users/${id}`, userData),

  deleteUser: id =>
    api.delete(`/api/v1/users/${id}`)
};