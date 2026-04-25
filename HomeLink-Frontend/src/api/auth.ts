import { apiRequest } from './client';

export interface AuthUser {
    id: string;
    name: string;
    email?: string;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: payload,
    });

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: payload,
    });

export const logout = (token: string): Promise<{ success: boolean }> =>
    apiRequest<{ success: boolean }>('/auth/logout', {
        method: 'POST',
        token,
    });

