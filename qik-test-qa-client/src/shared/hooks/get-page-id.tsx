'use client'

import { usePathname } from 'next/navigation'

export const useGetPageId = () => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const id = segments[segments.length - 1]

  return { id }
}
