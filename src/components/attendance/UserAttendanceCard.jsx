import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const UserAttendanceCard = ({ attendance }) => {
  const navigate = useNavigate();
  const { session, attended, userId } = attendance;
  const { event } = session;
  const { location } = event;

  const handleCardClick = () => {
    if (userId && event.id) {
      navigate(`/dashboard/attendance/user/${userId}/event/${event.id}`);
    }
  };

  return (
    <Card
      className="w-full hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-gray-50"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {event.title}
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
        {event.description && (
          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
        )}
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

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
          <span>
            {location.name}
            {location.city && `, ${location.city}`}
            {location.country && `, ${location.country}`}
          </span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Event Type: <span className="font-medium">{event.type}</span>
            {event.isRecurring && (
              <Badge variant="outline" className="ml-2 text-xs">
                Recurring
              </Badge>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

UserAttendanceCard.propTypes = {
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
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      event: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        locationId: PropTypes.number,
        type: PropTypes.string,
        isRecurring: PropTypes.bool,
        recurrenceRule: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        location: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string,
          latitude: PropTypes.number,
          longitude: PropTypes.number,
          city: PropTypes.string,
          country: PropTypes.string,
          createdAt: PropTypes.string,
          updatedAt: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default UserAttendanceCard;
