export interface Admin {
    id: number;
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: number;
    dob: string;
    address: string;
    district: string;
    province: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  }

export interface AdminFilters {
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
    status?: string;
    gender?: string | null;
    district?: string | null;
    province?: string;
}