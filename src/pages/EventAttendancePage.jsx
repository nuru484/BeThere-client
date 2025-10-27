import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useEventAttendance } from "@/hooks/useAttendance";
import { useAuth } from "@/hooks/useAuth";
import EventAttendanceList from "@/components/attendance/EventAttendanceList";
import { format } from "date-fns";

const EventAttendancePage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eventAttendance, isLoading, error } = useEventAttendance(eventId);

  // Check if user is admin
  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  const attendanceData = eventAttendance?.data || [];
  const totalRecords = eventAttendance?.pagination?.totalRecords || 0;

  // Get event details from first attendance record
  const eventDetails = attendanceData[0]?.session?.event;

  // Calculate stats
  const presentCount = attendanceData.filter((a) => a.attended).length;
  const absentCount = totalRecords - presentCount;
  const attendanceRate =
    totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Users className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Event Attendance
              {eventDetails && ` - ${eventDetails.title}`}
            </h1>
            <p className="text-gray-600">
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

      {/* Event Details */}
      {eventDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {eventDetails.title}
                </h3>
                {eventDetails.description && (
                  <p className="text-gray-600 mt-1">
                    {eventDetails.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {eventDetails.startDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                    <span>
                      {format(new Date(eventDetails.startDate), "PPP")}
                      {eventDetails.endDate &&
                        ` - ${format(new Date(eventDetails.endDate), "PPP")}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>
                    {eventDetails.startTime} - {eventDetails.endTime}
                  </span>
                </div>

                {eventDetails.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                    <span>
                      {eventDetails.location.name}
                      {eventDetails.location.city &&
                        `, ${eventDetails.location.city}`}
                      {eventDetails.location.country &&
                        `, ${eventDetails.location.country}`}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Badge variant="outline">{eventDetails.type}</Badge>
                  {eventDetails.isRecurring && (
                    <Badge variant="secondary">Recurring</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Attendees</p>
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
              <UserCheck className="h-8 w-8 text-green-600" />
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
              <UserX className="h-8 w-8 text-red-600" />
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
                <p className="text-2xl font-bold text-gray-900">
                  {attendanceRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <EventAttendanceList
            attendances={attendanceData}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventAttendancePage;
