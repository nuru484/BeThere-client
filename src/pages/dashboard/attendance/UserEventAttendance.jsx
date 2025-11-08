// UserEventAttendancePage.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserRoundPen,
  TrendingUp,
  Calendar,
  CheckCircle,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { useGetUserEventAttendance } from "@/hooks/useAttendance";
import { useParams, useNavigate } from "react-router-dom";
import UserEventAttendanceList from "@/components/attendance/UserEventAttendanceList";
import { Button } from "@/components/ui/button";

const UserEventAttendancePage = () => {
  const { eventId, userId } = useParams();
  const navigate = useNavigate();
  const { userEventAttendance, isLoading, error } = useGetUserEventAttendance(
    userId,
    eventId
  );

  const attendanceData = userEventAttendance?.data || [];
  const totalRecords = userEventAttendance?.pagination?.totalRecords || 0;

  // Calculate stats
  const presentCount = attendanceData.filter((a) => a.attended).length;
  const absentCount = totalRecords - presentCount;
  const attendanceRate =
    totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  // Get event details from first attendance record (if available)
  const eventDetails = attendanceData[0]?.session?.event;

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <XCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600 mb-4">
              {error.message || "Failed to load attendance records"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <UserRoundPen className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {eventDetails
                ? `${eventDetails.title} - Attendance`
                : "Event Attendance"}
            </h1>
            <p className="text-gray-600">
              Your attendance history for this event
            </p>
          </div>
        </div>
      </div>

      {/* Event Info Card */}
      {eventDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Event Details</span>
              <Badge variant="outline" className="text-xs">
                {eventDetails.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-600">
                  {eventDetails.description || "No description available"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Location
                </p>
                <p className="text-sm text-gray-600">
                  {eventDetails.location?.name}
                  {eventDetails.location?.city &&
                    `, ${eventDetails.location.city}`}
                  {eventDetails.location?.country &&
                    `, ${eventDetails.location.country}`}
                </p>
              </div>
              {eventDetails.isRecurring && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Recurrence
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {eventDetails.recurrenceRule || "Recurring Event"}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRecords}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">
                  {presentCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Absent</p>
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
              <TrendingUp className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {attendanceRate}%
                  </p>
                  <Badge
                    variant={
                      attendanceRate >= 80
                        ? "success"
                        : attendanceRate >= 60
                        ? "warning"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {attendanceRate >= 80
                      ? "Excellent"
                      : attendanceRate >= 60
                      ? "Good"
                      : "Poor"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Session Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <UserEventAttendanceList
            attendances={attendanceData}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserEventAttendancePage;
