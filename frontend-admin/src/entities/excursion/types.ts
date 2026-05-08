import type { ImageDto } from 'entities/image/types';
import type { SimpleEntity } from 'entities/person/types';

export type ExcursionMode = 'PEDESTRIAN' | 'BUS' | 'MIXED';
export type DayOfWeek =
  | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface ScheduleItem {
  day_of_week: DayOfWeek;
  time: string;
}

export interface Waypoint {
  order: number;
  lat: number;
  lng: number;
  building_id?: string;
}

export interface ExcursionDto {
  _id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  mode: ExcursionMode;
  price?: string;
  schedule?: ScheduleItem[];
  waypoints?: Waypoint[];
  buildings?: SimpleEntity[];
  guide?: SimpleEntity;
  cover_image?: ImageDto;
  images?: ImageDto[];
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

// Jackson SNAKE_CASE: durationMinutes→duration_minutes, guideId→guide_id, etc.
export interface ExcursionCreateDto {
  title: string;
  description?: string;
  duration_minutes?: number;
  mode: ExcursionMode;
  price?: string;
  schedule?: ScheduleItem[];
  waypoints?: Waypoint[];
  buildings?: string[];
  guide_id?: string;
  cover_image_id?: string;
  image_ids?: string[];
  is_published?: boolean;
}

export type ExcursionUpdateDto = Partial<ExcursionCreateDto>;
