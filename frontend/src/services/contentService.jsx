import api from './api';

// Handles both { data: { success, data: [...] } } and { data: [...] } shapes
function extract(response) {
    return response;
}

export const contentService = {
    getServices:         () => api.get('/services').then(extract),
    getServiceById:      (id) => api.get(`/services/${id}`).then(extract),
    getBlogPosts:        () => api.get('/blog').then(extract),
    getBlogPostBySlug:   (slug) => api.get(`/blog/${slug}`).then(extract),
    getPortfolioProjects:() => api.get('/portfolio').then(extract),
    getTeamMembers:      () => api.get('/team').then(extract),
    getFAQs:             () => api.get('/faqs').then(extract),
};
