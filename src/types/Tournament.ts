import type { User } from './User'

interface Tournament {
  id?: number | null
  name?: string
  description?: string
  created_at?: Date
  updated_at?: Date
  started?: boolean
  user_id?: number
  user?: User
  _url?: string
}

export { Tournament }
