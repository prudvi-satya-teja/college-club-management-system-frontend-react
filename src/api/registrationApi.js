import api from './axiosInstance';

export const registrationApi = {
  getAllRegistrations: (eventId = null, userId = null, page = 0, size = 10) =>
    api.get('/api/v1/registrations', {
      params: { eventId, userId, page, size, sortBy: 'registrationId', sortDir: 'desc' }
    }),

  createRegistration: (eventId, userId) =>
    api.post('/api/v1/registrations', { eventId, userId }),

  updateRegistration: (id, rating, feedback) =>
    api.put(`/api/v1/registrations/${id}`, { rating, feedback }),

  deleteRegistration: id =>
    api.delete(`/api/v1/registrations/${id}`),

  getFeedbacks: (eventId, page = 0, size = 10) =>
    api.get('/api/v1/registrations/feedbacks', {
      params: { eventId, page, size }
    }),

  submitFeedback: (registrationId, feedbackData) =>
    api.post(`/api/v1/registrations/${registrationId}/feedback`, feedbackData)
};
