// UserEventAttendanceCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import PropTypes from "prop-types";

const UserEventAttendanceCard = ({ attendance }) => {
  const { session, attended, createdAt } = attendance;

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Session #{session.id}
          </CardTitle>
          <Badge variant={attended ? "success" : "destructive"}>
            {attended ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {attended ? "Present" : "Absent"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
          <span>{format(new Date(session.date), "PPP")}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-emerald-600" />
          <span>
            {session.startTime}
            {session.endTime && ` - ${session.endTime}`}
          </span>
        </div>

        {/* Attendance Status Details */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  attended ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {attended ? "Marked Present" : "Marked Absent"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Recorded: {format(new Date(createdAt), "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

UserEventAttendanceCard.propTypes = {
  attendance: PropTypes.shape({
    id: PropTypes.number.isRequired,
    attended: PropTypes.bool.isRequired,
    userId: PropTypes.number,
    sessionId: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    session: PropTypes.shape({
      id: PropTypes.number.isRequired,
      eventId: PropTypes.number,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      event: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        location: PropTypes.shape({
          name: PropTypes.string,
          city: PropTypes.string,
          country: PropTypes.string,
        }),
      }),
    }).isRequired,
  }).isRequired,
};

export default UserEventAttendanceCard;
