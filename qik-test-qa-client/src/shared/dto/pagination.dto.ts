export namespace PaginationDTO {
  export type Request = { page: number; limit: number }

  export type Response = {
    page: number
    total_pages: number
    items_count: number
    is_last_page: boolean
  }
}
