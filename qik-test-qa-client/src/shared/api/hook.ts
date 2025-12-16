'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

import { Fetcher } from './types'

export function useFetcher<TResult, TParams>(
  fetcher: Fetcher<TResult, TParams>,
  initialParams?: TParams,
  options?: { immediate?: boolean }
) {
  const [isLoading, setIsLoading] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [data, setData] = useState<TResult | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (params: TParams): Promise<TResult | null> => {
      setIsLoading(true)
      setIsErrored(false)
      setError(null)
      try {
        const result = await fetcher(params)
        setData(result)
        return result
      } catch (err) {
        console.error(err)
        setIsErrored(true)
        setError(err as Error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetcher]
  )

  // ⏱ Автозапуск, если указан initialParams и immediate === true
  const lastParamsRef = useRef<TParams | undefined>(undefined)

  useEffect(() => {
    if (
      options?.immediate &&
      JSON.stringify(lastParamsRef.current) !== JSON.stringify(initialParams)
    ) {
      lastParamsRef.current = initialParams
      if (initialParams) execute(initialParams)
    }
  }, [initialParams, options?.immediate, execute])

  return {
    execute, // строго типизированный вызов
    isLoading,
    isErrored,
    data,
    error,
  }
}
