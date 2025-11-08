// src/components/dashboard/DateRangeSelector.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const DateRangeSelector = ({ onDateChange, isLoading }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(
    format(subDays(today, 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"));

  const handleApply = () => {
    onDateChange({ startDate, endDate });
  };

  const setQuickRange = (days) => {
    const end = new Date();
    const start = subDays(end, days);
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
    onDateChange({
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    });
  };

  const setMonthRange = () => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
    onDateChange({
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Select Date Range</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickRange(7)}
              disabled={isLoading}
            >
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickRange(30)}
              disabled={isLoading}
            >
              Last 30 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={setMonthRange}
              disabled={isLoading}
            >
              This Month
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              disabled={isLoading}
            >
              Apply Custom Range
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

DateRangeSelector.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default DateRangeSelector;
