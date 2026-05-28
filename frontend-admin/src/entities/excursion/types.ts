export type PassingMethod = 'on_foot' | 'by_bus' | 'mixed';
export type ExcursionType = 'on_foot' | 'by_car' | 'by_bike';

export interface ContentSection {
  topic: string;
  content: string;
}

export interface ExcursionSource {
  source: string;
  url: string;
}

export interface ExcursionPoint {
  address: string;
  object_id?: string;
  description?: string;
  photo_url?: string;
  audio_url?: string;
}

export interface ExcursionDto {
  _id: string;
  name: string;
  description?: string;
  time?: string;
  guide?: string;
  passing_methods?: PassingMethod[];
  key_points?: string[];
  text_content?: ContentSection[];
  cover_photo?: string;
  route_photo?: string;
  sources?: ExcursionSource[];
  type?: ExcursionType;
  points?: ExcursionPoint[];
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExcursionCreateDto {
  name: string;
  description?: string;
  time?: string;
  guide?: string;
  passing_methods?: string[];
  key_points?: string[];
  text_content?: ContentSection[];
  cover_photo?: string;
  route_photo?: string;
  sources?: ExcursionSource[];
  type?: ExcursionType;
  points?: ExcursionPoint[];
  sort_order?: number;
  is_published?: boolean;
}

export type ExcursionUpdateDto = Partial<ExcursionCreateDto>;
