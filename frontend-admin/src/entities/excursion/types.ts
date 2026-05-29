export type PassingMethod = 'on_foot' | 'by_bus' | 'mixed';

export interface ExcursionSource {
  source: string;
  url: string;
}

export interface ExcursionPoint {
  address: string;
  object_id?: string;
  description?: string;
  photo_urls?: string[];
  audio_url?: string;
  lat?: number;
  lng?: number;
}

export interface ExcursionDto {
  _id: string;
  name: string;
  description?: string;
  time?: string;
  passing_methods?: PassingMethod[];
  cover_photo?: string;
  route_photo?: string;
  sources?: ExcursionSource[];
  points?: ExcursionPoint[];
  audio_url?: string;
  authors?: string[];
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExcursionCreateDto {
  name: string;
  description?: string;
  time?: string;
  passing_methods?: string[];
  cover_photo?: string;
  route_photo?: string;
  sources?: ExcursionSource[];
  points?: ExcursionPoint[];
  audio_url?: string;
  authors?: string[];
  sort_order?: number;
  is_published?: boolean;
}

export type ExcursionUpdateDto = Partial<ExcursionCreateDto>;
