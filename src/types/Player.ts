import type { Tournament } from './Tournament';

export interface Player {
  id?: number | null
  name?: string
  tournament?: Tournament
  created_at: Date
  updated_at: Date
  _url: string
}
