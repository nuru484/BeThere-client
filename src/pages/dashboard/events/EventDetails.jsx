// src/pages/dashboard/events/EventDetails.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteEvent, useGetEvent } from "@/hooks/useEvent";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EventDetails from "@/components/event/EventDetails";
import EventActionsSidebar from "@/components/event/EventActionsSidebar";

const EventDetailsPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useAuth();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const { data: eventData, isLoading, isError, error } = useGetEvent(eventId);

  const isAdmin = user?.role === "ADMIN";
  const event = eventData?.data;

  const handleDelete = () => {
    deleteEvent(
      { eventId },
      {
        onSuccess: () => {
          navigate("/dashboard/events");
        },
      }
    );
  };

  const handleBack = () => {
    navigate("/dashboard/events");
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="shadow-sm border-0">
            <CardContent className="p-6 sm:p-8">
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

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="shadow-sm border-0">
            <CardContent className="p-6 sm:p-8">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.response?.data?.message ||
                    "Failed to load event. Please try again."}
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="mt-4" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No event data
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="shadow-sm border-0">
            <CardContent className="p-6 sm:p-8">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Event not found.</AlertDescription>
              </Alert>
              <Button variant="outline" className="mt-4" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm sm:text-base"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Event Details - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>

          {/* Actions Sidebar - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <EventActionsSidebar
              event={event}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
