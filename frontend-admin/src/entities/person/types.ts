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
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
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
}
