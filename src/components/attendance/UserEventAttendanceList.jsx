// UserEventAttendanceList.jsx
import { Card, CardContent } from "@/components/ui/card";
import UserEventAttendanceCard from "./UserEventAttendanceCard";
import PropTypes from "prop-types";

const UserEventAttendanceList = ({ attendances, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Error Loading Attendance
            </h3>
            <p className="text-gray-600">
              {error.message || "Failed to load attendance records"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!attendances || attendances.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Attendance Records
            </h3>
            <p className="text-gray-600">
              No sessions have been recorded for this event yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {attendances.map((attendance) => (
        <UserEventAttendanceCard key={attendance.id} attendance={attendance} />
      ))}
    </div>
  );
};

UserEventAttendanceList.propTypes = {
  attendances: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      attended: PropTypes.bool.isRequired,
      userId: PropTypes.number,
      sessionId: PropTypes.number,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      session: PropTypes.shape({
        id: PropTypes.number.isRequired,
        eventId: PropTypes.number,
        date: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        event: PropTypes.shape({
          id: PropTypes.number.isRequired,
          title: PropTypes.string,
          description: PropTypes.string,
          type: PropTypes.string,
          location: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string,
            city: PropTypes.string,
            country: PropTypes.string,
          }),
        }),
      }).isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default UserEventAttendanceList;
