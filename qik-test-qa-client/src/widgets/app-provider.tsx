"use client";

import { GetUserAuthorizedUser, ThemeProvider } from "@/features";
import { PropsWithChildren } from "react";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <>
      <ThemeProvider>
        <GetUserAuthorizedUser />
        {children}
      </ThemeProvider>
    </>
  );
}
