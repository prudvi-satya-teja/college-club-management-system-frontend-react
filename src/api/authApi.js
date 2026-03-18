  import axios from 'axios';
  import api from './axiosInstance';

  const API_BASE = 'http://localhost:8080';

  export const authApi = {
    login: (username, password) =>
      axios.post(`${API_BASE}/generate-token`, { username, password }, { withCredentials: true }),

    signup: (userData) =>
      axios.post(`${API_BASE}/api/v1/users`, userData),

    sendOtp: email =>
      api.post('/api/v1/auth/otp/send', { email }),

    verifyOtp: (email, otp) =>
      api.post('/api/v1/auth/otp/verify', { email, otp }),

    resetPassword: (email, password) =>
      api.post('/api/v1/auth/password/reset', { email, password })
  };
