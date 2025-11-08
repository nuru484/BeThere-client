// src/components/event/EventActionsSidebar.jsx
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, Users, LogIn, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import PropTypes from "prop-types";
import { useState } from "react";

const EventActionsSidebar = ({ event, isAdmin, onDelete, isDeleting }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleEditEvent = () => {
    navigate(`/dashboard/events/update/${event.id}`);
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
          {/* User Actions - Sign In/Out */}
          {!isAdmin && (
            <>
              <Button
                variant="outline"
                className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-sm"
                onClick={handleSignIn}
              >
                <LogIn className="w-4 h-4 mr-3" />
                Sign In to Event
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-teal-200 text-teal-700 hover:bg-teal-50 text-sm"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out of Event
              </Button>
            </>
          )}

          {/* Admin Actions */}
          {isAdmin && (
            <>
              <Button
                variant="outline"
                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                onClick={handleViewAttendance}
              >
                <Users className="w-4 h-4 mr-3" />
                View Attendance Report
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
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

export default EventActionsSidebar;
