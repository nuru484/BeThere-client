// src/pages/dashboard/UsersManagePage.jsx
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { UsersDataTable } from "@/components/users/table/UsersDataTable";
import { DataTableSkeleton } from "@/components/ui/DataTableSkeleton";
import { useGetAllUsers } from "@/hooks/useUsers";
import ErrorMessage from "@/components/ui/ErrorMessage";

const Userspage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    search: undefined,
    role: undefined,
  });

  // Build query parameters
  const queryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    ),
  };

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllUsers(queryParams);

  const users = usersData?.data;

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

  if (isLoading && !users) {
    return <DataTableSkeleton />;
  }

  const errorMessage = isError
    ? error?.response?.data?.message || "An Unknown Error Occurred!"
    : "An Unknown Error Occurred!";

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ErrorMessage error={errorMessage} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              Users Management
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage all registered users and their roles
            </p>
          </div>

          <Link
            to="/dashboard/users/create"
            className="px-3 py-2 sm:px-4 sm:py-2 bg-foreground text-background 
               rounded-md shadow cursor-pointer transition-colors duration-200 
               hover:bg-foreground/90 text-sm sm:text-base font-medium
               text-center whitespace-nowrap flex-shrink-0"
          >
            Add User
          </Link>
        </div>

        {/* Users Data Table */}
        <UsersDataTable
          data={users || []}
          loading={isLoading}
          totalCount={usersData?.meta?.total || 0}
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

export default Userspage;
