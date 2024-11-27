'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { UserForm } from '@/components/layout/UserForm/user-form';
import { UpdateUser } from '@/types/update-user';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

interface User extends UpdateUser {
    id: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AccountBasic() {
    const { data: session } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${session?.user?.access_token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin người dùng');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                toast.error('Lỗi', {
                    description: 'Không thể lấy thông tin người dùng'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

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
        last_name: user?.last_name ?? '',
        first_name: user?.first_name ?? '',
        gender: user?.gender?.toString() ?? '',
        email: user?.email ?? '',
        phone_number: user?.phone_number ?? '',
        day: dob?.getDate().toString().padStart(2, '0') ?? '',
        month: dob ? (dob.getMonth() + 1).toString().padStart(2, '0') : '',
        year: dob?.getFullYear().toString() ?? '',
        address: user?.address ?? '',
        district: user?.district ?? '',
        province: user?.province ?? ''
    };

    const handleSubmit = async (values: SubmitValues) => {
        try {
            const response = await fetch(`${API_URL}/users/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
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

    if (isLoading) {
        return <LoadingSpinner />;
    }

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