import axios, { AxiosRequestConfig, Method } from 'axios'

import { FetcherOptions } from './types'
import { BASE_URL } from './constants'

export function buildFetcher<TResult, TOptions extends FetcherOptions = FetcherOptions>(
  endpoint: string,
  defaultOptions?: Omit<FetcherOptions, 'body' | 'query' | 'params'>
) {
  return async (options?: TOptions & FetcherOptions): Promise<TResult> => {
    const {
      method = defaultOptions?.method || 'GET',
      body,
      headers = {},
      params,
      query,
    } = options || ({} as TOptions)

    let url = BASE_URL + endpoint
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url = url.replace(`:${key}`, encodeURIComponent(String(value)))
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      url,
      method: method as Method,
      headers: {
        'Content-Type': 'application/json',
        ...defaultOptions?.headers,
        ...headers,
      },
      params: query,
      data: body,
      withCredentials: true,
      validateStatus: () => true, // чтобы не кидал исключения на 4xx/5xx
    }

    const response = await axios(axiosConfig)

    if (response.status >= 200 && response.status < 300) {
      return response.data.payload as TResult
    } else {
      throw new Error(response.data?.message || 'Ошибка запроса')
    }
  }
}
