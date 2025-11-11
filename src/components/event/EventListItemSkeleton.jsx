// src/components/events/EventListItemSkeleton.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EventListItemSkeleton = () => {
  return (
    <Card className="w-full max-w-5xl mx-auto overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          {/* Event Information */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex flex-col gap-2">
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-3/4 sm:w-2/3" />

                {/* Badge Skeleton */}
                <Skeleton className="h-5 w-24" />

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 hidden sm:block" />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-6">
              {/* Date Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-36" />
              </div>
              {/* Location Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mt-auto">
              <Skeleton className="h-9 w-full sm:w-20" />
              <Skeleton className="h-9 w-full sm:w-20" />
              <Skeleton className="h-9 w-full sm:w-20" />
              <Skeleton className="h-9 w-full sm:w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventListItemSkeleton;
