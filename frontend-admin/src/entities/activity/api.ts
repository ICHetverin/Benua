import { adminApi } from 'shared/api/adminApi';
import type { ActivityItem } from './types';

export const activityApi = {
  list: (limit = 20): Promise<ActivityItem[]> =>
    adminApi.get('/activity', { params: { limit } }),
};
