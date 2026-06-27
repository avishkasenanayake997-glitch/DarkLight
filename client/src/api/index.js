import api from './axios';

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Bookings
export const bookingAPI = {
  create: (data) => api.post('/bookings', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getAll: (params) => api.get('/bookings', { params }),
  getOne: (id) => api.get(`/bookings/${id}`),
  approve: (id, data) => api.put(`/bookings/${id}/approve`, data),
  reject: (id, data) => api.put(`/bookings/${id}/reject`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getCalendar: (params) => api.get('/bookings/calendar', { params }),
};

// Packages
export const packageAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getOne: (id) => api.get(`/packages/${id}`),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
};

// Gallery
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  upload: (data) => api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Notifications
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Customers (admin)
export const customerAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getBookings: (id) => api.get(`/customers/${id}/bookings`),
};

// Reports
export const reportAPI = {
  getOverview: () => api.get('/reports/overview'),
  getBookingsChart: (params) => api.get('/reports/bookings-chart', { params }),
  getRevenueChart: (params) => api.get('/reports/revenue-chart', { params }),
  getPopularPackages: () => api.get('/reports/popular-packages'),
  getCustomerGrowth: (params) => api.get('/reports/customer-growth', { params }),
};
