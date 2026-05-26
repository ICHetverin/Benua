import type { ImageDto } from 'entities/image/types';

export interface SimpleEntity {
  _id: string;
  name: string;
}

export interface Description {
  topic: string;
  content: string;
}

export interface PersonDto {
  _id: string;
  name: string;
  life_years?: string;
  birth_place?: string;
  profession?: string;
  connection_with_benua?: string;
  description?: Description[];
  interesting_facts?: string[];
  connected_persons?: SimpleEntity[];
  connected_objects?: SimpleEntity[];
  images?: ImageDto[];
  sources?: { _id: string; text: string; url: string }[];
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  featured_image_id?: string;
  authors?: string[];
}

export interface InlineImage {
  text: string;
  url_to_s3: string;
}

export interface PersonCreateDto {
  name: string;
  life_years?: string;
  birth_place?: string;
  profession?: string;
  connection_with_benua?: string;
  description?: Description[];
  interesting_facts?: string[];
  connected_persons?: string[];
  connected_objects?: string[];
  images?: InlineImage[];
  image_ids?: string[];
  featured_image_id?: string;
  sources?: { text: string; url: string }[];
  authors?: string[];
}

export interface PersonUpdateDto {
  name?: string;
  life_years?: string;
  birth_place?: string;
  profession?: string;
  connection_with_benua?: string;
  description?: Description[];
  interesting_facts?: string[];
  connected_persons?: string[];
  connected_objects?: string[];
  image_ids?: string[];
  sort_order?: number;
  is_published?: boolean;
  featured_image_id?: string;
  sources?: { text: string; url: string }[];
  authors?: string[];
}
