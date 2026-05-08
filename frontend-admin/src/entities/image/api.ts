import { adminApi, uploadMultipart } from 'shared/api/adminApi';
import type { ImageDto } from './types';

export const imageApi = {
  upload: (file: File, text = ''): Promise<ImageDto> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('text', text);
    return uploadMultipart<ImageDto>('/admin/images', fd);
  },
  delete: (id: string): Promise<void> => adminApi.delete(`/admin/images/${id}`),
};
