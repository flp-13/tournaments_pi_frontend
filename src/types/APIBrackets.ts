import type { Bracket } from './Bracket';
import type { Player } from './Player';

export interface APIBrackets {
  brackets?: Bracket | null
  _url?: string
  tournament_url?: string | null
  added_players?: Player[]
  remaining_players?: Player[]
  total_players?: number
  total_rounds?: number
}
