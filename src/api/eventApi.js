import api from './axiosInstance';

export const eventApi = {
  getAllEvents: (clubId = null, page = 0, size = 10) =>
    api.get('/api/v1/events', {
      params: { clubId, page, size, sortBy: 'eventDateTime', sortDir: 'desc' }
    }),

  getEventById: (id) =>
    api.get(`/api/v1/events/${id}`),

  createEvent: (formData) =>
    api.post('/api/v1/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updateEvent: (id, formData) =>
    api.put(`/api/v1/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  deleteEvent: (id) =>
    api.delete(`/api/v1/events/${id}`),
};