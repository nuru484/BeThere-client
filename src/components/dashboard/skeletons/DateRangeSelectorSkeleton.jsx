// src/components/dashboard/skeletons/DateRangeSelectorSkeleton.jsx
import { Card, CardContent } from "@/components/ui/card";

const DateRangeSelectorSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-8 w-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeSelectorSkeleton;
