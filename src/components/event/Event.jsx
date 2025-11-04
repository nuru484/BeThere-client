// src/components/Event.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteEvent } from "@/hooks/useEvent";
import {
  Calendar,
  MapPin,
  Tag,
  Repeat,
  Pencil,
  Trash,
  ArrowLeft,
  CheckCircle,
  LogOut,
  Users,
  Clock,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import PropTypes from "prop-types";

const Event = ({ event, onBack }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: deleteEvent, isPending } = useDeleteEvent();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const handleDelete = () => {
    deleteEvent({ id: event.id });
    if (onBack) {
      onBack();
    } else {
      navigate("/dashboard/events");
    }
    setDeleteDialogOpen(false);
  };

  const handleClockIn = () => {
    navigate(`/dashboard/events/${event.id}/attendance-in`);
  };

  const handleClockOut = () => {
    navigate(`/dashboard/events/${event.id}/attendance-out`);
  };

  const handleViewAttendance = () => {
    navigate(`/dashboard/events/${event.id}/attendance`);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/dashboard/events");
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not specified";

  const formatTime = (time) => time || "Not specified";

  const formatRecurrenceInfo = () => {
    if (!event.isRecurring) return null;

    const interval = event.recurrenceInterval || 1;
    const intervalText = interval === 1 ? "day" : `${interval} days`;

    return `Every ${intervalText}`;
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="shadow-sm border-0">
            <CardContent className="p-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>

            <div className="flex items-center gap-3">
              {/* Attendance Management - Only for non-admins */}
              {!isAdmin && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={handleClockIn}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Clock In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal-200 text-teal-700 hover:bg-teal-50"
                    onClick={handleClockOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Clock Out
                  </Button>
                </div>
              )}

              {/* View Attendance - Only for admins */}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={handleViewAttendance}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Attendance
                </Button>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() =>
                        navigate(`/dashboard/events/update/${event.id}`)
                      }
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-0">
              <CardContent className="p-8">
                {/* Event Title and Type */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                      {event.title}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 px-3 py-1.5 font-medium"
                    >
                      <Tag className="w-3 h-3 mr-1.5" />
                      {event.type}
                    </Badge>
                  </div>

                  {event.description && (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>

                <Separator className="my-8" />

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date & Time */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Date & Time
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-500 w-12">
                              Start:
                            </span>
                            <span className="text-gray-900">
                              {formatDate(event.startDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">
                              {formatTime(event.startTime)}
                            </span>
                          </div>
                          {event.endDate && (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-gray-500 w-12">
                                  End:
                                </span>
                                <span className="text-gray-900">
                                  {formatDate(event.endDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600">
                                  {formatTime(event.endTime)}
                                </span>
                              </div>
                            </>
                          )}
                          {event.durationDays && (
                            <div className="flex items-center gap-2 text-sm mt-2 pt-2 border-t border-gray-100">
                              <span className="font-medium text-gray-500">
                                Duration:
                              </span>
                              <span className="text-gray-600">
                                {event.durationDays}{" "}
                                {event.durationDays === 1 ? "day" : "days"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Recurrence */}
                    {event.isRecurring && (
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Repeat className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Recurrence
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {formatRecurrenceInfo()}
                          </p>
                          {event.recurrenceInterval && (
                            <p className="text-gray-500 text-xs mt-1">
                              Interval: {event.recurrenceInterval}{" "}
                              {event.recurrenceInterval === 1 ? "day" : "days"}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Location
                        </h3>
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">
                            {event.location?.name || "No location specified"}
                          </p>
                          {(event.location?.city ||
                            event.location?.country) && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Globe className="w-3 h-3" />
                              <span>
                                {event.location.city}
                                {event.location.city && event.location.country
                                  ? ", "
                                  : ""}
                                {event.location.country}
                              </span>
                            </div>
                          )}
                          {event.location?.latitude &&
                            event.location?.longitude && (
                              <p className="text-xs text-gray-500 font-mono">
                                {event.location.latitude},{" "}
                                {event.location.longitude}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Clock In/Out buttons - Only for non-admins */}
                {!isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={handleClockIn}
                    >
                      <CheckCircle className="w-4 h-4 mr-3" />
                      Clock In to Event
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-teal-200 text-teal-700 hover:bg-teal-50"
                      onClick={handleClockOut}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Clock Out of Event
                    </Button>
                  </>
                )}

                {/* View Attendance - Only for admins */}
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={handleViewAttendance}
                  >
                    <Users className="w-4 h-4 mr-3" />
                    View Attendance Report
                  </Button>
                )}

                {/* Admin Actions */}
                {isAdmin && (
                  <>
                    <Separator className="my-4" />
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() =>
                        navigate(`/dashboard/events/update/${event.id}`)
                      }
                    >
                      <Pencil className="w-4 h-4 mr-3" />
                      Edit Event
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash className="w-4 h-4 mr-3" />
                      Delete Event
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isRecurring: PropTypes.bool,
    recurrenceInterval: PropTypes.number,
    durationDays: PropTypes.number,
    location: PropTypes.shape({
      name: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      city: PropTypes.string,
      country: PropTypes.string,
    }),
  }).isRequired,
  onBack: PropTypes.func,
};

export default Event;
