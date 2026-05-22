export type EntityType = 'person' | 'building' | 'excursion';

export interface ActivityItem {
  _id: string;
  name: string;
  entity_type: EntityType;
  updated_at: string;
  updated_by: string | null;
}
