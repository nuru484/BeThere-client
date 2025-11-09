// src/components/events/EventListItem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Tag,
  Eye,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useDeleteEvent } from "@/hooks/useEvent";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useAuth } from "@/hooks/useAuth";

const EventListItem = ({ event }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: deleteEvent, isLoading: isDeleting } = useDeleteEvent();

  const { id, title, type, location, date, description } = event;

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/dashboard/events/${id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/dashboard/events/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      deleteEvent(
        { eventId: id },
        {
          onSuccess: () => {
            toast.success("Event deleted successfully");
            setShowDeleteDialog(false);
          },
          onError: (error) => {
            const { message } = extractApiErrorMessage(error);
            console.error("Failed to delete event:", error);
            toast.error(message || "Failed to delete event");
          },
        }
      );
    } catch (error) {
      const { message } = extractApiErrorMessage(error);
      console.error("Failed to delete event:", error);
      toast.error(message || "Failed to delete event");
    }
  };

  const handleSignIn = (e) => {
    e.stopPropagation();
    navigate(`/dashboard/events/${id}/attendance-in`);
  };

  const handleSignOut = (e) => {
    e.stopPropagation();
    navigate(`/dashboard/events/${id}/attendance-out`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Card className="w-full max-w-5xl mx-auto hover:shadow-lg transition-all duration-300 hover:scale-[1.01] group overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col h-full">
            {/* Event Information */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
              {/* Header */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex flex-col gap-2">
                  {/* Title */}
                  <h3 className="font-semibold text-foreground text-base sm:text-lg lg:text-xl break-words">
                    {title}
                  </h3>

                  {/* Badge */}
                  <Badge
                    variant="secondary"
                    className="text-xs flex items-center gap-1 bg-emerald-100 text-emerald-800 w-fit"
                  >
                    <Tag className="h-3 w-3 shrink-0" />
                    <span className="break-words">{type}</span>
                  </Badge>

                  {/* Description */}
                  {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 break-words">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm text-muted-foreground mb-6">
                {date && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-medium break-words">
                      {formatDate(date)}
                    </span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="break-words">
                      {location.name}
                      {location.city && `, ${location.city}`}
                      {location.country && `, ${location.country}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleView}
                  className="group-hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="hidden sm:inline truncate">View</span>
                  <span className="sm:hidden truncate">Details</span>
                </Button>

                {isAdmin ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="cursor-pointer"
                      disabled={isDeleting}
                    >
                      <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                      className="text-destructive hover:text-destructive hover:border-destructive/50 cursor-pointer col-span-2 sm:col-span-1"
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="hidden sm:inline truncate">Delete</span>
                      <span className="sm:hidden truncate">Del</span>
                    </Button>
                  </>
                ) : null}

                {/* Sign In/Out Buttons - Available to all users */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSignIn}
                  className={`cursor-pointer bg-emerald-600 hover:bg-emerald-700 ${
                    isAdmin ? "sm:col-span-1" : ""
                  }`}
                >
                  <LogIn className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="hidden sm:inline truncate">Sign In</span>
                  <span className="sm:hidden truncate">In</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className={`cursor-pointer ${isAdmin ? "sm:col-span-1" : ""}`}
                >
                  <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="hidden sm:inline truncate">Sign Out</span>
                  <span className="sm:hidden truncate">Out</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog - Only for Admins */}
      {isAdmin && (
        <ConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Event"
          description={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          confirmText="Delete"
          isDestructive
        />
      )}
    </>
  );
};

EventListItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    date: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.shape({
      name: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
    }),
  }).isRequired,
};

export default EventListItem;
