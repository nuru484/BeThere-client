// src/pages/dashboard/UsersManagePage.jsx
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { UsersDataTable } from "@/components/users/table/UsersDataTable";
import { DataTableSkeleton } from "@/components/ui/DataTableSkeleton";
import { useGetAllUsers } from "@/hooks/useUsers";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Shield, UserCog } from "lucide-react";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";

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
  const totalUsers = usersData?.meta?.total || 0;

  // Calculate user stats
  const adminCount = users?.filter((user) => user.role === "ADMIN").length || 0;
  const memberCount = users?.filter((user) => user.role === "USER").length || 0;

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

  const { message } = extractApiErrorMessage(error);

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96 px-4">
        <ErrorMessage error={message} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">
                  Users Management
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 sm:mt-1.5 leading-snug">
                  Manage all registered users and their roles
                </p>
              </div>
            </div>

            {/* Add User Button */}
            <Link
              to="/dashboard/users/create"
              className="px-3 py-2 sm:px-4 sm:py-2.5 bg-foreground text-background 
                 rounded-lg shadow-sm cursor-pointer transition-all duration-200 
                 hover:bg-foreground/90 hover:shadow-md active:scale-95
                 text-xs sm:text-sm font-semibold
                 text-center whitespace-nowrap flex-shrink-0
                 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Add User</span>
            </Link>
          </div>

          {/* Stats Cards - Only show when users exist */}
          {totalUsers > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2.5 bg-blue-100 rounded-lg flex-shrink-0">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                        Total Users
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
                        {totalUsers}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
                        registered
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2.5 bg-purple-100 rounded-lg flex-shrink-0">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                        Admins
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
                        {adminCount}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
                        {totalUsers > 0
                          ? `${((adminCount / totalUsers) * 100).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow col-span-2 lg:col-span-1">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2.5 bg-emerald-100 rounded-lg flex-shrink-0">
                      <UserCog className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                        Users
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
                        {memberCount}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
                        {totalUsers > 0
                          ? `${((memberCount / totalUsers) * 100).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Users Data Table */}
        <div className="overflow-hidden">
          <UsersDataTable
            data={users || []}
            loading={isLoading}
            totalCount={totalUsers}
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
    </div>
  );
};

export default Userspage;
