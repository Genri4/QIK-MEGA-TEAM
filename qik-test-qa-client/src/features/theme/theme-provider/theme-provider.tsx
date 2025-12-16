"use client";

import React, { FC } from "react";
import { ClientThemeProvider } from "@features";
import { useUserStore } from "@state";

export const ThemeProvider: FC<ThemeProvider.Props> = ({ children }) => {
  const user = useUserStore((state) => state.user);
  return <ClientThemeProvider user={user}>{children}</ClientThemeProvider>
};

export namespace ThemeProvider {
  export type Props = { children?: React.ReactNode };
}
