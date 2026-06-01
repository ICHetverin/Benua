export interface InfographicFileDto {
  url: string;
  key: string;
  type: 'IMAGE' | 'PDF';
}

export interface InfographicDto {
  _id: string;
  name: string;
  description?: string;
  authors?: string[];
  connected_persons?: { _id: string; name: string }[];
  connected_objects?: { _id: string; name: string }[];
  sources?: { _id: string; text: string; url: string }[];
  files?: InfographicFileDto[];
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InfographicCreateDto {
  name: string;
  description?: string;
  authors?: string[];
  connected_persons?: string[];
  connected_objects?: string[];
  sources?: { text: string; url: string }[];
  files?: InfographicFileDto[];
  is_published?: boolean;
  sort_order?: number;
}

export interface InfographicUpdateDto {
  name?: string;
  description?: string;
  authors?: string[];
  connected_persons?: string[];
  connected_objects?: string[];
  sources?: { text: string; url: string }[];
  files?: InfographicFileDto[];
  is_published?: boolean;
  sort_order?: number;
}
