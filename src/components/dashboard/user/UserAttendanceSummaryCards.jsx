// src/components/dashboard/user/UserAttendanceSummaryCards.jsx
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Calendar } from "lucide-react";

const UserAttendanceSummaryCards = ({ summary }) => {
  if (!summary) return null;

  const cards = [
    {
      title: "Total Attendances",
      value: summary.totalAttendances,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Present",
      value: summary.statusBreakdown.present,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Late",
      value: summary.statusBreakdown.late,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Absent",
      value: summary.statusBreakdown.absent,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`${card.bgColor} ${card.borderColor} transition-all hover:shadow-md`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              {card.title === "Total Attendances" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.dateRange.from} to {summary.dateRange.to}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

UserAttendanceSummaryCards.propTypes = {
  summary: PropTypes.shape({
    totalAttendances: PropTypes.number,
    dateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    statusBreakdown: PropTypes.shape({
      present: PropTypes.number,
      late: PropTypes.number,
      absent: PropTypes.number,
    }),
  }),
};

export default UserAttendanceSummaryCards;
