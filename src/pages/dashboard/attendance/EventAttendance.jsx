// src/pages/dashboard/EventAttendancePage.jsx
import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, TrendingUp, ArrowLeft } from "lucide-react";
import { EventAttendanceDataTable } from "@/components/attendance/eventAttendance/table/EventAttendanceDataTable";
import { DataTableSkeleton } from "@/components/ui/DataTableSkeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useGetEventAttendance } from "@/hooks/useAttendance";

const EventAttendancePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    search: undefined,
    status: undefined,
    sessionId: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const queryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    ),
  };

  const {
    data: attendanceData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEventAttendance(eventId, queryParams);

  const attendanceRecords = attendanceData?.data;
  const totalCount = attendanceData?.pagination?.totalRecords || 0;

  const eventDetails = attendanceRecords?.[0]?.session?.event;
  const eventTitle = eventDetails?.title || "Event";

  const absentCount =
    attendanceRecords?.filter((a) => a.status === "ABSENT").length || 0;

  const presentCount =
    attendanceRecords?.filter((a) => a.status === "PRESENT").length || 0;

  const attendanceRate =
    totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

  const handlePageChange = (newPage) => setPage(newPage);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1);
  }, []);

  if (isLoading && !attendanceRecords) {
    return <DataTableSkeleton />;
  }

  const errorMessage = isError
    ? error?.message || "An Unknown Error Occurred!"
    : "An Unknown Error Occurred!";

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ErrorMessage error={errorMessage} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">
                {eventTitle} - Attendance
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage and view event attendance records
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => navigate(`/dashboard/events/${eventId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Attendees
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Absent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {absentCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Attendance Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {attendanceRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Data Table */}
        <EventAttendanceDataTable
          data={attendanceRecords || []}
          loading={isLoading}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          filters={filters}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  );
};

export default EventAttendancePage;
