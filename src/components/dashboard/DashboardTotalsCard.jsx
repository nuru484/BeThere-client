// src/components/DashboardTotalsCard.jsx
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CalendarCheck, Activity } from "lucide-react";

const DashboardTotalsCard = ({ totals, isAdmin = false }) => {
  const getIcon = (key) => {
    const iconMap = {
      totalUsers: Users,
      totalEvents: Calendar,
      totalRecurringEvents: CalendarCheck,
      totalNonRecurringEvents: Calendar,
      totalActiveSessions: Activity,
      totalInactiveSessions: Activity,
    };
    const Icon = iconMap[key] || Calendar;
    return <Icon className="h-4 w-4 text-muted-foreground" />;
  };

  const getLabel = (key) => {
    const labelMap = {
      totalUsers: "Total Users",
      totalEvents: "Total Events",
      totalRecurringEvents: "Recurring Events",
      totalNonRecurringEvents: "Non-Recurring Events",
      totalActiveSessions: "Active Sessions",
      totalInactiveSessions: "Inactive Sessions",
    };
    return labelMap[key] || key;
  };

  const getCardColor = (key) => {
    const colorMap = {
      totalUsers: "border-blue-200 bg-blue-50",
      totalEvents: "border-purple-200 bg-purple-50",
      totalRecurringEvents: "border-green-200 bg-green-50",
      totalNonRecurringEvents: "border-orange-200 bg-orange-50",
      totalActiveSessions: "border-emerald-200 bg-emerald-50",
      totalInactiveSessions: "border-gray-200 bg-gray-50",
    };
    return colorMap[key] || "border-gray-200 bg-gray-50";
  };

  const displayOrder = isAdmin
    ? [
        "totalUsers",
        "totalEvents",
        "totalRecurringEvents",
        "totalNonRecurringEvents",
      ]
    : [
        "totalRecurringEvents",
        "totalNonRecurringEvents",
        "totalActiveSessions",
        "totalInactiveSessions",
      ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayOrder.map((key) => (
        <Card
          key={key}
          className={`${getCardColor(key)} transition-all hover:shadow-md`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {getLabel(key)}
            </CardTitle>
            {getIcon(key)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals[key] !== undefined ? totals[key] : 0}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// PropTypes validation
DashboardTotalsCard.propTypes = {
  totals: PropTypes.shape({
    totalUsers: PropTypes.number,
    totalEvents: PropTypes.number,
    totalRecurringEvents: PropTypes.number,
    totalNonRecurringEvents: PropTypes.number,
    totalActiveSessions: PropTypes.number,
    totalInactiveSessions: PropTypes.number,
  }).isRequired, // totals must be passed in

  isAdmin: PropTypes.bool,
};

export default DashboardTotalsCard;
