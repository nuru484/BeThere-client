import { useNavigate } from "react-router-dom";
import { Pencil, Trash, Users, LogIn, LogOut, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import PropTypes from "prop-types";
import { useState } from "react";

const EventActionsSidebar = ({
  event,
  user,
  onDelete,
  isDeleting,
  userAttendances = [],
  isLoadingAttendance,
  currentSession,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const isRecurringEvent = event?.isRecurring;

  // Find attendance for the current session
  const currentSessionAttendance = currentSession
    ? userAttendances.find((att) => att.sessionId === currentSession.id)
    : null;

  // For non-recurring events, find the most recent attendance
  const latestAttendance =
    !isRecurringEvent && userAttendances.length > 0
      ? userAttendances.reduce((latest, current) => {
          const latestTime = new Date(latest.checkInTime).getTime();
          const currentTime = new Date(current.checkInTime).getTime();
          return currentTime > latestTime ? current : latest;
        }, userAttendances[0])
      : null;

  // Determine sign-in/sign-out status based on event type
  let hasSignedIn, hasSignedOut, showSignInButton, showSignOutButton;

  if (isRecurringEvent && currentSession) {
    // For recurring events: check current session attendance
    hasSignedIn = currentSessionAttendance?.checkInTime;
    hasSignedOut = currentSessionAttendance?.checkOutTime;

    showSignInButton = !hasSignedIn;
    showSignOutButton = hasSignedIn && !hasSignedOut;
  } else if (!isRecurringEvent) {
    // For non-recurring events: check latest attendance
    hasSignedIn = latestAttendance?.checkInTime;
    hasSignedOut = latestAttendance?.checkOutTime;

    // Only show sign-in if user has never signed in
    showSignInButton = !hasSignedIn;
    // Only show sign-out if user has signed in but hasn't signed out yet
    showSignOutButton = hasSignedIn && !hasSignedOut;
  } else {
    // If recurring but no current session, show both buttons
    showSignInButton = true;
    showSignOutButton = true;
  }

  const handleDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  const handleSignIn = () => {
    navigate(`/dashboard/events/${event.id}/attendance-in`);
  };

  const handleSignOut = () => {
    navigate(`/dashboard/events/${event.id}/attendance-out`);
  };

  const handleViewAttendance = () => {
    navigate(`/dashboard/events/${event.id}/attendance`);
  };

  const handleViewMyAttendance = () => {
    navigate(`/dashboard/attendance/user/${user.id}/event/${event.id}`);
  };

  const handleEditEvent = () => {
    navigate(`/dashboard/events/${event.id}/edit`);
  };

  return (
    <>
      <Card className="shadow-sm border-0 sticky top-4">
        <CardHeader className="pb-4">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
            Quick Actions
          </h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Sign In Button - Conditional */}
          {showSignInButton && (
            <Button
              variant="outline"
              className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-sm"
              onClick={handleSignIn}
              disabled={isLoadingAttendance}
            >
              <LogIn className="w-4 h-4 mr-3" />
              Sign In to Event
            </Button>
          )}

          {/* Sign Out Button - Conditional */}
          {showSignOutButton && (
            <Button
              variant="outline"
              className="w-full justify-start border-teal-200 text-teal-700 hover:bg-teal-50 text-sm"
              onClick={handleSignOut}
              disabled={isLoadingAttendance}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out of Event
            </Button>
          )}

          {/* View My Attendance (Everyone) */}
          <Button
            variant="outline"
            className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 text-sm"
            onClick={handleViewMyAttendance}
          >
            <UserCheck className="w-4 h-4 mr-3" />
            My Event Attendance
          </Button>

          {/* Admin Actions */}
          {isAdmin && (
            <>
              <Button
                variant="outline"
                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                onClick={handleViewAttendance}
              >
                <Users className="w-4 h-4 mr-3" />
                Event Attendance
              </Button>

              <Separator className="my-4" />

              <Button
                variant="outline"
                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
                onClick={handleEditEvent}
              >
                <Pencil className="w-4 h-4 mr-3" />
                Edit Event
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start text-sm"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash className="w-4 h-4 mr-3" />
                {isDeleting ? "Deleting..." : "Delete Event"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone and will permanently remove all event data including attendance records."
        onConfirm={handleDelete}
        confirmText="Delete Event"
        cancelText="Cancel"
        isDestructive={true}
        requireExactMatch="DELETE"
      />
    </>
  );
};

EventActionsSidebar.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isRecurring: PropTypes.bool,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
  userAttendances: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      checkInTime: PropTypes.string,
      checkOutTime: PropTypes.string,
      status: PropTypes.string,
      sessionId: PropTypes.number,
    })
  ),
  isLoadingAttendance: PropTypes.bool,
  currentSession: PropTypes.shape({
    id: PropTypes.number,
    eventId: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }),
};

export default EventActionsSidebar;
