export type PageComponentProps<
  Params extends Record<string, unknown> = Record<string, unknown>,
  SearchParams extends Record<string, unknown> = Record<string, unknown>,
> = {
  params: Params
  searchParams: SearchParams
}
