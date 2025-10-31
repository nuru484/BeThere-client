// src/pages/dashboard/AdminDashboardPage.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import {
  Users,
  Calendar,
  CalendarClock,
  UserCheck,
  LayoutDashboard,
  AlertCircle,
} from "lucide-react";
import {
  useGetTotalUsers,
  useGetTotalEvents,
  useGetUpcomingEvents,
  useGetTodayAttendance,
  useGetRecentActivity,
} from "@/hooks/useDashboard";
import { usePageTitle } from "@/hooks/usePageTitle";

const AdminDashboardPage = () => {
  usePageTitle("Dashboard");

  const {
    totalUsers,
    isLoading: usersLoading,
    error: usersError,
  } = useGetTotalUsers();
  const {
    totalEvents,
    isLoading: eventsLoading,
    error: eventsError,
  } = useGetTotalEvents();
  const {
    upcomingEvents,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useGetUpcomingEvents();
  const {
    todayAttendance,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useGetTodayAttendance();
  const {
    recentActivity,
    isLoading: activityLoading,
    error: activityError,
  } = useGetRecentActivity();

  // Check if there's a special message about recurring events
  const hasRecurringMessage = upcomingEvents?.message?.includes(
    "Only one recurring event"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <LayoutDashboard className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your attendance management system
          </p>
        </div>
      </div>

      {/* Special Alert for Recurring Events */}
      {hasRecurringMessage && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{upcomingEvents.message}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          title="Total Users"
          value={totalUsers?.data?.totalUsers || 0}
          icon={Users}
          iconColor="text-blue-600"
          isLoading={usersLoading}
          error={usersError}
        />

        <DashboardStatCard
          title="Total Events"
          value={totalEvents?.data?.totalEvents || 0}
          icon={Calendar}
          iconColor="text-purple-600"
          isLoading={eventsLoading}
          error={eventsError}
        />

        <DashboardStatCard
          title="Upcoming Events"
          value={upcomingEvents?.data?.upcomingEventsCount || 0}
          icon={CalendarClock}
          iconColor="text-orange-600"
          isLoading={upcomingLoading}
          error={upcomingError}
        />

        <DashboardStatCard
          title="Today's Attendance"
          value={todayAttendance?.data?.attendanceCount || 0}
          icon={UserCheck}
          iconColor="text-green-600"
          isLoading={attendanceLoading}
          error={attendanceError}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivityCard
            recentActivity={recentActivity}
            isLoading={activityLoading}
            error={activityError}
          />
        </div>

        {/* Quick Actions or Additional Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">System Status</span>
                <span className="text-sm font-medium text-green-600">
                  Active
                </span>
              </div>

              {todayAttendance?.message && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    {todayAttendance.message}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User Growth</span>
                  <span className="text-sm font-medium text-emerald-600">
                    +12%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Event Completion
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    98%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Database</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Face Recognition
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Last Backup</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
