export type PassingMethod = 'on_foot' | 'by_bus' | 'mixed';

export interface ContentSection {
  topic: string;
  content: string;
}

export interface ExcursionSource {
  source: string;
  url: string;
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
  sort_order?: number;
  is_published?: boolean;
}

export type ExcursionUpdateDto = Partial<ExcursionCreateDto>;
