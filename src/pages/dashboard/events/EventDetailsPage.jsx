// src/pages/dashboard/events/EventDetails.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteEvent, useGetEvent } from "@/hooks/useEvent";
import { useGetUserEventAttendance } from "@/hooks/useAttendance";
import { ArrowLeft, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import EventDetails from "@/components/event/EventDetails";
import EventActionsSidebar from "@/components/event/EventActionsSidebar";
import { getCurrentSession } from "@/utils/getCurrentSession";
import { useMemo } from "react";
import toast from "react-hot-toast";

const EventDetailsPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const {
    data: eventData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEvent(eventId);

  const { data: userAttendanceData, isLoading: isLoadingAttendance } =
    useGetUserEventAttendance(user?.id, eventId, {
      limit: 100,
    });

  const event = eventData?.data;
  const userAttendances = userAttendanceData?.data || [];

  // Determine the current session for recurring events
  const currentSession = useMemo(() => {
    if (event?.isRecurring) {
      return getCurrentSession(event);
    }
    return null;
  }, [event]);

  const handleDelete = () => {
    deleteEvent(
      { eventId },
      {
        onSuccess: (response) => {
          toast.success(response.data.message || "Event deleted successfully");
          navigate("/dashboard/events");
        },
        onError: (error) => {
          const { message } = extractApiErrorMessage(error);
          toast.error(message || "Failed to deleted event");
        },
      }
    );
  };

  const handleBack = () => {
    navigate("/dashboard/events");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="max-w-7xl mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md sticky top-6">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = extractApiErrorMessage(error).message;
    return <ErrorMessage error={errorMessage} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Professional Header */}
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 sm:pb-6 border-b">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight line-clamp-1">
              {event?.title || "Event Details"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
              View event information and details
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-2"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back to Events</span>
            <span className="xs:hidden">Back</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <EventDetails event={event} />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <EventActionsSidebar
                event={event}
                user={user}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                userAttendances={userAttendances}
                isLoadingAttendance={isLoadingAttendance}
                currentSession={currentSession}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
