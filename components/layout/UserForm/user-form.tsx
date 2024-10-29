'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { EditIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DISTRICT_OPTIONS } from './options';

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

interface UserFormProps {
    defaultValues?: Partial<FormValues>;
    onSubmit: (values: SubmitValues) => Promise<void>;
    mode: 'create' | 'edit';
    role?: number;
}

const formSchema = z.object({
    last_name: z.string().min(1, { message: 'Họ và chữ đệm không được để trống' }),
    first_name: z.string().min(1, { message: 'Tên không được để trống' }),
    gender: z.string().min(1, { message: 'Vui lòng chọn giới tính' }),
    email: z.string().email({ message: 'Email không hợp lệ' }).optional().or(z.literal('')),
    phone_number: z.string().regex(/^0[3|5|7|8|9][0-9]{8}$/, {
        message: 'Số điện thoại không hợp lệ'
    }).optional().or(z.literal('')),
    // ^0 - Bắt đầu bằng số 0
    // [3|5|7|8|9] - Một trong các số 3,5,7,8,9 (đầu số nhà mạng Việt Nam)
    // [0-9]{8}$ - 8 chữ số bất kỳ
    // Tổng cộng 10 số
    day: z.string().min(1, { message: 'Vui lòng chọn ngày' }),
    month: z.string().min(1, { message: 'Vui lòng chọn tháng' }),
    year: z.string().min(4, { message: 'Năm không hợp lệ' }),
    address: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UserForm({ defaultValues, onSubmit, mode }: UserFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [open, setOpen] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            last_name: '',
            first_name: '',
            gender: '',
            email: '',
            phone_number: '',
            day: '',
            month: '',
            year: '',
            address: '',
            district: '',
            province: ''
        }
    });

    // Theo dõi sự thay đổi của form
    useEffect(() => {
        const subscription = form.watch((value) => {
            const hasChanged = Object.keys(defaultValues || {}).some(key => {
                return defaultValues?.[key as keyof typeof defaultValues] !==
                    value[key as keyof typeof value];
            });
            setIsChanged(hasChanged);
        });

        return () => subscription.unsubscribe();
    }, [form.watch, defaultValues]);

    const handleSubmit = async (values: FormValues) => {
        try {
            const dob = new Date(`${values.year}-${values.month}-${values.day}`);
            const gender = parseInt(values.gender);
            const { day, month, year, ...restValues } = values;

            const formattedValues: SubmitValues = {
                ...restValues,
                dob,
                gender
            };

            await onSubmit(formattedValues);

            if (mode === 'create') {
                form.reset();
            }
        } catch (error) {
            toast.error('Thao tác thất bại', {
                description: 'Đã có lỗi xảy ra, vui lòng thử lại'
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel>Họ và chữ đệm</FormLabel>
                                <span className="ml-1 text-destructive">*</span>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập họ và chữ đệm"
                                        autoComplete="on"
                                        disabled={!isEditing}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Ví dụ: Nguyễn Thanh
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel>Tên</FormLabel>
                                <span className="ml-1 text-destructive">*</span>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập tên"
                                        autoComplete="on"
                                        disabled={!isEditing}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Ví dụ: Hùng
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giới tính</FormLabel>
                                <span className="ml-1 text-destructive">*</span>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || undefined}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">Nam</SelectItem>
                                        <SelectItem value="1">Nữ</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    <FormLabel className="col-span-6">Ngày sinh<span className="ml-1 text-destructive">*</span></FormLabel>
                    <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    autoComplete="on"
                                    disabled={!isEditing}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || undefined}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ngày" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <SelectItem
                                                key={i + 1}
                                                value={(i + 1).toString().padStart(2, '0')}
                                            >
                                                {(i + 1).toString().padStart(2, '0')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Ngày
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    autoComplete="on"
                                    disabled={!isEditing}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tháng" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <SelectItem
                                                key={i + 1}
                                                value={(i + 1).toString().padStart(2, '0')}
                                            >
                                                {(i + 1).toString().padStart(2, '0')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Tháng
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="YYYY"
                                        maxLength={4}
                                        autoComplete="on"
                                        disabled={!isEditing}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Năm
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="example@gems.edu.vn"
                                        autoComplete="on"
                                        disabled={!isEditing}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        autoComplete="on"
                                        disabled={!isEditing}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập địa chỉ của bạn"
                                        autoComplete="on"
                                        disabled={!isEditing}
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Ví dụ: Chung cư SGCC Bình Quới 1, 607 Đường Xô Viết Nghệ Tĩnh, Phường 26
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem className="flex flex-col my-1">
                                <FormLabel htmlFor="district" className="text-sm">Quận/Huyện</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className={cn(
                                                "w-full justify-between hover:bg-transparent focus:ring-1 focus:ring-ring",
                                                !field.value
                                            )}
                                            disabled={!isEditing}
                                        >
                                            {field.value
                                                ? DISTRICT_OPTIONS.find(
                                                    (district) => district.value === field.value
                                                )?.label
                                                : "Lựa chọn..."}
                                            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="p-0"
                                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                                    >
                                        <Command>
                                            <CommandInput placeholder="Tìm quận/huyện..." />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                                <CommandGroup>
                                                    {DISTRICT_OPTIONS.map((district) => (
                                                        <CommandItem
                                                            key={district.value}
                                                            value={district.value}
                                                            onSelect={(currentValue) => {
                                                                field.onChange(currentValue);
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === district.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {district.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Chọn quận cũ đối với TP. Thủ Đức
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tỉnh/Thành phố</FormLabel>
                                <Select
                                    disabled={!isEditing}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || undefined}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lựa chọn..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="HCM">TP. Hồ Chí Minh</SelectItem>
                                        <SelectItem value="TĐ">TP. Thủ Đức</SelectItem>
                                        <SelectItem value="LA">Tỉnh Long An</SelectItem>
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
                                    setIsChanged(false);
                                    form.reset();
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={mode === 'edit' && !isChanged}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </Form>
    );
}