"use client"

import { FC, ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // или твой путь

export const Page: FC<Page.Props> = ({ Sidebar, Main }) => {
  return (
      <div className="flex h-screen w-full overflow-hidden">
        <SidebarProvider>
          {Sidebar}
          <main className="flex flex-1 flex-col h-full min-w-0 bg-background relative">
            {/* Триггер можно вынести сюда или оставить внутри Main,
                но обычно он лежит в левом верхнем углу контента */}
            <div className="absolute left-2 top-3 z-20 md:hidden">
              <SidebarTrigger />
            </div>

            {Main}
          </main>
        </SidebarProvider>
      </div>
  );
};

export namespace Page {
  export type Props = {
    Sidebar: ReactNode;
    Main: ReactNode
  };
}