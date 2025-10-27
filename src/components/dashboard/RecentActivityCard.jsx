// src/components/dashboard/RecentActivityCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Calendar, UserCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";

const RecentActivityCard = ({ recentActivity, isLoading, error }) => {
  console.log("Recent Activity: ", recentActivity);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process events (they have timestamps)
  const eventActivities = (recentActivity?.data?.recentEvents || []).map(
    (event) => ({
      ...event,
      type: "event",
    })
  );

  // Process attendances (they don't have timestamps, so we'll show them without time)
  const attendanceActivities = (
    recentActivity?.data?.recentAttendances || []
  ).map((attendance, index) => ({
    ...attendance,
    type: "attendance",
    // Since attendances don't have timestamps, we'll use a fallback or just show them as recent
    timestamp: null, // or you could use new Date() for current time as fallback
    id: `attendance-${index}`, // Add unique ID for React key
  }));

  // Combine activities - events first (with timestamps), then attendances
  const activities = [...eventActivities, ...attendanceActivities].slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-start gap-3"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "event" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  {activity.type === "event" ? (
                    <Calendar className="h-4 w-4 text-blue-600" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {activity.message}
                  </p>
                  {activity.timestamp ? (
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Recent activity</p>
                  )}
                </div>
                <Badge
                  variant={activity.type === "event" ? "secondary" : "default"}
                  className="text-xs"
                >
                  {activity.type === "event" ? "Event" : "Check-in"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

RecentActivityCard.propTypes = {
  recentActivity: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default RecentActivityCard;
