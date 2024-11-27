import { useState, useEffect, useMemo, useCallback } from 'react';
import { Admin, AdminFilters } from '@/types/admin';
import { toast } from 'sonner';
import { parseAsInteger, useQueryState } from 'nuqs';

export function useAdmins(initialFilters: AdminFilters = {}) {
    console.log("thu 1")
    const [currentPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [pageSize] = useQueryState('limit', parseAsInteger.withDefault(10));

    const [state, setState] = useState({
        
        data: [] as Admin[],
        total: 0,
        isLoading: true,
        error: null as Error | null
    });

    const [filters, setFilters] = useState<AdminFilters>({
        page: currentPage,
        limit: pageSize,
        sortBy: 'created_at',
        order: 'DESC',
        ...initialFilters
    });

    const fetchAdmins = useCallback(async () => {
        console.log("thu 2")
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const queryParams = new URLSearchParams(Object.entries(filters)
                .filter(([, value]) => value !== undefined && value !== null)
                .map(([key, value]) => [key, String(value)])
            );

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins?${queryParams}`);
            const result = await response.json();

            setState({
                data: result.data || [],
                total: result.total || 0,
                isLoading: false,
                error: null
            });
        } catch (err) {
            const error = err as Error;
            setState(prev => ({ ...prev, isLoading: false, error }));
            toast.error('Lỗi', { description: error.message || 'Không thể lấy danh sách admin' });
        }
    }, [filters]);

    useEffect(() => {
        fetchAdmins();
        console.log("thu 3!");
    }, []);

    const updateFilters = useCallback((newFilters: Partial<AdminFilters>) => {
        console.log("thu 4")
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1
        }));
    }, []);

    const resetFilters = useCallback(() => {
        console.log("thu 5")
        setFilters(prev => ({
            ...prev,
            search: undefined,
            gender: undefined,
            district: undefined,
            province: undefined,
            page: 1
        }));
    }, []);

    const isAnyFilterActive = useMemo(() => 
        
        Object.values({
            search: filters.search,
            gender: filters.gender,
            district: filters.district,
            province: filters.province
        }).some(value => value !== undefined)
        
    , [filters]);
    console.log( "thu 6")
    return {
        ...state,
        filters,
        updateFilters,
        isAnyFilterActive,
        resetFilters,
        refresh: fetchAdmins
    };
}