// src/pages/CreateEventPage.jsx
import EventForm from "@/components/event/EventForm";
import { useCreateEvent } from "@/hooks/useEvent";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { mutate: createEvent, isPending } = useCreateEvent();

  const handleSubmit = (data) => {
    createEvent(data, {
      onSuccess: (response) => {
        toast.success(response.message || "Event created successfully!");
        navigate("/events");
      },
      onError: (err) => {
        console.error("Event creation error:", err);

        const { message, fieldErrors, hasFieldErrors } =
          extractApiErrorMessage(err);

        if (hasFieldErrors && fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
            toast.error(`${field}: ${errorMessage}`);
          });
        }

        if (!hasFieldErrors || message) {
          toast.error(message || "Failed to create event. Please try again.");
        }
      },
    });
  };

  return (
    <div className="container mx-auto py-8">
      <EventForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        onCancel={() => navigate("/events")}
      />
    </div>
  );
};

export default CreateEventPage;
