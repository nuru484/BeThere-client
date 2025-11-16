// src/pages/EventsPage.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useGetEvents, useDeleteAllEvents } from "@/hooks/useEvent";
import toast from "react-hot-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useAuth } from "@/hooks/useAuth";
import EventList from "@/components/event/EventList";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    search: undefined,
    type: undefined,
    location: undefined,
  });

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEvents({
    page,
    limit,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    ),
  });

  const { mutate: deleteAllEvents, isLoading: isDeletingAll } =
    useDeleteAllEvents();

  const handlePageChange = (newPage) => setPage(newPage);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1);
  }, []);

  const handleCreateEvent = () => {
    navigate("/dashboard/events/create");
  };

  const handleDeleteAllEvents = async () => {
    const toastId = toast.loading("Deleting Events...");

    try {
      deleteAllEvents(undefined, {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success("All events deleted successfully");
          setShowDeleteDialog(false);
        },
        onError: (error) => {
          const { message } = extractApiErrorMessage(error);
          console.error("Failed to delete all events:", error);
          toast.dismiss(toastId);
          toast.error(message || "Failed to delete all events");
        },
      });
    } catch (error) {
      const { message } = extractApiErrorMessage(error);
      console.error("Failed to delete all events:", error);
      toast.dismiss(toastId);
      toast.error(message || "Failed to delete all events");
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <EventList
        data={eventsData?.data || []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        meta={
          eventsData?.pagination || {
            totalRecords: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          }
        }
        filters={filters}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onFiltersChange={handleFiltersChange}
        onRefetch={refetch}
        headerActions={
          isAdmin && (
            <>
              <Button
                onClick={handleCreateEvent}
                size="sm"
                className="flex-1 sm:flex-none gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Create Event</span>
                <span className="xs:hidden">Create</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeletingAll}
                className="flex-1 sm:flex-none gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="">Delete All Events</span>
              </Button>
            </>
          )
        }
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete All Events"
        description="Are you sure you want to delete all events? This action cannot be undone."
        onConfirm={handleDeleteAllEvents}
        confirmText="Delete"
        requireExactMatch="Delete All Events"
        isDestructive
      />
    </div>
  );
}
