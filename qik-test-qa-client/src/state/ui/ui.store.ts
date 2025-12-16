'use client'

import { ReactNode } from 'react'
import { create } from 'zustand'
import { UserTheme } from '@entities'
import { uiConfig } from './ui.config'

export type Tokens = Record<string, string>
export type IconMap = Record<string, ReactNode>

export const themeNameMap: Record<UserTheme, string> = {
  light: 'Светлая',
  dark: 'Тёмная',
}

interface UIState {
  theme: UserTheme
  tokens: Tokens
  icons: IconMap
  setTheme: (theme: UserTheme) => void
  setToken: (key: string, value: string) => void
  setTokens: (tokens: Tokens) => void
  setIcon: (name: string, icon: ReactNode) => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: UserTheme.light,
  tokens: { ...uiConfig.tokens },
  icons: {},
  setTheme: (theme: UserTheme) => set({ theme }),
  setToken: (key: string, value: string) => set((s) => ({ tokens: { ...s.tokens, [key]: value } })),
  setTokens: (tokens: Tokens) => set({ tokens }),
  setIcon: (name: string, icon: ReactNode) => set((s) => ({ icons: { ...s.icons, [name]: icon } })),
}))
