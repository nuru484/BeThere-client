import { SidebarProvider } from "@/components/ui/sidebar";
import { AppNavbar } from "@/components/AppNavbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <main className="w-full container mx-auto min-h-screen">
        <AppNavbar />
        <div className="p-4 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
