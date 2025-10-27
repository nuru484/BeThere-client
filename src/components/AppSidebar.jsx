import React from "react";
import {
  CalendarCheck2,
  UserRoundPen,
  Home,
  Users,
  LogOut,
  ScanFace,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth, useLogout } from "@/hooks/useAuth";

const getMenuItems = (user) => {
  const isAdmin = user?.role === "ADMIN";
  const shouldShowFaceScan = user?.faceScan === null && !isAdmin;

  return [
    {
      title: "Dashboard",
      icon: Home,
      url: "",
      path: "/dashboard",
    },
    {
      title: "Events",
      icon: CalendarCheck2,
      url: "events",
      path: "/dashboard/events",
    },
    // Attendance (only for non-admins)
    ...(!isAdmin
      ? [
          {
            title: "My Attendance",
            icon: UserRoundPen,
            url: "attendance",
            path: "/dashboard/attendance",
          },
        ]
      : []),
    // Face Scan (only if not set and not admin)
    ...(shouldShowFaceScan
      ? [
          {
            title: "Add Face Scan",
            icon: ScanFace,
            url: "add-facescan",
            path: "/dashboard/add-facescan",
          },
        ]
      : []),
    // Users (only for admins)
    ...(isAdmin
      ? [
          {
            title: "Users",
            icon: Users,
            url: "users",
            path: "/dashboard/users",
          },
        ]
      : []),
  ];
};

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const items = React.useMemo(() => getMenuItems(user), [user]);
  const logout = useLogout();

  const isActiveTab = (item) => {
    return location.pathname === item.path;
  };

  return (
    <Sidebar className="border-r border-emerald-200 bg-emerald-50">
      <SidebarHeader className="border-b border-emerald-200 bg-emerald-600">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="font-bold text-white hover:bg-emerald-700 hover:text-white transition-colors"
              aria-label="QR Code Attendance Menu"
              tabIndex={0}
            >
              QR CODE ATTENDANCE
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = isActiveTab(item);
                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink
                      to={
                        item.url === ""
                          ? "/dashboard"
                          : `/dashboard/${item.url}`
                      }
                    >
                      <SidebarMenuButton
                        className={`w-full flex items-center transition-colors ${
                          isActive
                            ? "bg-emerald-100 text-emerald-900 font-semibold"
                            : "hover:bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4 text-emerald-600" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-emerald-200 bg-emerald-600">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="w-full text-white hover:bg-red-600 transition-colors cursor-pointer"
              aria-label="Logout"
              tabIndex={0}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
