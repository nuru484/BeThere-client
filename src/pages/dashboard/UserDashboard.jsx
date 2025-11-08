// src/pages/UserDashboard.jsx
import { useGetUserDashboardTotals } from "@/hooks/useDashboard";
import DashboardTotalsCard from "@/components/dashboard/DashboardTotalsCard";
import { Loader2 } from "lucide-react";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import ErrorMessage from "@/components/ui/ErrorMessage";

const UserDashboard = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetUserDashboardTotals();

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

  const { message } = extractApiErrorMessage(error);

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96 px-4">
        <ErrorMessage error={message} onRetry={refetch} />
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
