import { createContext, useContext, ReactNode } from 'react';
import { useAdmins } from '@/hooks/use-admins';

const AdminsContext = createContext<ReturnType<typeof useAdmins> | null>(null);

export function AdminsProvider({ children }: { children: ReactNode }) {
    const adminsState = useAdmins();
    return (
        <AdminsContext.Provider value={adminsState}>
            {children}
        </AdminsContext.Provider>
    );
}

export function useAdminsContext() {
    const context = useContext(AdminsContext);
    if (!context) {
        throw new Error('useAdminsContext must be used within AdminsProvider');
    }
    return context;
}