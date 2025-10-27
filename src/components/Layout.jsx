import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full max-w-screen-lg p-4 space-y-4">
        <div className="flex justify-between items-center gap-4 sticky top-5 bg-white p-6 shadow-lg z-20">
          <SidebarTrigger className="bg-emerald-600 hover:bg-emerald-500 " />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
