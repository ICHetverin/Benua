import type { ImageDto } from 'entities/image/types';

export interface CemeteryDto {
  _id: string;
  name: string;
  brief_info?: string;
  images?: ImageDto[];
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CemeteryCreateDto {
  name: string;
  brief_info?: string;
  image_ids?: string[];
}

export interface CemeteryUpdateDto {
  name?: string;
  brief_info?: string;
  image_ids?: string[];
  is_published?: boolean;
  sort_order?: number;
}
