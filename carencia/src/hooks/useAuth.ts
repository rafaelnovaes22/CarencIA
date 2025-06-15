import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { User, UserType, LoginForm, RegisterForm, AuthUser, JWTPayload } from '../lib/types';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (data: LoginForm) => Promise<void>;
    register: (data: RegisterForm) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    loginWithInstagram: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (data: Partial<User>) => Promise<void>;
    refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configurar axios com interceptors
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado, tentar refresh
            try {
                await refreshAuthToken();
                // Repetir a requisição original
                return api.request(error.config);
            } catch (refreshError) {
                // Refresh falhou, fazer logout
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Função para refresh do token
async function refreshAuthToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('/api/auth/refresh', {
        refreshToken
    });

    const { token, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', newRefreshToken);

    return token;
}

// Função para decodificar JWT
function decodeJWT(token: string): JWTPayload | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const useAuthProvider = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('auth_token');

            if (token) {
                const payload = decodeJWT(token);

                if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
                    // Token válido, buscar dados do usuário
                    try {
                        const response = await api.get('/auth/me');
                        setUser(response.data.user);
                    } catch (error) {
                        // Token inválido, remover
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('refresh_token');
                    }
                } else {
                    // Token expirado, tentar refresh
                    try {
                        await refreshAuthToken();
                        const response = await api.get('/auth/me');
                        setUser(response.data.user);
                    } catch (error) {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('refresh_token');
                    }
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (data: LoginForm) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            const { user, token, refreshToken } = response.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('refresh_token', refreshToken);
            setUser(user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterForm) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/register', data);
            const { user, token, refreshToken } = response.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('refresh_token', refreshToken);
            setUser(user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            // Redirecionar para OAuth do Google
            const response = await api.get('/auth/google/url');
            window.location.href = response.data.url;
        } catch (error: any) {
            setLoading(false);
            throw new Error(error.response?.data?.message || 'Erro ao fazer login com Google');
        }
    };

    const loginWithFacebook = async () => {
        setLoading(true);
        try {
            // Redirecionar para OAuth do Facebook
            const response = await api.get('/auth/facebook/url');
            window.location.href = response.data.url;
        } catch (error: any) {
            setLoading(false);
            throw new Error(error.response?.data?.message || 'Erro ao fazer login com Facebook');
        }
    };

    const loginWithInstagram = async () => {
        setLoading(true);
        try {
            // Redirecionar para OAuth do Instagram
            const response = await api.get('/auth/instagram/url');
            window.location.href = response.data.url;
        } catch (error: any) {
            setLoading(false);
            throw new Error(error.response?.data?.message || 'Erro ao fazer login com Instagram');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Ignorar erros de logout
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
    };

    const updateUserProfile = async (data: Partial<User>) => {
        if (!user) throw new Error('No user logged in');

        try {
            const response = await api.put('/auth/profile', data);
            setUser(prev => prev ? { ...prev, ...response.data.user } : null);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
        }
    };

    const refreshToken = async () => {
        try {
            await refreshAuthToken();
            const response = await api.get('/auth/me');
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            throw error;
        }
    };

    return {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        loginWithInstagram,
        logout,
        updateUserProfile,
        refreshToken
    };
};

export { AuthContext, api }; 