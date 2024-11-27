'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { EditIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
    gems_employee: z.boolean().nullable(),
    education_level: z.number().nullable(),
    informatic_relation: z.boolean().nullable(),
    nvsp: z.number().nullable(),
    ic3_certificate: z.boolean().nullable(),
    icdl_certificate: z.boolean().nullable()
});

type FormValues = z.infer<typeof formSchema>;

interface Teacher {
    id: number;
    gems_employee: boolean | null;
    education_level: number | null;
    informatic_relation: boolean | null;
    nvsp: number | null;
    ic3_certificate: boolean | null;
    icdl_certificate: boolean | null;
}

export default function AccountDetail() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gems_employee: teacher?.gems_employee || null,
            education_level: teacher?.education_level || null,
            informatic_relation: teacher?.informatic_relation || null,
            nvsp: teacher?.nvsp || null,
            ic3_certificate: teacher?.ic3_certificate || null,
            icdl_certificate: teacher?.icdl_certificate || null
        }
    });

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${session?.user?.access_token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin giáo viên');
                }

                const data = await response.json();
                setTeacher(data.user);

                form.reset({
                    gems_employee: data.user.gems_employee,
                    education_level: data.user.education_level,
                    informatic_relation: data.user.informatic_relation,
                    nvsp: data.user.nvsp,
                    ic3_certificate: data.user.ic3_certificate,
                    icdl_certificate: data.user.icdl_certificate
                });
            } catch (error) {
                toast.error('Lỗi', {
                    description: 'Không thể lấy thông tin giáo viên'
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user) {
            fetchTeacherData();
        }
    }, [session]);

    const onSubmit = async (values: FormValues) => {
        try {
            const response = await fetch(`${API_URL}/users/${teacher?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.access_token}`
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error('Cập nhật thất bại');
            }

            const updatedTeacher = await response.json();
            setTeacher(updatedTeacher);
            setIsEditing(false);

            toast.success('Cập nhật thành công', {
                description: 'Thông tin của bạn đã được cập nhật'
            });
        } catch (error) {
            toast.error('Cập nhật thất bại', {
                description: 'Đã có lỗi xảy ra khi cập nhật thông tin'
            });
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Nếu không phải teacher thì không hiển thị gì cả
    if (session?.user?.role !== 2) {
        return null;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="gems_employee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nơi công tác</FormLabel>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={(value) => field.onChange(value === 'true')}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lựa chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Giáo viên GEMS</SelectItem>
                                        <SelectItem value="false">Giáo viên trường</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Bạn là GV trung tâm GEMS hay GV trường?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="informatic_relation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bằng cấp chuyên môn</FormLabel>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={(value) => field.onChange(value === 'true')}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lựa chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Bằng liên quan đến tin học</SelectItem>
                                        <SelectItem value="false">Bằng không liên quan đến tin học</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Bạn có bằng cấp chuyên môn liên quan đến tin học không?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="education_level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trình độ học vấn</FormLabel>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lựa chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">Sau Đại học</SelectItem>
                                        <SelectItem value="1">Đại học</SelectItem>
                                        <SelectItem value="2">Cao đẳng</SelectItem>
                                        <SelectItem value="3">Trung cấp</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nvsp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nghiệp vụ sư phạm</FormLabel>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lựa chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">Chưa có NVSP</SelectItem>
                                        <SelectItem value="1">Có NVSP Tiểu học</SelectItem>
                                        <SelectItem value="2">Có NVSP THCS</SelectItem>
                                        <SelectItem value="3">Có NVSP cả 2 cấp học</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ic3_certificate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chứng chỉ IC3</FormLabel>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={(value) => field.onChange(value === 'true')}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lựa chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Có chứng chỉ IC3</SelectItem>
                                        <SelectItem value="false">Chưa có chứng chỉ IC3</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="icdl_certificate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chứng chỉ ICDL</FormLabel>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={(value) => field.onChange(value === 'true')}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lựa chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Có chứng chỉ ICDL</SelectItem>
                                        <SelectItem value="false">Chưa có chứng chỉ ICDL</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    {!isEditing ? (
                        <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                        >
                            <EditIcon className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setIsEditing(false);
                                    form.reset();
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2" />
                                Cập nhật thông tin
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </Form>
    );
}