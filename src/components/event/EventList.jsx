// src/components/events/EventList.jsx
import EventListItem from "./EventListItem";
import EventListItemSkeleton from "./EventListItemSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Search } from "lucide-react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import Pagination from "@/components/ui/Pagination";
import PropTypes from "prop-types";

const EventList = ({
  data,
  isLoading,
  isError,
  error,
  meta,
  onPageChange,
  onLimitChange,
  onRefetch,
  headerActions,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="max-w-5xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 sm:pb-6 border-b">
          {/* Title Section Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-7 sm:h-8 w-32 sm:w-40" />
              <Skeleton className="h-4 w-24 sm:w-32" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        {/* Event List Item Skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <EventListItemSkeleton key={i} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = extractApiErrorMessage(error).message;
    return <ErrorMessage error={errorMessage} onRetry={onRefetch} />;
  }

  const eventCount = data?.length || 0;

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="max-w-5xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 sm:pb-6 border-b">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Events
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
              {meta.total.toLocaleString()} event{meta.total !== 1 ? "s" : ""}{" "}
              {meta.total === 0 ? "available" : "found"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {headerActions && (
          <div className="flex items-center gap-2 sm:gap-3">
            {headerActions}
          </div>
        )}
      </div>

      {/* Event List */}
      {eventCount > 0 ? (
        <>
          <div className="space-y-4">
            {data.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            meta={meta}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            showPageSizeSelector={true}
            pageSizeOptions={[10, 25, 50]}
          />
        </>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              No Events Found
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              No events available at the moment. Check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

EventList.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  error: PropTypes.object,
  meta: PropTypes.shape({
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onRefetch: PropTypes.func.isRequired,
  headerActions: PropTypes.node,
};

export default EventList;
