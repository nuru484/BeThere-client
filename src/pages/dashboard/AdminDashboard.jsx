// src/pages/AdminDashboard.jsx
import { useState } from "react";
import {
  useGetAdminDashboardTotals,
  useGetAllUsersAttendanceData,
} from "@/hooks/useDashboard";
import DashboardTotalsCard from "@/components/dashboard/DashboardTotalsCard";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import AttendanceLineChart from "@/components/dashboard/AttendanceLineChart";
import AttendanceBarChart from "@/components/dashboard/AttendanceBarChart";
import AttendancePieChart from "@/components/dashboard/AttendancePieChart";
import EventTypeChart from "@/components/dashboard/EventTypeChart";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays } from "date-fns";
import DashboardSkeleton from "@/components/dashboard/skeletons/DashboardSkeleton";
import AttendanceDataSkeleton from "@/components/dashboard/skeletons/AttendanceDataSkeleton";

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
          <DashboardSkeleton />
        ) : isError ? (
          <div className="flex items-center justify-center min-h-48 px-4">
            <ErrorMessage
              error={extractApiErrorMessage(error).message}
              onRetry={refetch}
            />
          </div>
        ) : (
          <DashboardTotalsCard totals={totals} isAdmin={true} />
        )}

        <DateRangeSelector
          onDateChange={setDateRange}
          isLoading={isAttendanceLoading}
        />

        {isAttendanceLoading && <AttendanceDataSkeleton />}

        {isAttendanceError && (
          <div className="flex items-center justify-center min-h-96 px-4">
            <ErrorMessage
              error={extractApiErrorMessage(attendanceError).message}
              onRetry={refetchAttendance}
            />
          </div>
        )}

        {!isAttendanceLoading && !isAttendanceError && summary && (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Attendances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold break-words">
                    {summary.totalAttendances}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 break-words">
                    {summary.dateRange.from} to {summary.dateRange.to}
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Unique Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold break-words">
                    {summary.uniqueUsersAttended}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Attended during period
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Present Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 break-words">
                    {summary.statusPercentages.present}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 break-words">
                    {summary.statusCounts.present} attendances
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Absent Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 break-words">
                    {summary.statusPercentages.absent}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 break-words">
                    {summary.statusCounts.absent} absences
                  </p>
                </CardContent>
              </Card>
            </div>

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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
