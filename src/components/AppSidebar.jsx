import React, { useState } from "react";
import {
  CalendarCheck2,
  UserRoundPen,
  Home,
  Users,
  LogOut,
  ScanFace,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth, useLogout } from "@/hooks/useAuth";

const getMenuItems = (user) => {
  const isAdmin = user?.role === "ADMIN";
  const shouldShowFaceScan = user?.faceScan === null && !isAdmin;

  console.log("User face scan:", user?.faceScan);

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

export function AppNavbar() {
  const { user } = useAuth();
  const location = useLocation();
  const items = React.useMemo(() => getMenuItems(user), [user]);
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActiveTab = (item) => {
    return location.pathname === item.path;
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-emerald-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <span className="text-white font-bold text-lg md:text-xl">
              QR CODE ATTENDANCE
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {items.map((item) => {
              const isActive = isActiveTab(item);
              return (
                <NavLink
                  key={item.title}
                  to={item.url === "" ? "/dashboard" : `/dashboard/${item.url}`}
                >
                  <button
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "text-emerald-100 hover:bg-emerald-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </button>
                </NavLink>
              );
            })}

            {/* Logout Button - Desktop */}
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-emerald-100 hover:bg-red-600 hover:text-white transition-colors ml-2"
              aria-label="Logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Slides down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-emerald-700">
          {items.map((item) => {
            const isActive = isActiveTab(item);
            return (
              <NavLink
                key={item.title}
                to={item.url === "" ? "/dashboard" : `/dashboard/${item.url}`}
                onClick={handleNavClick}
              >
                <button
                  className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-800 text-white"
                      : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.title}</span>
                </button>
              </NavLink>
            );
          })}

          {/* Logout Button - Mobile */}
          <button
            onClick={() => {
              handleNavClick();
              logout();
            }}
            className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-emerald-100 hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Logout"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
