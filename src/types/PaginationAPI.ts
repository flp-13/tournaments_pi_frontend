interface PaginationAPI<T>{
  count: number,
  total_pages: number,
  next_page: string | null,
  prev_page: string | null,
  results: T[] | null
}

export { PaginationAPI }