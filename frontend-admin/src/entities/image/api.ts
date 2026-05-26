import { adminApi, uploadMultipart } from 'shared/api/adminApi';
import type { ImageDto } from './types';

export const imageApi = {
  upload: (file: File, text = ''): Promise<ImageDto> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('text', text);
    return uploadMultipart<ImageDto>('/admin/images', fd);
  },
  /** Переименовать изображение (обновить поле text). Файл в S3 не трогается. */
  rename: (id: string, text: string): Promise<ImageDto> =>
    adminApi.patch<ImageDto>(`/admin/images/${id}`, { text }),
  /** Удалить изображение из MongoDB и S3 полностью. */
  delete: (id: string): Promise<void> => adminApi.delete(`/admin/images/${id}`),
};
