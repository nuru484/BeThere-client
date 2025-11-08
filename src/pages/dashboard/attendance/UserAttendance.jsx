// src/pages/dashboard/UserAttendancePage.jsx
import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AttendanceDataTable } from "@/components/attendance/userAttendance/table/AttendanceDataTable";
import { DataTableSkeleton } from "@/components/ui/DataTableSkeleton";
import { useGetUserAttendance } from "@/hooks/useAttendance";
import ErrorMessage from "@/components/ui/ErrorMessage";

const UserAttendancePage = () => {
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    search: undefined,
    status: undefined,
    eventType: undefined,
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
  } = useGetUserAttendance(userId, queryParams);

  const attendanceRecords = attendanceData?.data;

  const userName = attendanceRecords?.[0]?.user
    ? `${attendanceRecords[0].user.firstName} ${attendanceRecords[0].user.lastName}`
    : "User";

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

  const handleRefresh = () => refetch();

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
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">
                {userName}&apos;s Attendance
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                View and manage attendance records
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Data Table */}
        <AttendanceDataTable
          data={attendanceRecords || []}
          loading={isLoading}
          totalCount={attendanceData?.pagination?.totalRecords || 0}
          page={page}
          pageSize={pageSize}
          filters={filters}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default UserAttendancePage;
