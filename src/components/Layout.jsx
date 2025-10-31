import { SidebarProvider } from "@/components/ui/sidebar";
import { AppNavbar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <main className="w-full container space-y-4">
        <AppNavbar />
        <div className="p-4 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
