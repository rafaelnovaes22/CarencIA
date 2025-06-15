import axios, { AxiosResponse } from 'axios';
import {
    User,
    Vehicle,
    Match,
    Lead,
    ApiResponse,
    PaginatedResponse,
    VehicleFilters,
    LeadFilters,
    BuyerStats,
    DealershipStats,
    Analytics
} from './types';

// Configuração base da API
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para lidar com respostas
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado, redirecionar para login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (userData: any) =>
        api.post('/auth/register', userData),

    logout: () =>
        api.post('/auth/logout'),

    me: () =>
        api.get('/auth/me'),

    updateProfile: (data: Partial<User>) =>
        api.put('/auth/profile', data),

    refreshToken: (refreshToken: string) =>
        api.post('/auth/refresh', { refreshToken }),

    // OAuth URLs
    getGoogleAuthUrl: () =>
        api.get('/auth/google/url'),

    getFacebookAuthUrl: () =>
        api.get('/auth/facebook/url'),

    getInstagramAuthUrl: () =>
        api.get('/auth/instagram/url'),

    // OAuth callbacks
    handleOAuthCallback: (provider: string, code: string, state?: string) =>
        api.post(`/auth/${provider}/callback`, { code, state }),
};

// Users API
export const usersAPI = {
    getProfile: (userId: string) =>
        api.get(`/users/${userId}`),

    updateProfile: (userId: string, data: Partial<User>) =>
        api.put(`/users/${userId}`, data),

    getBuyerProfile: (userId: string) =>
        api.get(`/users/${userId}/buyer`),

    updateBuyerProfile: (userId: string, data: any) =>
        api.put(`/users/${userId}/buyer`, data),

    getDealershipProfile: (userId: string) =>
        api.get(`/users/${userId}/dealership`),

    updateDealershipProfile: (userId: string, data: any) =>
        api.put(`/users/${userId}/dealership`, data),
};

// Vehicles API
export const vehiclesAPI = {
    getAll: (filters?: VehicleFilters, page = 1, limit = 20) =>
        api.get('/vehicles', { params: { ...filters, page, limit } }),

    getById: (id: string) =>
        api.get(`/vehicles/${id}`),

    create: (data: any) =>
        api.post('/vehicles', data),

    update: (id: string, data: any) =>
        api.put(`/vehicles/${id}`, data),

    delete: (id: string) =>
        api.delete(`/vehicles/${id}`),

    uploadImages: (id: string, files: FormData) =>
        api.post(`/vehicles/${id}/images`, files, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getByDealership: (dealershipId: string, page = 1, limit = 20) =>
        api.get(`/vehicles/dealership/${dealershipId}`, { params: { page, limit } }),

    search: (query: string, filters?: VehicleFilters) =>
        api.get('/vehicles/search', { params: { q: query, ...filters } }),
};

// Matches API
export const matchesAPI = {
    getForBuyer: (buyerId: string, page = 1, limit = 20) =>
        api.get(`/matches/buyer/${buyerId}`, { params: { page, limit } }),

    getById: (id: string) =>
        api.get(`/matches/${id}`),

    markAsViewed: (id: string) =>
        api.post(`/matches/${id}/view`),

    markAsInterested: (id: string, interested: boolean) =>
        api.post(`/matches/${id}/interest`, { interested }),

    generateMatches: (buyerId: string) =>
        api.post(`/matches/generate/${buyerId}`),
};

// Leads API
export const leadsAPI = {
    getAll: (filters?: LeadFilters, page = 1, limit = 20) =>
        api.get('/leads', { params: { ...filters, page, limit } }),

    getById: (id: string) =>
        api.get(`/leads/${id}`),

    create: (data: any) =>
        api.post('/leads', data),

    update: (id: string, data: any) =>
        api.put(`/leads/${id}`, data),

    updateStatus: (id: string, status: string) =>
        api.patch(`/leads/${id}/status`, { status }),

    addNote: (id: string, note: string) =>
        api.post(`/leads/${id}/notes`, { note }),

    getForDealership: (dealershipId: string, filters?: LeadFilters) =>
        api.get(`/leads/dealership/${dealershipId}`, { params: filters }),

    getForBuyer: (buyerId: string) =>
        api.get(`/leads/buyer/${buyerId}`),
};

// Social Data API
export const socialDataAPI = {
    connectPlatform: (platform: string, authCode: string) =>
        api.post('/social-data/connect', { platform, authCode }),

    disconnectPlatform: (platform: string) =>
        api.delete(`/social-data/disconnect/${platform}`),

    getConnectedPlatforms: () =>
        api.get('/social-data/platforms'),

    syncData: (platform?: string) =>
        api.post('/social-data/sync', { platform }),

    getLifestyleAnalysis: (userId: string) =>
        api.get(`/social-data/analysis/${userId}`),

    updateConsent: (platforms: string[], granted: boolean) =>
        api.post('/social-data/consent', { platforms, granted }),
};

// Analytics API
export const analyticsAPI = {
    getBuyerStats: (buyerId: string) =>
        api.get(`/analytics/buyer/${buyerId}`),

    getDealershipStats: (dealershipId: string) =>
        api.get(`/analytics/dealership/${dealershipId}`),

    getGlobalStats: () =>
        api.get('/analytics/global'),

    getMatchingPerformance: (userId: string) =>
        api.get(`/analytics/matching/${userId}`),

    getConversionMetrics: (dealershipId: string, period?: string) =>
        api.get(`/analytics/conversion/${dealershipId}`, { params: { period } }),
};

// Upload API
export const uploadAPI = {
    uploadFile: (file: File, type: 'avatar' | 'vehicle' | 'document') =>
        api.post('/upload', { file, type }, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    uploadMultiple: (files: File[], type: string) =>
        api.post('/upload/multiple', { files, type }, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    deleteFile: (filename: string) =>
        api.delete(`/upload/${filename}`),
};

// Notifications API
export const notificationsAPI = {
    getAll: (page = 1, limit = 20) =>
        api.get('/notifications', { params: { page, limit } }),

    markAsRead: (id: string) =>
        api.patch(`/notifications/${id}/read`),

    markAllAsRead: () =>
        api.patch('/notifications/read-all'),

    getUnreadCount: () =>
        api.get('/notifications/unread-count'),
};

// Health Check API
export const healthAPI = {
    check: () =>
        api.get('/health'),

    database: () =>
        api.get('/health/database'),

    services: () =>
        api.get('/health/services'),
};

// Utility functions
export const handleApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'Erro inesperado. Tente novamente.';
};

export const createFormData = (data: Record<string, any>): FormData => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
        const value = data[key];
        if (value instanceof File) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (item instanceof File) {
                    formData.append(`${key}[${index}]`, item);
                } else {
                    formData.append(`${key}[${index}]`, String(item));
                }
            });
        } else if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    return formData;
};

export default api; 