import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, User } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const EventAttendanceCard = ({ attendance }) => {
  const navigate = useNavigate();

  const { user, attended, session } = attendance;
  const eventId = session?.event?.id;

  const handleCardClick = () => {
    if (user?.id && eventId) {
      navigate(`/dashboard/attendance/user/${user.id}/event/${eventId}`);
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "U";
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user?.profilePicture}
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {user ? (
                  getInitials(user.firstName, user.lastName)
                ) : (
                  <User className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || "Unknown User"}
                </h4>
                <Badge
                  variant={attended ? "default" : "destructive"}
                  className={attended ? "bg-green-100 text-green-800" : ""}
                >
                  <div className="flex items-center gap-1">
                    {attended ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {attended ? "Present" : "Absent"}
                  </div>
                </Badge>
              </div>

              {user?.email && (
                <p className="text-sm text-gray-600">{user.email}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            {session?.date && (
              <p className="text-sm text-gray-600">
                {format(new Date(session.date), "MMM dd, yyyy")}
              </p>
            )}
            {session?.startTime && (
              <p className="text-xs text-gray-500">
                {session.startTime}
                {session.endTime && ` - ${session.endTime}`}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

EventAttendanceCard.propTypes = {
  attendance: PropTypes.shape({
    id: PropTypes.number.isRequired,
    attended: PropTypes.bool.isRequired,
    userId: PropTypes.number,
    sessionId: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      profilePicture: PropTypes.string,
    }).isRequired,
    session: PropTypes.shape({
      id: PropTypes.number.isRequired,
      eventId: PropTypes.number,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      event: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
};

export default EventAttendanceCard;
