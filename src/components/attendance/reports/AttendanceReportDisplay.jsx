// src/components/attendance/reports/AttendanceReportDisplay.jsx
import * as React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useGetAttendanceReport } from "@/hooks/useAttendanceReports";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import { format } from "date-fns";

export const AttendanceReportDisplay = ({ params, onPageChange }) => {
  const { data, error, isError, isLoading, refetch } =
    useGetAttendanceReport(params);

  const handleRefresh = React.useCallback(() => refetch(), [refetch]);

  if (isError) {
    const msg = extractApiErrorMessage(error).message;
    return <ErrorMessage error={msg} onRetry={handleRefresh} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Summary Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { data: attendances, topAttendees, summary, pagination } = data;

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "LATE":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "ABSENT":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attendance Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pagination?.totalRecords || 0} total records
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendance
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalAttendance || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary?.presentCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.totalAttendance > 0
                ? `${(
                    (summary.presentCount / summary.totalAttendance) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {summary?.lateCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.totalAttendance > 0
                ? `${(
                    (summary.lateCount / summary.totalAttendance) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary?.absentCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.totalAttendance > 0
                ? `${(
                    (summary.absentCount / summary.totalAttendance) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Attendees */}
      {topAttendees && topAttendees.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <CardTitle>Top Attendees</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Most active participants
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAttendees.map((attendee, index) => (
                <div
                  key={attendee.userId}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      #{index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={attendee.profilePicture}
                        alt={attendee.userName}
                      />
                      <AvatarFallback>
                        {getInitials(
                          attendee.userName?.split(" ")[0],
                          attendee.userName?.split(" ")[1]
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{attendee.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {attendee.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-base font-semibold px-3 py-1"
                  >
                    {attendee.attendanceCount}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed attendance information
          </p>
        </CardHeader>
        <CardContent>
          {attendances && attendances.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">User</th>
                      <th className="text-left p-3 font-medium">Event</th>
                      <th className="text-left p-3 font-medium">Location</th>
                      <th className="text-left p-3 font-medium">
                        Session Date
                      </th>
                      <th className="text-left p-3 font-medium">Check-In</th>
                      <th className="text-left p-3 font-medium">Check-Out</th>
                      <th className="text-left p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((record) => (
                      <tr
                        key={record.attendanceId}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getInitials(
                                  record.userName?.split(" ")[0],
                                  record.userName?.split(" ")[1]
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{record.userName}</p>
                              <p className="text-xs text-muted-foreground">
                                {record.userEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{record.eventTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {record.eventType}
                              {record.isRecurring && " • Recurring"}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm">{record.location?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {record.location?.city},{" "}
                                {record.location?.country}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {format(
                                new Date(record.sessionStartDate),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {record.checkInTime
                                ? format(new Date(record.checkInTime), "HH:mm")
                                : "—"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {record.checkOutTime
                                ? format(new Date(record.checkOutTime), "HH:mm")
                                : "—"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing page {pagination.page} of {pagination.totalPages} (
                    {pagination.totalRecords} total records)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => onPageChange(pagination.page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              variant={
                                pagination.page === pageNum
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => onPageChange(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => onPageChange(pagination.page + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No attendance records found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

AttendanceReportDisplay.propTypes = {
  params: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    search: PropTypes.string,
    userId: PropTypes.number,
    eventName: PropTypes.string,
    locationName: PropTypes.string,
    status: PropTypes.string,
    isRecurring: PropTypes.bool,
    eventType: PropTypes.string,
    checkInStartDate: PropTypes.string,
    checkInEndDate: PropTypes.string,
    sessionStartDate: PropTypes.string,
    sessionEndDate: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
};
