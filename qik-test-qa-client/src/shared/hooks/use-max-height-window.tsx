'use client'

import React, { useEffect, useState } from 'react'

export const useMaxHeightWindow = (
  wrapperRef: React.RefObject<HTMLElement | null>,
  dependency?: any
) => {
  const [maxHeight, setMaxHeight] = useState(0)
  useEffect(() => {
    const updateMaxHeight = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        setMaxHeight(window.innerHeight - rect.bottom)
      }
    }

    updateMaxHeight()
    window.addEventListener('resize', updateMaxHeight)
    window.addEventListener('scroll', updateMaxHeight)
    return () => {
      window.removeEventListener('resize', updateMaxHeight)
      window.removeEventListener('scroll', updateMaxHeight)
    }
  }, [dependency])
  return { maxHeight }
}
