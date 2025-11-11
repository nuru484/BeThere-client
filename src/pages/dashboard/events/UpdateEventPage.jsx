// src/pages/UpdateEventPage.jsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarCog } from "lucide-react";
import EventForm from "@/components/event/EventForm";
import EventFormSkeleton from "@/components/event/EventFormSkeleton";
import { Button } from "@/components/ui/button";
import { useUpdateEvent, useGetEvent } from "@/hooks/useEvent";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import { eventValidationSchema } from "@/validation/eventValidation";
import { usePageTitle } from "@/hooks/usePageTitle";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Skeleton } from "@/components/ui/skeleton";

const UpdateEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  usePageTitle("Update Event");

  const {
    data: eventData,
    isLoading: isFetchingEvent,
    isError: isFetchError,
    error: fetchError,
    refetch,
  } = useGetEvent(eventId);

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  const defaultValues = useMemo(() => {
    if (!eventData?.data) return null;

    return {
      title: eventData.data.title,
      description: eventData.data.description || "",
      startDate: eventData.data.startDate
        ? new Date(eventData.data.startDate).toISOString().split("T")[0]
        : "",
      endDate: eventData.data.endDate
        ? new Date(eventData.data.endDate).toISOString().split("T")[0]
        : "",
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
    };
  }, [eventData]);

  const form = useForm({
    resolver: zodResolver(eventValidationSchema),
    values: defaultValues || undefined,
  });

  const handleSubmit = (data) => {
    const transformedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      ...(data.isRecurring &&
        data.recurrenceInterval && {
          recurrenceInterval: data.recurrenceInterval,
        }),
      ...(data.durationDays && { durationDays: data.durationDays }),
    };

    updateEvent(
      { eventId, data: transformedData },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Event updated successfully!");
          navigate(`/dashboard/events/${eventId}`);
        },
        onError: (err) => {
          console.error("Event update error:", err);

          const { message, fieldErrors, hasFieldErrors } =
            extractApiErrorMessage(err);

          if (hasFieldErrors && fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
              form.setError(field, {
                message: errorMessage,
              });
            });
            toast.error(message);
          } else {
            toast.error(message || "Failed to update event. Please try again.");
          }
        },
      }
    );
  };

  const handleGoBack = () => {
    navigate("/dashboard/events");
  };

  // Error state
  if (isFetchError) {
    const { message } = extractApiErrorMessage(fetchError);
    return <ErrorMessage error={message} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="space-y-3 sm:space-y-0">
        {/* Back Button - Mobile Only */}
        <div className="flex justify-end sm:hidden">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back
          </Button>
        </div>

        {/* Header with Back Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <CalendarCog className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">
                Update Event
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 sm:mt-1.5 leading-snug">
                Edit the details to update the event
              </p>
            </div>
          </div>

          {/* Back Button - Desktop Only */}
          <Button
            variant="outline"
            className="hidden sm:flex border-gray-200 text-gray-700 hover:bg-gray-50 flex-shrink-0"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      {/* Loading state - Show skeleton */}
      {isFetchingEvent ? (
        <>
          {/* Event Info Banner Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>

          <EventFormSkeleton />
        </>
      ) : (
        <>
          {/* Event Info Banner */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-gray-500">Editing Event</p>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 break-words">
                {eventData?.data?.title}
              </h2>
            </div>
          </div>

          <EventForm
            form={form}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            mode="update"
          />
        </>
      )}
    </div>
  );
};

export default UpdateEventPage;
