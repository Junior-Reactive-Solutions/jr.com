import api from './api';

export const submissionService = {
    submitContact:     (data) => api.post('/contact', data),
    submitApplication: (data) => api.post('/apply', data),
};
