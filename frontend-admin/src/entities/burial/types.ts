import type { ImageDto } from 'entities/image/types';

export interface BurialDto {
  _id: string;
  region?: string;
  russia_region?: string;
  cemetery_id?: string;
  city?: string;
  cemetery_name?: string;
  name: string;
  life_years?: string;
  brief_info?: string;
  connected_person_id?: string;
  connected_person_name?: string;
  images?: ImageDto[];
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface BurialCreateDto {
  region?: string;
  russia_region?: string;
  cemetery_id?: string;
  city?: string;
  cemetery_name?: string;
  name: string;
  life_years?: string;
  brief_info?: string;
  connected_person_id?: string;
  image_ids?: string[];
}

export interface BurialUpdateDto {
  region?: string;
  russia_region?: string;
  cemetery_id?: string;
  city?: string;
  cemetery_name?: string;
  name?: string;
  life_years?: string;
  brief_info?: string;
  connected_person_id?: string;
  image_ids?: string[];
  is_published?: boolean;
  sort_order?: number;
}
