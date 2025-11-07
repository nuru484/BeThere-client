// src/pages/dashboard/DashboardRedirect.jsx
import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const DashboardRedirect = () => {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!user) logout();
  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  } else if (user.role === "USER") {
    return <UserDashboard />;
  } else {
    logout();
  }
};

export default DashboardRedirect;
