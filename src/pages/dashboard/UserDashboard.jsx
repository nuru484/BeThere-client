// src/pages/UserDashboard.jsx
import { useGetUserDashboardTotals } from "@/hooks/useDashboard";
import DashboardTotalsCard from "@/components/dashboard/DashboardTotalsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

const UserDashboard = () => {
  const { data, isLoading, isError, error } = useGetUserDashboardTotals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.response?.data?.message ||
              "Failed to load dashboard data. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totals = data?.data || {};

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">
          Your personal overview of events and sessions
        </p>
      </div>

      <DashboardTotalsCard totals={totals} isAdmin={false} />

      {/* Additional user-specific content can go here */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Placeholder for recent events or attendance history */}
      </div>
    </div>
  );
};

export default UserDashboard;
