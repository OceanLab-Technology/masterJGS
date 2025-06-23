import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import type { ReactNode } from "react"

export default function DashboardLayout({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <div className="text-xl font-semibold">{title}</div>
            </div>
          </header>

          {/* Fills remaining space under header */}
        <div className="flex flex-col gap-4 pt-0 pb-6 px-4 flex-1 overflow-hidden">
  {children}
</div>

        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

