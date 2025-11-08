// src/components/dashboard/skeletons/AttendanceDataSkeleton.jsx
import SummaryCardsSkeleton from "./SummaryCardsSkeleton";
import ChartSkeleton from "./ChartSkeleton";
import PieChartSkeleton from "./PieChartSkeleton";

const AttendanceDataSkeleton = () => {
  return (
    <div className="space-y-6">
      <SummaryCardsSkeleton />

      <div className="w-full overflow-hidden">
        <ChartSkeleton height="h-96" />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="w-full overflow-hidden">
          <ChartSkeleton height="h-80" />
        </div>
        <div className="w-full overflow-hidden">
          <PieChartSkeleton />
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <ChartSkeleton height="h-72" />
      </div>
    </div>
  );
};

export default AttendanceDataSkeleton;
