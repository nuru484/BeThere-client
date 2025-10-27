// src/components/dashboard/DashboardStatCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gray-100 rounded-lg`}>
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <p className="text-xl font-bold text-red-500">Error</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 ${iconColor
              .replace("text-", "bg-")
              .replace("-600", "-100")} rounded-lg`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

DashboardStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

export default DashboardStatCard;
