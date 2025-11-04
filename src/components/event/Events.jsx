import { useGetEvents, useDeleteEvent } from "@/hooks/useEvent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EventListItem from "./EventListItem";

const Events = () => {
  const { events, isLoading, isError, error, refetchEvents } = useGetEvents();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: deleteEvent, isPending: isDeletePending } = useDeleteEvent();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(
        { id },
        {
          onSuccess: () => {
            refetchEvents();
          },
        }
      );
    }
  };

  if (isLoading || isDeletePending) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="space-y-6 w-full max-w-4xl mx-auto mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="w-full shadow-md border-none rounded-xl bg-white"
            >
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <Card className="w-full max-w-4xl mx-auto mt-8 shadow-md border-none rounded-xl bg-white">
          <CardContent className="p-6">
            <div className="text-red-500 text-lg">{error?.message}</div>
            <Button
              variant="outline"
              className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors rounded-md"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-emerald-600" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!events?.data?.length) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <Card className="w-full max-w-4xl mx-auto mt-8 shadow-md border-none rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Available Events
              </CardTitle>
              {user?.role === "ADMIN" && (
                <Button
                  className="bg-white text-emerald-700 border-white hover:bg-emerald-50 hover:text-emerald-800 transition-colors rounded-md"
                  onClick={() => navigate("/dashboard/events/create")}
                >
                  Create Event
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              No events available at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-md border-none rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Available Events
              </CardTitle>
              {user?.role === "ADMIN" && (
                <Button
                  className="bg-white text-emerald-700 border-white hover:bg-emerald-50 hover:text-emerald-800 transition-colors rounded-md"
                  onClick={() => navigate("/dashboard/events/create")}
                >
                  Create Event
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {events.data.map((event) => (
                <div key={event.id} className="p-6">
                  <EventListItem
                    event={event}
                    onDelete={
                      user?.role === "ADMIN"
                        ? () => handleDelete(event.id)
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;
