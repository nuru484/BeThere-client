import { Card, CardContent } from "@/components/ui/card";
import EventAttendanceCard from "./EventAttendanceCard";
import PropTypes from "prop-types";

const EventAttendanceList = ({ attendances }) => {
  if (!attendances || attendances.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Attendance Records
            </h3>
            <p className="text-gray-600">No one has attended this event yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {attendances.map((attendance) => (
        <EventAttendanceCard key={attendance.id} attendance={attendance} />
      ))}
    </div>
  );
};

EventAttendanceList.propTypes = {
  attendances: PropTypes.arrayOf(
    PropTypes.shape({
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
        date: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
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
          }),
        }),
      }).isRequired,
    })
  ).isRequired,
};

export default EventAttendanceList;
