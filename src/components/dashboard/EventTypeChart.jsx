// src/components/dashboard/EventTypeChart.jsx
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EventTypeChart = ({ eventTypeBreakdown }) => {
  const data = [
    {
      name: "Recurring Events",
      value: eventTypeBreakdown?.recurring || 0,
      fill: "#8b5cf6",
    },
    {
      name: "Non-Recurring Events",
      value: eventTypeBreakdown?.nonRecurring || 0,
      fill: "#06b6d4",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-base sm:text-lg md:text-xl">
          Attendance by Event Type
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            barSize={40}
            maxBarSize={50}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              className="text-xs sm:text-sm"
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10 }}
              width={100}
              className="text-xs sm:text-sm"
              interval={0}
            />
            <Tooltip
              contentStyle={{
                fontSize: "12px",
                padding: "8px",
                borderRadius: "6px",
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

EventTypeChart.propTypes = {
  eventTypeBreakdown: PropTypes.shape({
    recurring: PropTypes.number,
    nonRecurring: PropTypes.number,
  }),
};

export default EventTypeChart;
