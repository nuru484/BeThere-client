// src/pages/UpdateEventPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateEvent, useGetEvent } from "@/hooks/useEvent";
import EventForm from "@/components/event/EventForm";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import toast from "react-hot-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const UpdateEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  usePageTitle("Update Event");

  const {
    data: eventData,
    isLoading: isFetchingEvent,
    isError: isFetchError,
    error: fetchError,
  } = useGetEvent(eventId);

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  const handleSubmit = (data) => {
    updateEvent(
      { eventId, data },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Event updated successfully!");
          navigate(`/events/${eventId}`);
        },
        onError: (err) => {
          console.error("Event update error:", err);

          const { message, fieldErrors, hasFieldErrors } =
            extractApiErrorMessage(err);

          if (hasFieldErrors && fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
              toast.error(`${field}: ${errorMessage}`);
            });
          }

          if (!hasFieldErrors || message) {
            toast.error(message || "Failed to update event. Please try again.");
          }
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  // Loading state
  if (isFetchingEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isFetchError) {
    const { message } = extractApiErrorMessage(fetchError);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Event
          </h2>
          <p className="text-gray-600 mb-6">
            {message || "Failed to load event details. Please try again."}
          </p>
          <Button
            onClick={() => navigate("/events")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  // Transform event data for form default values
  const defaultValues = eventData?.data
    ? {
        title: eventData.data.title,
        description: eventData.data.description || "",
        startDate: eventData.data.startDate,
        endDate: eventData.data.endDate || "",
        startTime: eventData.data.startTime,
        endTime: eventData.data.endTime,
        isRecurring: eventData.data.isRecurring,
        recurrenceInterval: eventData.data.recurrenceInterval || undefined,
        durationDays: eventData.data.durationDays || undefined,
        type: eventData.data.type,
        location: {
          name: eventData.data.location?.name || "",
          latitude: eventData.data.location?.latitude || 0,
          longitude: eventData.data.location?.longitude || 0,
          city: eventData.data.location?.city || "",
          country: eventData.data.location?.country || "",
        },
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Event Info Banner */}
        <div className="bg-white border border-emerald-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Editing Event</p>
              <h1 className="text-xl font-bold text-gray-800">
                {eventData?.data?.title}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Event ID</p>
              <p className="text-sm font-semibold text-emerald-600">
                #{eventId}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <EventForm
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          defaultValues={defaultValues}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default UpdateEventPage;
