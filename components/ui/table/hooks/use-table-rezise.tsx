import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export function useTableResize(containerId: string) {
  const [width, setWidth] = useState(0);
  
  // Giảm delay xuống để phản hồi nhanh hơn
  const debouncedSetWidth = useDebounce((newWidth: number) => {
    setWidth(newWidth);
  }, 50); // Giảm từ 100ms xuống 50ms

  // Tối ưu updateWidth với useCallback
  const updateWidth = useCallback(() => {
    const element = document.getElementById(containerId);
    if (!element) return;

    // Sử dụng requestAnimationFrame để đồng bộ với render cycle
    requestAnimationFrame(() => {
      const newWidth = element.clientWidth - 10;
      
      // Chỉ update khi width thực sự thay đổi
      if (Math.abs(newWidth - width) > 1) { // Thêm ngưỡng để tránh update không cần thiết
        debouncedSetWidth(newWidth);
      }
    });
  }, [containerId, width, debouncedSetWidth]);

  useEffect(() => {
    const element = document.getElementById(containerId);
    if (!element) return;

    // Khởi tạo width ban đầu ngay lập tức không cần debounce
    setWidth(element.clientWidth - 10);

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerId, updateWidth]);

  // Trả về width và một hàm để force update width nếu cần
  return {
    width,
    updateWidth
  };
}