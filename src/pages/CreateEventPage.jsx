import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateEvent } from "@/hooks/useEvent";
import EventForm from "@/components/event/EventForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CreateEventPage = () => {
  const { mutate: createEvent, isPending, isError, error } = useCreateEvent();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    createEvent(data, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  const handleRedirect = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto min-h-screen ">
      <div>
        <EventForm
          onSubmit={onSubmit}
          isLoading={isPending}
          onCancel={() => {
            navigate(`/dashboard/events`);
          }}
        />
      </div>

      {isError && (
        <Alert className="w-11/12 max-w-lg fixed top-4 left-1/2 -translate-x-1/2 border-red-600 mt-4">
          <AlertDescription className="text-red-600">
            {error?.message}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <AlertDialog
          open={success}
          onOpenChange={() => {}}
          aria-live="assertive"
        >
          <AlertDialogContent>
            <AlertDialogTitle role="alert">
              Event Created Successfully.
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your event creation was successful! Click &quot;Okay&quot; to
              proceed to your dashboard.
            </AlertDialogDescription>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-500"
              onClick={handleRedirect}
              aria-label="Proceed to Dashboard"
            >
              Okay
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default CreateEventPage;
