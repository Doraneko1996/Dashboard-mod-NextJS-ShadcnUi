'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { EditIcon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    // address: z.string().nullable().optional(),
    // district: z.string().nullable().optional(),
    // province: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountDetail() {
    const [isEditing, setIsEditing] = useState(false);
    const { user, setUser } = useAuth();
    const [open, setOpen] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: user?.address || '',
            district: user?.district || '',
            province: user?.province || ''
        }
    });

    const onSubmit = async (values: FormValues) => {
        try {
            // Gọi API cập nhật thông tin
            const response = await fetch(`/api/users/${user?.id}`, {
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
                                    Ví dụ: Tầng 2, Chung cư SGCC Bình Quới 1, 607 Đường Xô Viết Nghệ Tĩnh, Phường 26
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
                                                ? districts.find(
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
                                                <ScrollArea className="h-[200px]">
                                                    <CommandGroup className="px-3">
                                                    {districts.map((district) => (
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
                                                </ScrollArea>
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
                </div> */}

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