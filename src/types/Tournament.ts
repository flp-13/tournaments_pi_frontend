interface Tournament {
  id?: number | null
  name?: string
  description?: string
  created_at?: Date
  updated_at?: Date
  started?: boolean
  _url?: string
}

export { Tournament }
