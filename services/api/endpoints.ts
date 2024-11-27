export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token',
        ME: '/auth/me',
    },
    USERS: {
        BASE: '/users',
        PROFILE: (id: number) => `/users/${id}`,
        STATUS: (id: number) => `/users/${id}/status`,
        TEACHERS: '/users/teachers',
        STUDENTS: '/users/students',
    },
    ADMINS: {
        BASE: '/admins',
        DETAIL: (id: number) => `/admins/${id}`,
        STATUS: (id: number) => `/admins/${id}/status`,
    },
    SCHOOLS: {
        BASE: '/schools',
        DETAIL: (id: number) => `/schools/${id}`,
    },
    CLASSES: {
        BASE: '/classes',
        DETAIL: (id: number) => `/classes/${id}`,
    }
};