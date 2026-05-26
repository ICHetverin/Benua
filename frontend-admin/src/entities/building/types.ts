import type { ImageDto } from 'entities/image/types';
import type { SimpleEntity, Description, InlineImage } from 'entities/person/types';

export interface BuildingDto {
  _id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  architect?: string;
  years_built?: string;
  history?: string;
  design?: string;
  connection_with_benua?: string;
  description?: Description[];
  interesting_facts?: string[];
  connected_persons?: SimpleEntity[];
  connected_objects?: SimpleEntity[];
  images?: ImageDto[];
  building_type?: string;
  building_subtype?: string;
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BuildingCreateDto {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  architect?: string;
  years_built?: string;
  history?: string;
  design?: string;
  connection_with_benua?: string;
  description?: Description[];
  interesting_facts?: string[];
  building_type?: string;
  building_subtype?: string;
  is_published?: boolean;
  connected_persons?: string[];
  connected_objects?: string[];
  images?: InlineImage[];
  image_ids?: string[];
}

export interface BuildingUpdateDto {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  architect?: string;
  years_built?: string;
  history?: string;
  design?: string;
  connection_with_benua?: string;
  description?: Description[];
  interesting_facts?: string[];
  building_type?: string;
  building_subtype?: string;
  connected_persons?: string[];
  connected_objects?: string[];
  image_ids?: string[];
  sort_order?: number;
  is_published?: boolean;
}
