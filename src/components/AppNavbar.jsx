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
import logo from "/assets/logo.png";

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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <NavLink
            to="/dashboard"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="BeThere Logo"
                className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-emerald-600 font-bold text-xl tracking-tight">
                BeThere
              </span>
              <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                Attendance Management
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {items.map((item) => {
              const isActive = isActiveTab(item);
              return (
                <NavLink
                  key={item.title}
                  to={item.url === "" ? "/dashboard" : `/dashboard/${item.url}`}
                  className="group"
                >
                  <button
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                    )}
                  </button>
                </NavLink>
              );
            })}

            {/* User Info & Logout - Desktop */}
            <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
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

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200 ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-gray-50">
          {items.map((item) => {
            const isActive = isActiveTab(item);
            return (
              <NavLink
                key={item.title}
                to={item.url === "" ? "/dashboard" : `/dashboard/${item.url}`}
                onClick={handleNavClick}
              >
                <button
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-white hover:text-emerald-600"
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
            className="w-full flex items-center px-3 py-2.5 mt-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200 border-t border-gray-200 pt-3"
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
