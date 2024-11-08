'use client';

import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { UserForm } from '@/components/layout/UserForm/user-form';
import { UpdateUser } from '@/types/update-user';
interface SubmitValues {
    last_name: string;
    first_name: string;
    gender: number;
    dob: Date;
    email?: string;
    phone_number?: string;
    address?: string | null;
    district?: string | null;
    province?: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AccountBasic() {
    const { user, setUser } = useAuth();

    const getMissingFields = () => (
        ['dob', 'gender']
            .filter(field => user?.[field as keyof UpdateUser] == null)
            .map(field => {
                const labels = {
                    dob: 'Ngày sinh',
                    gender: 'Giới tính'
                };
                return labels[field as keyof typeof labels];
            })
    );

    const missingFields = getMissingFields();

    const dob = user?.dob ? new Date(user.dob) : null;
    
    const defaultValues = {
        // Thông tin cơ bản - sử dụng nullish coalescing
        last_name: user?.last_name ?? '',
        first_name: user?.first_name ?? '',
        gender: user?.gender?.toString() ?? '',
        email: user?.email ?? '',
        phone_number: user?.phone_number ?? '',
        
        // Xử lý ngày tháng năm - chỉ tính toán nếu có dob
        day: dob?.getDate().toString().padStart(2, '0') ?? '',
        month: dob ? (dob.getMonth() + 1).toString().padStart(2, '0') : '',
        year: dob?.getFullYear().toString() ?? '',
        
        // Thông tin địa chỉ
        address: user?.address ?? '',
        district: user?.district ?? '',
        province: user?.province ?? ''
    };

    const handleSubmit = async (values: SubmitValues) => {
        console.log(values);
        try {
            const response = await fetch(`${API_URL}/users/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error('Cập nhật thất bại');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);

            toast.success('Cập nhật thành công', {
                description: 'Thông tin của bạn đã được cập nhật'
            });
        } catch (error) {
            toast.error('Cập nhật thất bại', {
                description: 'Lỗi server khi cập nhật thông tin'
            });
        }
    };

    return (
        <>
            {missingFields.length > 0 && (
                <Alert variant="warning">
                    <TriangleAlert className="size-4" />
                    <AlertTitle>Cập nhật thông tin tài khoản</AlertTitle>
                    <AlertDescription>
                        {missingFields.length === 1
                            ? `${missingFields[0]} là thông tin quan trọng, vui lòng cập nhật.`
                            : `${missingFields.join(', ')} là những thông tin quan trọng, vui lòng cập nhật.`
                        }
                    </AlertDescription>
                </Alert>
            )}
            <UserForm 
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                mode="edit"
            />
        </>
    );
}