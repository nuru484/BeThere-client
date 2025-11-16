// src/pages/AdminDashboard.jsx
import { useState } from "react";
import {
  useGetAdminDashboardTotals,
  useGetAllUsersAttendanceData,
} from "@/hooks/useDashboard";
import DashboardTotalsCard from "@/components/dashboard/DashboardTotalsCard";
import AttendanceCardsError from "@/components/dashboard/AttendanceCardsError";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import AttendanceLineChart from "@/components/dashboard/admin/AttendanceLineChart";
import AttendanceBarChart from "@/components/dashboard/admin/AttendanceBarChart";
import AttendancePieChart from "@/components/dashboard/admin/AttendancePieChart";
import EventTypeChart from "@/components/dashboard/admin/EventTypeChart";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import { format, subDays } from "date-fns";
import DashboardTotalsCardSkeleton from "@/components/dashboard/skeletons/DashboardTotalsCardSkeleton";
import AttendanceDataSkeleton from "@/components/dashboard/skeletons/AttendanceDataSkeleton";
import DashboardTotalsCardError from "@/components/dashboard/DashboardTotalsCardError";

const AdminDashboard = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetAdminDashboardTotals();

  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const {
    data: attendanceData,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useGetAllUsersAttendanceData(dateRange);

  const totals = data?.data || {};
  const attendance = attendanceData?.data || {};
  const { summary, timeSeriesData, statusPercentages, statusCounts } =
    attendance;

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of your system statistics and metrics
          </p>
        </div>

        {isLoading ? (
          <DashboardTotalsCardSkeleton />
        ) : isError ? (
          <DashboardTotalsCardError
            error={extractApiErrorMessage(error).message}
            onRetry={refetch}
          />
        ) : (
          <DashboardTotalsCard totals={totals} isAdmin={true} />
        )}

        <DateRangeSelector
          onDateChange={setDateRange}
          isLoading={isAttendanceLoading}
        />

        {isAttendanceLoading ? (
          <AttendanceDataSkeleton />
        ) : isAttendanceError ? (
          <AttendanceCardsError
            error={extractApiErrorMessage(attendanceError).message}
            onRetry={refetchAttendance}
          />
        ) : (
          summary && (
            <>
              {timeSeriesData && (
                <div className="space-y-6">
                  <div className="w-full overflow-hidden">
                    <AttendanceLineChart data={timeSeriesData} />
                  </div>

                  <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                    <div className="w-full overflow-hidden">
                      <AttendanceBarChart
                        statusCounts={statusCounts}
                        statusPercentages={statusPercentages}
                      />
                    </div>
                    <div className="w-full overflow-hidden">
                      <AttendancePieChart statusCounts={statusCounts} />
                    </div>
                  </div>

                  {summary?.eventTypeBreakdown && (
                    <div className="w-full overflow-hidden">
                      <EventTypeChart
                        eventTypeBreakdown={summary.eventTypeBreakdown}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
