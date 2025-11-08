// src/components/dashboard/skeletons/DashboardSkeleton.jsx
import DashboardTotalsCardSkeleton from "./DashboardTotalsCardSkeleton";
import DateRangeSelectorSkeleton from "./DateRangeSelectorSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <DashboardTotalsCardSkeleton />
        <DateRangeSelectorSkeleton />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
