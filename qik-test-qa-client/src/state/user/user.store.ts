"use client";

import { create } from "zustand";

import { UserDTO } from "@entities";

export type UserStore = {
  user: UserDTO | null;
  setUser: (user: UserDTO) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
