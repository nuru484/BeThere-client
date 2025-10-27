import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRoundPen, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import { useGetUserAttendance } from "@/hooks/useAttendance";
import { useAuth } from "@/hooks/useAuth";
import UserAttendanceList from "@/components/attendance/UserAttendanceList";

const UserAttendancePage = () => {
  const { user } = useAuth();
  const { userAttendance, isLoading, error } = useGetUserAttendance(user?.id);

  const attendanceData = userAttendance?.data || [];
  const totalRecords = userAttendance?.pagination?.totalRecords || 0;

  // Calculate stats
  const presentCount = attendanceData.filter((a) => a.attended).length;
  const attendanceRate =
    totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <UserRoundPen className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600">
            View your attendance history and statistics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  attendanceRate >= 80
                    ? "success"
                    : attendanceRate >= 60
                    ? "warning"
                    : "destructive"
                }
                className="p-2"
              >
                {attendanceRate >= 80
                  ? "Excellent"
                  : attendanceRate >= 60
                  ? "Good"
                  : "Needs Improvement"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <UserAttendanceList
            attendances={attendanceData}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAttendancePage;
