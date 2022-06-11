import type { Player } from './Player'

export interface Bracket {
  id?: number | null
  match?: number | null
  player_id?: number | null
  player?: Player | null
  tournament_id?: number
  created_at?: Date
  updated_at?: Date | null
  prev_match?: {
    left: Bracket
    right: Bracket
  } | null
}
