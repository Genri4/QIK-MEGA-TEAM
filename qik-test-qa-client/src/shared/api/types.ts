export type FetcherMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type FetcherOptions = {
  method?: FetcherMethod
  body?: Record<string, unknown>
  headers?: Record<string, string>
  params?: Record<string, string | number> // URL path params
  query?: Record<string, string | number | boolean> // ?query=...
}

export type Fetcher<TResult, TParams> = (params: TParams) => Promise<TResult>
