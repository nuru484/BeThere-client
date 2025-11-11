// src/pages/CreateEventPage.jsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import EventForm from "@/components/event/EventForm";
import { Button } from "@/components/ui/button";
import { useCreateEvent } from "@/hooks/useEvent";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import { eventValidationSchema } from "@/validation/eventValidation";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { mutate: createEvent, isPending } = useCreateEvent();

  const defaultValues = useMemo(
    () => ({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      isRecurring: false,
      recurrenceInterval: undefined,
      durationDays: undefined,
      type: "",
      location: {
        name: "",
        latitude: 0,
        longitude: 0,
        city: "",
        country: "",
      },
    }),
    []
  );

  const form = useForm({
    resolver: zodResolver(eventValidationSchema),
    defaultValues,
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

    createEvent(transformedData, {
      onSuccess: (response) => {
        toast.success(response.message || "Event created successfully!");
        navigate("/dashboard/events");
      },
      onError: (err) => {
        console.error("Event creation error:", err);

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
          toast.error(message || "Failed to create event. Please try again.");
        }
      },
    });
  };

  const handleGoBack = () => {
    navigate("/dashboard/events");
  };

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
            <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
              <CalendarPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">
                Create Event
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 sm:mt-1.5 leading-snug">
                Fill in the details to create a new event
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

      <EventForm
        form={form}
        onSubmit={handleSubmit}
        isLoading={isPending}
        mode="create"
      />
    </div>
  );
};

export default CreateEventPage;
