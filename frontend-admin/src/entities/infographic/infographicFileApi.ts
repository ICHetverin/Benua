import { uploadMultipart } from 'shared/api/adminApi';
import type { InfographicFileDto } from './types';

export const infographicFileApi = {
  upload: (file: File): Promise<InfographicFileDto> => {
    const fd = new FormData();
    fd.append('file', file);
    return uploadMultipart<InfographicFileDto>('/admin/files/infographic', fd);
  },
};
