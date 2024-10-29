export interface Admin {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: number;
    address: string;
    district: string;
    province: string;
}

export interface AdminFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
    gender?: number | null;
    district?: string | null;
    province?: string;
}