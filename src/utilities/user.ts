import http from './http';
import type { User } from '../types';

export const fetchUser = async () => {
    try {
        const response = await http.get<User>('/api/user');
        const user = response.data;
        return user;
    } catch (errors: any) {
        if (errors.response.status === 401) {
            return false;
        }
    }
};

export const logout = async () => {
    try {
        const response = await http.post('/api/logout');
    } catch {
        //
    }
};
