import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Admin, AdminFilters } from '@/types/admin';
import { toast } from 'sonner';
import { parseAsInteger, useQueryState } from 'nuqs';

export function useAdmins(initialFilters?: AdminFilters) {
    const searchParams = useSearchParams();
    const [data, setData] = useState<Admin[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Sử dụng useQueryState để đồng bộ với DataTable
    const [currentPage] = useQueryState(
        'page',
        parseAsInteger.withDefault(1)
    );
    const [pageSize] = useQueryState(
        'limit',
        parseAsInteger.withDefault(10)
    );

    const [filters, setFilters] = useState<AdminFilters>({
        page: currentPage,
        limit: pageSize,
        sortBy: 'created_at',
        order: 'DESC',
        ...initialFilters
    });

    // Cập nhật filters khi page hoặc limit thay đổi
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            page: currentPage,
            limit: pageSize
        }));
    }, [currentPage, pageSize]);    

    useEffect(() => {
        const fetchAdmins = async () => {
            setIsLoading(true);
            try {
                // Xây dựng query params
                const queryParams = new URLSearchParams();
                queryParams.append('page', filters.page?.toString() || '1');
                queryParams.append('limit', filters.limit?.toString() || '10');
                queryParams.append('sortBy', filters.sortBy || 'created_at');
                queryParams.append('order', filters.order || 'DESC');

                // Thêm các filter nếu có
                if (filters.search) queryParams.append('search', filters.search);
                if (filters.gender !== undefined && filters.gender !== null) {
                    queryParams.append('gender', filters.gender.toString());
                } else if (filters.gender === null) {
                    queryParams.append('gender', 'null');
                }
                if (filters.district !== undefined && filters.district !== null) {
                    queryParams.append('district', filters.district);
                } else if (filters.district === null) {
                    queryParams.append('district', 'null');
                }
                if (filters.province) queryParams.append('province', filters.province);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins?${queryParams}`);
                const result = await response.json();

                if (!result || !Array.isArray(result.data)) {
                    throw new Error('Invalid response format from server');
                }

                setData(result.data);
                setTotal(result.total || 0);
            } catch (err) {
                const error = err as Error;
                setError(error);
                toast.error('Lỗi', {
                    description: error.message || 'Không thể lấy danh sách admin'
                });
                console.error('Error fetching admins:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdmins();
    }, [filters]);

    const updateFilters = (newFilters: Partial<AdminFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1
        }));
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            sortBy: 'created_at',
            order: 'DESC',
            search: '',
            gender: undefined,
            district: undefined,
            province: undefined
        });
    };

    return {
        data,
        total,
        isLoading,
        error,
        filters,
        updateFilters,
        resetFilters
    };
}