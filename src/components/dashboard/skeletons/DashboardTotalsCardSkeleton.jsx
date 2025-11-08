// src/components/dashboard/skeletons/DashboardTotalsCardSkeleton.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DashboardTotalsCardSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardTotalsCardSkeleton;
