import { useState, useEffect, useMemo, useCallback } from 'react';
import { Admin, AdminFilters } from '@/types/admin';
import { toast } from 'sonner';
import { parseAsInteger, useQueryState } from 'nuqs';

export function useAdmins(initialFilters?: AdminFilters) {
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

    const fetchAdmins = useCallback(async () => {
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
    }, [filters]);

    // Sử dụng fetchAdmins trong useEffect
    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    // Thêm hàm refresh để tái sử dụng fetchAdmins
    const refresh = useCallback(() => {
        // Reset chỉ sortBy và order, giữ nguyên các filter khác
        setFilters(prev => ({
            ...prev,
            sortBy: 'created_at',
            order: 'DESC'
        }));
    }, []);

    const updateFilters = (newFilters: Partial<AdminFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1
        }));
    };

    const isAnyFilterActive = useMemo(() => {
        return !!(
            filters.search ||
            filters.gender !== undefined ||
            filters.district !== undefined ||
            filters.province !== undefined
        );
    }, [filters.search, filters.gender, filters.district, filters.province]);

    const resetFilters = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            search: undefined,
            gender: undefined,
            district: undefined,
            province: undefined,
            page: 1
        }));
    }, []);

    return {
        data,
        total,
        isLoading,
        error,
        filters,
        updateFilters,
        isAnyFilterActive,
        resetFilters,
        refresh
    };
}