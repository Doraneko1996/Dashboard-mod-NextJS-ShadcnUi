export interface UpdateUser {
    id: number;
    user_name: string;
    role: number;
    first_name: string;
    last_name: string;
    gender: number | null;
    dob: string;
    phone_number: string | null;
    email: string | null;
    address: string | null;
    district: string | null;
    province: string | null;
}