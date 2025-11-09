// src/components/dashboard/AttendanceBarChart.jsx
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AttendanceBarChart = ({ statusCounts, statusPercentages }) => {
  const data = [
    {
      name: "Present",
      count: statusCounts?.present || 0,
      percentage: parseFloat(statusPercentages?.present || 0),
      fill: "#10b981",
    },
    {
      name: "Late",
      count: statusCounts?.late || 0,
      percentage: parseFloat(statusPercentages?.late || 0),
      fill: "#f59e0b",
    },
    {
      name: "Absent",
      count: statusCounts?.absent || 0,
      percentage: parseFloat(statusPercentages?.absent || 0),
      fill: "#ef4444",
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm">Count: {payload[0].payload.count}</p>
          <p className="text-sm">
            Percentage: {payload[0].payload.percentage.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        payload: PropTypes.shape({
          name: PropTypes.string,
          count: PropTypes.number,
          percentage: PropTypes.number,
        }),
      })
    ),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: "Count", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="count" name="Attendance Count" radius={[8, 8, 0, 0]}>
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

AttendanceBarChart.propTypes = {
  statusCounts: PropTypes.shape({
    present: PropTypes.number,
    late: PropTypes.number,
    absent: PropTypes.number,
  }),
  statusPercentages: PropTypes.shape({
    present: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    late: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    absent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

export default AttendanceBarChart;
